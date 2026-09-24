"""
Synthesises the background track for the airport edit: a warm, light
travel groove at 100 BPM in A major (A – E – F#m – D), 32 seconds.
Everything is generated here, so there is nothing to license.

    python3 scripts/airport_music.py public/airport/music.wav
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 100
BEAT = 60 / BPM
BAR = BEAT * 4
LENGTH = 32.0

rng = np.random.default_rng(7)
t_all = np.arange(int(SR * LENGTH)) / SR
mix = np.zeros((len(t_all), 2))


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def tone(freq, dur, harmonics, detune=0.0):
    t = np.arange(int(SR * dur)) / SR
    out = np.zeros_like(t)
    for n, amp in harmonics:
        for d in (-detune, detune) if detune else (0.0,):
            out += amp * np.sin(2 * np.pi * freq * n * (1 + d) * t + rng.uniform(0, 6.28))
    return out


def env(n, attack, release, total=None):
    e = np.ones(n)
    a = min(n, int(attack * SR))
    r = min(n - a, int(release * SR))
    if a:
        e[:a] = np.linspace(0, 1, a)
    if r:
        e[n - r:] = np.linspace(1, 0, r)
    return e


def place(sig, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= len(mix):
        return
    sig = sig[: len(mix) - i]
    left = gain * (1 - max(0, pan)) * sig
    right = gain * (1 + min(0, pan)) * sig
    mix[i:i + len(sig), 0] += left
    mix[i:i + len(sig), 1] += right


# A, E, F#m, D — one chord per bar.
CHORDS = [
    (57, [57, 61, 64, 69]),
    (52, [56, 59, 64, 68]),
    (54, [57, 61, 66, 69]),
    (50, [57, 62, 66, 69]),
]
PAD = [(1, 1.0), (2, 0.35), (3, 0.18), (4, 0.08)]
PLUCK = [(1, 1.0), (3, 0.11), (5, 0.04)]
BASS = [(1, 1.0), (2, 0.25)]

bars = int(LENGTH / BAR) + 1
for b in range(bars):
    start = b * BAR
    root, notes = CHORDS[b % 4]

    # Pad: soft, detuned, slow attack.
    for k, m in enumerate(notes):
        s = tone(hz(m), BAR + 0.4, PAD, detune=0.0025)
        s *= env(len(s), 0.35, 0.5)
        place(s, start, 0.05, pan=(-0.3 if k % 2 else 0.3))

    # Bass: root on beats 1 and 3, plus a pickup on the "and" of 4.
    for beat, length in ((0, 1.6), (2, 1.2), (3.5, 0.4)):
        s = tone(hz(root - 12), length, BASS)
        s *= np.exp(-np.arange(len(s)) / SR * 2.2) * env(len(s), 0.01, 0.08)
        place(s, start + beat * BEAT, 0.16)

    # Arpeggio: eighth notes up the chord, with a dotted echo.
    order = [0, 1, 2, 3, 2, 1, 2, 3]
    for i, o in enumerate(order):
        m = notes[o] + 12
        s = tone(hz(m), 0.5, PLUCK)
        s *= np.exp(-np.arange(len(s)) / SR * 9) * env(len(s), 0.004, 0.05)
        at = start + i * BEAT / 2
        pan = -0.4 if i % 2 else 0.4
        place(s, at, 0.045, pan)
        place(s, at + BEAT * 0.75, 0.018, -pan)

    # Drums come in after the first bar.
    if b == 0:
        continue
    for beat in range(4):
        at = start + beat * BEAT
        if beat in (0, 2):
            n = int(0.35 * SR)
            tt = np.arange(n) / SR
            f = 50 + 70 * np.exp(-tt * 30)
            kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
            place(kick, at, 0.22)
        else:
            n = int(0.18 * SR)
            noise = rng.normal(0, 1, n)
            clap = (noise - np.concatenate([[0], noise[:-1]])) * np.exp(-np.arange(n) / SR * 22)
            place(clap, at, 0.03)
        for half in (0, 0.5):
            n = int(0.05 * SR)
            noise = rng.normal(0, 1, n)
            hat = np.diff(noise, prepend=0) * np.exp(-np.arange(n) / SR * 70)
            place(hat, at + half * BEAT, 0.012, pan=0.2)

# Gentle fade in/out, then normalise to -1 dBFS peak.
fade = np.ones(len(mix))
fin, fout = int(0.8 * SR), int(2.5 * SR)
fade[:fin] = np.linspace(0, 1, fin)
fade[-fout:] = np.linspace(1, 0, fout)
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) / 0.89

out = sys.argv[1] if len(sys.argv) > 1 else "music.wav"
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("wrote", out)
