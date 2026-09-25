"""Synthesize the soft sound-effect kit for the Hajj reel.

Usage: python3 scripts/hajj_sfx.py public/hajj/sfx

Everything is generated here (no downloads): filtered-noise whooshes, soft
pops, ticks, a muffled stamp, a warm bell and a message ding. Each sound gets a
short room reverb and is normalised well below full scale so it sits under the
voice without poking out.
"""

import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def t(dur):
    return np.arange(int(dur * SR)) / SR


def env(n, attack, release_curve=4.0):
    """Linear attack, exponential tail."""
    a = max(1, int(attack * SR))
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a)
    tail = np.linspace(0, 1, n - a)
    e[a:] = np.exp(-release_curve * tail)
    return e


def lowpass(x, cutoff):
    """One-pole lowpass; cutoff may be an array (sweep)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    s = 0.0
    for i in range(len(x)):
        s = (1 - a[i]) * x[i] + a[i] * s
        y[i] = s
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def bandpass(x, lo, hi):
    return lowpass(highpass(x, lo), hi)


def reverb(x, wet=0.18, length=0.45):
    n = int(length * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lowpass(ir, 5000.0)
    ir /= np.sqrt(np.sum(ir**2))
    size = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)
    out = np.zeros(size)
    out[: len(x)] += x
    return out * (1 - wet) + y * wet


def finish(x, peak_db=-9.0):
    x = reverb(x)
    fade = int(0.01 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)
    return x / (np.max(np.abs(x)) + 1e-9) * 10 ** (peak_db / 20)


def sine_sweep(f0, f1, dur, curve=3.0):
    tt = t(dur)
    f = f1 + (f0 - f1) * np.exp(-curve * tt / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


# --- the kit --------------------------------------------------------------


def whoosh(dur=0.42, lo=300, hi=3200, up=False):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    shape = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    sweep = np.linspace(lo, hi, n) if up else np.interp(
        np.linspace(0, 1, n), [0, 0.5, 1], [lo, hi, lo]
    )
    y = lowpass(highpass(x, 120.0), sweep) * shape
    return y


def swipe():
    return finish(whoosh(0.22, 500, 2600), -17)


def soft_whoosh():
    return finish(whoosh(0.45, 250, 2200), -14)


def pop():
    y = sine_sweep(820, 460, 0.09, 5) * env(int(0.09 * SR), 0.003, 6)
    return finish(lowpass(y, 3000.0), -13)


def tick():
    n = int(0.03 * SR)
    click = bandpass(rng.standard_normal(n), 1800.0, 6000.0) * env(n, 0.0005, 18)
    tone = np.sin(2 * np.pi * 2400 * t(0.03)) * env(n, 0.0005, 25) * 0.4
    return finish(click + tone, -20)


def key():
    n = int(0.04 * SR)
    y = bandpass(rng.standard_normal(n), 900.0, 4500.0) * env(n, 0.0008, 14)
    return finish(y, -22)


def stamp():
    n = int(0.35 * SR)
    body = sine_sweep(140, 55, 0.35, 6) * env(n, 0.002, 7)
    hit = lowpass(rng.standard_normal(n), 1400.0) * env(n, 0.001, 30) * 0.8
    return finish(lowpass(body + hit, 2500.0), -10)


def bell(freqs=(660.0,), dur=1.6, peak=-15):
    tt = t(dur)
    y = np.zeros_like(tt)
    for f in freqs:
        for k, (mult, amp, dec) in enumerate(
            [(1, 1.0, 3.0), (2.0, 0.35, 4.5), (3.01, 0.15, 6.0), (4.2, 0.06, 8.0)]
        ):
            y += amp * np.sin(2 * np.pi * f * mult * tt) * np.exp(-dec * tt)
    y *= env(len(tt), 0.004, 0.0)
    return finish(lowpass(y, 5000.0), peak)


def chime():
    return bell((587.33, 880.0), 1.8, -15)


def ding():
    a = bell((1318.5,), 0.5, -16)
    b = bell((1975.5,), 0.9, -16)
    gap = int(0.11 * SR)
    out = np.zeros(gap + len(b))
    out[: len(a)] += a
    out[gap:] += b
    return out / np.max(np.abs(out)) * 10 ** (-15 / 20)


def strike():
    n = int(0.24 * SR)
    y = bandpass(rng.standard_normal(n), 1200.0, np.linspace(2500, 7000, n))
    y *= np.sin(np.linspace(0, np.pi, n)) ** 0.8
    return finish(y, -19)


def send():
    up = whoosh(0.32, 400, 4200, up=True) * 0.8
    p = sine_sweep(500, 900, 0.08, 4) * env(int(0.08 * SR), 0.002, 6) * 0.6
    out = np.zeros(len(up) + len(p))
    out[: len(up)] += up
    out[int(0.26 * SR) : int(0.26 * SR) + len(p)] += p
    return finish(out, -14)


def riser():
    dur = 0.9
    n = int(dur * SR)
    x = rng.standard_normal(n)
    y = lowpass(highpass(x, 200.0), np.geomspace(300, 6000, n))
    y *= np.linspace(0, 1, n) ** 2
    y[-int(0.02 * SR) :] *= np.linspace(1, 0, int(0.02 * SR))
    return finish(y, -17)


def impact():
    s = stamp()
    c = bell((440.0, 659.25), 1.8, -14)
    out = np.zeros(max(len(s), len(c)))
    out[: len(s)] += s * 0.8
    out[: len(c)] += c
    return out / np.max(np.abs(out)) * 10 ** (-10 / 20)


def slide():
    """Soft slider glide for the worried-to-calm meter."""
    n = int(0.8 * SR)
    y = lowpass(rng.standard_normal(n), np.linspace(600, 1500, n))
    y *= np.sin(np.linspace(0, np.pi, n)) ** 2
    return finish(y, -20)


KIT = {
    "swipe": swipe,
    "whoosh": soft_whoosh,
    "pop": pop,
    "tick": tick,
    "key": key,
    "stamp": stamp,
    "chime": chime,
    "ding": ding,
    "strike": strike,
    "send": send,
    "riser": riser,
    "impact": impact,
    "slide": slide,
}


def write(path, x):
    pcm = np.clip(x, -1, 1)
    pcm = (pcm * 32767).astype(np.int16)
    stereo = np.repeat(pcm[:, None], 2, axis=1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(stereo.tobytes())


if __name__ == "__main__":
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "public/hajj/sfx")
    out.mkdir(parents=True, exist_ok=True)
    for name, make in KIT.items():
        write(out / f"{name}.wav", make())
        print(name)
