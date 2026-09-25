# ملخص الشغل — موشن جرافيك الريلز

ملف تسليم لأي شات جديد: إيه اللي اتعمل، فين، وإزاي تكمل.

## المستخدم والستايل

- صانع محتوى عقارات مصري (معتصم عبد العظيم)، ريلز بالطول **1080×1920، 30fps**.
- الستايل محفوظ في skill اسمه **`house-visual-style`** (`.claude/skills/house-visual-style/`). النسخة المستخدمة هنا: **أبيض/أحمر بس**:
  - ورق فاتح `#F5F3F0` + شبكة خفيفة جداً + grain خفيف + بريق أحمر في الأركان (`src/lib/Paper.tsx`).
  - لون مميز واحد: **أحمر `#E01A2B`**، والباقي حبر `#14100F` ورمادي.
  - عناصر عائمة بظل طويل ناعم، مايلة 6–15°، وحركة تطفو.
  - الأحمر يدخل آخر حاجة في كل مشهد.
- **الفونت العربي**: `Lifta Swash` (المستخدم بعته) → `public/fonts/Liftaswash-Regular.otf`، اسمه في الكود `font.arDisplay`.
  - وزن واحد، متحطش عليه bold.
  - **مفيهوش أرقام لاتيني ولا `%` ولا `=`** → أي رقم يتكتب بـ `font.display` (Inter Tight).
  - `…` بتطلع وحشة، متستخدمهاش.
  - فيه swash على آخر الكلمة (ذيل طويل للتاء/الكاف)، ده طبيعي.
- لاتيني: Inter Tight ExtraBold (`font.display`) + Instrument Serif Italic (`font.serif`) — الحركة المميزة: كلمة تقيلة + كلمة مايلة حمرا (زي **Hotel-** *operated*).
- المستخدم بيكتب بالمصري ويحب الرد بالمصري.

## المشروع

- الريبو: `mahmoudcontentcreator1465/claude`، البرانش: `claude/festive-goodall-jzn41e`.
- مشروع Remotion في `ramadan-real-estate/`.
- التشغيل: `npm ci` ثم `npx remotion studio` للمعاينة، أو
  `npx remotion render <CompositionId> renders/<name>.mp4`.
- Chromium مثبت في `remotion.config.ts` (`/opt/pw-browsers/...`) لأن البيئة بتمنع التحميل.
- فحص: `npx tsc` و `npx eslint src/<file>` (فيه خطأ lint قديم في `Video.tsx`/`Main.tsx` مش مننا).

### مكتبة مشتركة (`src/lib/`)

| ملف | فيه إيه |
|---|---|
| `motion.ts` | `clamp`, `ease`, `travel`, `rise()` (دخول: opacity + صعود + scale)، `float()` (طفو)، `progress()`، `sec()` (ثواني → فريمات) |
| `Paper.tsx` | خلفية الورق بالشبكة والبريق والـ grain |
| `Dissolve.tsx` | fade in/out بين المشاهد |
| `greenscreen.tsx` | `CHROMA` (#00FF00)، `GreenCard` (كارت تحت + تاب أحمر)، `Headline`، `SlideStack`، `Layer` (طبقة جرافيك بتدخل وتخرج بمسح) |
| `Icon.tsx` | أيقونات خطية (pin, waves, landmark, user, coins, trend, lock, calendar, tag, building, file, house, percent, bubble) |
| `Kicker.tsx` | عنوان صغير بنقطة حمرا |

### ثغرة اتصلحت

`package.json` كان فيه `"sideEffects": ["*.css"]` فالـ bundler كان بيشيل `import "./fonts"` وكل الفونتات مكانتش بتتحمل. اتضاف `./src/fonts.ts` للـ sideEffects.

## الفيديوهات اللي اتعملت

كلها في `ramadan-real-estate/renders/` ومسجلة في `src/Root.tsx`.
التوقيت متظبط على ملفات SRT اللي المستخدم بعتها (كل ملف فيه `const CUE` بالثواني من الـ SRT).

### فيديو 1 — محمد رمضان MR1 (بدون SRT، توقيت تقديري)
| Composition | ملف | الجملة |
|---|---|---|
| `BrandToAsset` | `mr1-brand-to-asset.mp4` (14.8ث) | "MR1 هو البراند بتاع محمد رمضان… بيحوّل شهرته… لأصل عقاري… درس في Personal Branding" |

### فيديو 2 — الملكية الجزئية الفندقية (SRT رقم 91)
| Composition | ملف | يتحط عند | الجزء |
|---|---|---|---|
| `FractionalHook` | `fractional-1-hook.mp4` (5.6ث) | 00:00 | "سواء سنك كبير أو صغير… من غير ما تشتري وحدة كاملة" — سلايدر سن، عمارة، وحدة بتتقسم 10 حصص |
| `FractionalHookGreen` | `fractional-0-hook-greenscreen.mp4` (5.8ث) **جرين اسكرين** | 00:00 | نفس الهوك في كارت تحت: سلايدر سن ← عمارة ← "وحدة كاملة" بتتشطب وتتقسم حصص |
| `FractionalLowerThird` | `fractional-3-lower-third-greenscreen.mp4` (17.6ث) **جرين اسكرين** | 00:11.500 | "الوحدة بتتقسم لـ10 حصص… 8 سنين… عائد… تخارج بعد سنتين" — كارت تحت بيتحول من وحدة لخط زمني |
| `ThreeQuestions` | `fractional-2-three-questions.mp4` (9.6ث) | 00:28.466 | "قبل ما تتحمس… 3 حاجات" — رقم 3 كبير + 3 كروت أسئلة |

### فيديو 3 — أمارينا جروب (SRT رقم 92)
| Composition | ملف | يتحط عند | الجزء |
|---|---|---|---|
| `HotelHook` | `amarina-1-hook-greenscreen.mp4` (4.1ث) **جرين اسكرين** | 00:00 | "إيه اللي يخلي شركة فنادق تدخل العقارات بـ10 مليار؟" — فنادق → عقارات + تاج سعر بيعد لـ 10,000,000,000 |
| `AmarinaNews` | `amarina-2-news.mp4` (9.3ث) | 00:05.666 | "Amarina Group أعلنت… 5 مشاريع البحر الأحمر والعاصمة… Hotel-operated" |
| `HotelReality` | `amarina-3-hotel-reality.mp4` (9.8ث) | 00:20.566 | "كلمة فندقي مش ضمان… اسأل مين/التكلفة/العائد… نقلة حقيقية ولا لأ؟" |

ملاحظات أمارينا: الكلام على الشاشة ماشي على الـ SRT (مثلاً "مين اللي هيدير" و"نقلة حقيقية")، و"قولّي رأيك في الكومنتات" إضافة مني مش في الكلام.

### فيديو 4 — قرار الفايدة و BTS (SRT رقم 93)
| Composition | ملف | يتحط عند | الجزء |
|---|---|---|---|
| `RateHookGreen` | `rates-1-hook-greenscreen.mp4` (5.9ث) **جرين اسكرين** | 00:00 | "لو مستني الفايدة تقل… القرار ممكن يغيّر حساباتك" — منحنى فايدة نازل لبيت، ثم "قرار جديد" وأرقام بتتلخبط |
| `RateDecision` | `rates-2-central-bank.mp4` (6.1ث) | 00:07.066 | "البنك المركزي ثبّت الإيداع 19% والإقراض 20%" — كارتين بعدّاد وقفل أحمر |
| `RateFactorsGreen` | `rates-3-factors-greenscreen.mp4` (6.0ث) **جرين اسكرين** | 00:16.300 | "مش على الفايدة لوحدها… سعر الوحدة، خطة السداد، المشروع" — % متشطبة ثم 4 كروت |
| `BtsCompare` | `rates-4-bts-compare.mp4` (6.6ث) | 00:21.300 | "BTS بنساعدك تقارن… على أرقام مش كلام مبيعات" — مقارنة 3 فرص + "كلام مبيعات" متشطب |

ملاحظة: درجات المقارنة في BTS توضيحية ومكتوب عليها "* أرقام توضيحية". SRT كتب "الاداء" والصح "الإيداع".

### فيديو 5 — مونتاج كامل: شهادة سياح عن سواق Go2Cairo (IMG_9277 + SRT إنجليزي)
- Composition: `AirportEdit` (`src/AirportEdit.tsx`) → `renders/airport-go2cairo-final.mp4` (29.4ث) ونسخة للإرسال `-send.mp4` (<30MB). **مش مرفوعين على git** لأنهم فيهم الفوتيج الأصلي.
- **الاسم على الشاشة: "Go2Cairo Driver"** (بطلب المستخدم، بدل اسم السواق "بندق"). كارت النهاية: "Thanks, Go2Cairo" بس، من غير سطر عربي. في السطر العربي للترجمة كلمة Go2Cairo بتتكتب بـ Inter Tight لأن الفونت العربي مفيهوش حروف لاتيني.
- **ستايل خاص بالفيديو ده بس** (بطلب المستخدم، مش القاعدة): خلفية أزرق نيلي بنقط وشمس برتقالي، كروت لون رمل، لون مميز برتقالي `#FF6A2B`، ترجمة في كبسولة كحلي. من غير ورق/شبكة/أحمر ومن غير الـ serif المايل. الباليتة `C` جوه الملف.
- يبدأ من "hi" عند 8.18ث (اتحدد من شكل الصوت، مش من الـ SRT).
- ميوزك: `scripts/airport_music.py` بيولّد تراك (100 BPM، A major، 32ث) → `public/airport/music.wav` (local). مستواه 0.14 تحت الكلام و0.5 في كارت النهاية.
- الفوتيج المحسّن `public/airport/master.mp4` (local). يتعمل تاني بـ ffmpeg كامل من PyPI:
  ```
  pip install imageio-ffmpeg numpy   # ffmpeg الموجود مع Remotion ناقصه فلاتر
  FF=$(python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())")
  $FF -i IMG_9277.MP4 -vf "hqdn3d=1.5:1.5:4:4,scale=1080:1920:flags=lanczos,cas=0.45,eq=contrast=1.06:saturation=1.12:gamma=0.98,vibrance=intensity=0.12,fps=30" \
      -af "highpass=f=80,afftdn=nf=-28:nr=10,acompressor=threshold=-20dB:ratio=3:attack=10:release=150:makeup=2,loudnorm=I=-14:TP=-1.5:LRA=9" \
      -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 public/airport/master.mp4
  python3 scripts/airport_music.py public/airport/music.wav
  ```
- الرندر: `npx remotion render AirportEdit renders/airport-go2cairo-final.mp4 --crf=16 --audio-bitrate=192k`، وبعدين إعادة ضغط crf 19 للإرسال (حد الإرسال 30MB).
- مفيش تفريغ صوت هنا (HuggingFace/OpenAI محجوبين)، فلازم SRT من المستخدم.

### فيديو 6 — Different: وكالات الحج والعمرة (SRT e12cbecb)
**ستايل خاص بالفيديو ده بس** (بطلب المستخدم): بيج وبني ودرجاتهم، مش ستايل العقارات. الملفات في `src/hajj/`:
- `theme.ts`: الباليتة (رملي `#F1E6D3`، بني قهوة `#3A2718`، كراميل `#9C5B2E`، تان `#C9A273`) و`starTile()` (نقشة نجمة ثمانية بدل الشبكة).
- `style.tsx`: `GreenCard` (كارت رملي بإطار داخلي وتاب على شكل قوس في النص)، `Headline` (مسح من الشمال لليمين)، `Backdrop` (خلفية متدرجة بنقشة ونجوم كبيرة بتلف وإطار قوس)، `Kicker` (معين بني وخط)، `Star`.
- المشاهد في `src/HajjGreen.tsx` و`src/HajjFull.tsx`، وفيها الكلمة المميزة بلون `brown` (import `accent as brown`).

| Composition | ملف | يتحط عند | النوع |
|---|---|---|---|
| `HajjHookGreen` | `hajj-1-hook-greenscreen.mp4` | 00:00 | جرين: "بتبيع ثقة" |
| `HajjChoices` | `hajj-2-choices.mp4` | 00:04.433 | عادي: مئات البرامج + "الأفضل" على كل كارت |
| `HajjReassureGreen` | `hajj-3-reassure-greenscreen.mp4` | 00:10.866 | جرين: قلقان ← مطمن |
| `HajjQuestions` | `hajj-4-questions.mp4` | 00:13.633 | عادي: أسئلة العميل |
| `HajjAdGreen` | `hajj-5-ad-greenscreen.mp4` | 00:20.333 | جرين: صورة وسعر "مش كفاية" |
| `DifferentGreen` | `hajj-6-different-greenscreen.mp4` | 00:23.500 | جرين: Different + الخدمة + العملاء |
| `HajjProof` | `hajj-7-proof.mp4` | 00:32.400 | عادي: 400% |
| `HajjCtaGreen` | `hajj-8-cta-greenscreen.mp4` | 00:35.000 | جرين: ابعتلنا رسالة |

**ساوند افيكتس** (بطلب المستخدم: احترافية ومش مزعجة): `scripts/hajj_sfx.py` بيولّد الأصوات بـ numpy (whoosh, swipe, pop, tick, key, stamp, chime, ding, strike, send, riser, impact, slide) → `public/hajj/sfx/` ومرفوعة على git. `src/hajj/sfx.tsx` فيه `SfxTrack` واللي بياخد `{at, name, volume}`، وكل مشهد فيه قايمة cues مربوطة بتوقيتات الـ SRT. أعلى مستوى حوالي −10 dB عشان يفضل تحت الصوت.

ملاحظات: الـ SRT كاتب "Differnt" واتكتبت Different. الأسعار على الكروت توضيحية، و400% رقم العميل.

### فيديو 7 — Different: السياحة الخارجية (SRT da12dfe7)
نفس ستايل البيج والبني والساوند افيكتس بتوع فيديو الحج (`src/hajj/`). المشهد في `src/TravelGreen.tsx` وبيستخدم `Strip/Top/Chip` المتصدرين من `HajjGreen.tsx`.

| Composition | ملف | يتحط عند | الجزء |
|---|---|---|---|
| `TravelHookGreen` | `travel-1-hook-greenscreen.mp4` (11.2ث) **جرين اسكرين** | 00:00 | من "لو شركتك شغالة في السياحة الخارجية" لحد "نفس الرحلة، فنادق كلها قريبة من بعض" (10.266ث) |

ملاحظة: الـ SRT كاتب "الساحة الخارجية" و"بنادق"، والمكتوب على الشاشة "السياحة الخارجية" و"فنادق".

## قواعد الجرين اسكرين

- الخلفية `#00FF00` صريحة، والجرافيك في كارت في آخر الشاشة (تقريباً من y≈1235 لـ 1740).
- **مفيش ظل/توهج/grain/شفافية على حواف الكارت** — الحركة translate و clip بس، عشان الـ key يطلع نضيف. الظل يتضاف في المونتاج بعد الـ key.
- استخدم `GreenCard` + `Headline` من `lib/greenscreen.tsx`.

## طريقة الشغل اللي ماشيين بيها

1. المستخدم يبعت السكريبت + يحدد الجزء + (غالباً) SRT.
2. اقرا الـ SRT، حط `T0` = بداية الجزء، واعمل `CUE` لكل جملة.
3. قسّم لـ beats (جملة = مشهد)، كل عنصر يدخل على كلمته.
4. اعمل stills على فريمات مهمة وبصّ عليها قبل الرندر (الفونت بيعمل مفاجآت في العرض).
5. رندر في `renders/`، ابعت الملف للمستخدم، commit و push على البرانش.
6. قول للمستخدم يحط الفيديو عند أنهي ثانية.
