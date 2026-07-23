# MedPath UK — working notes

Read this before changing anything. It exists so a session on a different
machine starts with the context, instead of rediscovering it.

## What this is

A planning tool for doctors targeting UK specialty training. A doctor picks a
specialty, scores their own portfolio against that specialty's **published**
recruitment criteria, and gets a plan built from their weakest domains.

Owner: Healthcare Quality School (HCQS) — US company, Boulder, Colorado, with a
UK branch. ICO reference ZC149125. UKPRN 10101333.

The site is English only. The brand shown to users is **MedPath UK**.

## The rule that governs the content

**Never invent a score.** Every scoring figure must come from that specialty's
official recruitment source. A doctor may spend a year collecting evidence
because of a number on this site, so a plausible guess is worse than showing
nothing.

`shared/sas-data.ts` enforces this with a provenance registry. A specialty that
has not been verified against a real source shows no score at all. Default is
unverified — you have to add the source to make a specialty scorable.

Four specialties are still unverified because their sources are bot-blocked or
stale: **GP, Emergency Medicine, Ophthalmology, Neurosurgery.** They correctly
show no score. Don't "fill them in" without the official document.

## Scoring models

Not every specialty scores a portfolio, and the ones that do don't all score it
the same way. This distinction matters — getting it wrong sends doctors away
from marks they could have earned.

- `self-assessment` — applicant scores themselves on the form. Scorable here.
- `interview-portfolio` — portfolio is scored, but by a panel at interview.
  O&G and Anaesthetics are these: **40 of 150 interview marks** turn on QI,
  research/teaching and leadership. The portfolio matters enormously; it just
  isn't self-scored. Do not describe these as "no portfolio".
- `application-assessed` — scored at shortlisting by assessors reading written
  answers.
- `msra-only` — no portfolio scored anywhere (GP, Core Psychiatry).
- `unknown` — not verified yet.

`isScorable()` requires a self-assessment model **and** a positive max score.

## UK graduate prioritisation — do not remove

The Medical Training (Prioritisation) Act became law **5 March 2026**. It
prioritises UK/Ireland graduates, graduates of Iceland/Liechtenstein/Norway/
Switzerland, doctors completing relevant UK training, British and Irish
citizens, Commonwealth right of abode, indefinite leave to remain, and EU
Settlement Scheme holders. Applied at offer stage in 2026; at shortlisting too
from 2027.

This is stated on the landing page and at the top of the self-assessment. The
full list is given rather than summarised as "UK graduates only", because an
international graduate holding British citizenship or ILR **is** prioritised —
readers need enough detail to place themselves.

The site does not promise outcomes and does not target IMGs as a group.
Eligibility is decided by the recruiting bodies. Keep it that way.

## Running it on this machine

There is no system Node. Use the portable one:

```bash
export PATH="/c/Users/cqips_cqi/Desktop/New folder/tools/node-v22.18.0-win-x64:$PATH"
```

Use **pnpm**, never npm — npm fails on a peer-dep conflict
(`@builder.io/vite-plugin-jsx-loc` wants Vite 4/5, this project is on Vite 7),
and there's a wouter patch in `patches/`.

```bash
pnpm install
pnpm dev      # localhost:3000
pnpm check    # tsc --noEmit
pnpm test
pnpm build
```

Before every push: `pnpm check && pnpm test && pnpm build`.

## Deployment

GitHub `main` → Railway builds automatically. Railway runs MySQL as a separate
service; the app references it as `${{ MySQL.MYSQL_URL }}`.

Migrations run at startup (`server/_core/migrate.ts`, 5 retries at 3s) so
deploying also updates the schema. Old pre-existing migrations were out of sync
with the schema and live in `drizzle/_legacy/`; the current baseline is
`0000_glamorous_prima.sql`.

`.env` is git-ignored and must never be committed. API keys are set by the
owner directly in Railway — do not ask for them and do not handle them.

## Bilingual (English + Arabic)

The site is English + Arabic, RTL-aware. A reader who picks Arabic is told they
do not read English, so nothing may be left in English that a person has to
read — official terms are the deliberate exception (below).

- `client/src/contexts/LanguageContext.tsx` — the whole system. `useT()` for one
  string, `useLanguage()` for `{ t, dict, language, isRTL, setLanguage }`.
  Choice persists in localStorage; missing Arabic falls back to English (never a
  raw key). `dict` is the current language's whole dictionary, for mapping over
  lists.
- Dictionaries: `client/src/i18n/en/<area>.ts` + `ar/<area>.ts`, one module per
  page/area, each `export const <area> = {…} as const`. Registered in
  `i18n/en.ts` and `i18n/ar.ts` — **add both when you add a module**. English is
  the canonical shape; Arabic mirrors it.
- RTL is done with logical CSS (`ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`), not a
  second stylesheet. Direction-of-travel arrows flip by icon class in
  `index.css`; opt out with `.no-flip`. Arabic uses the Cairo face.
- `<LanguageToggle />` sits in every page header, visible on mobile too.

**Keep in English inside Arabic** — the terms a doctor meets on Oriel and the
college sites, because those pages are in English: MSRA, Oriel, GMC, PLAB,
MRCP/MRCS/MRCGP/MRCPCH/MRCOG/MRCPsych/FRCA/FRCR, OET, IELTS, IMT, CST, ACCS,
PHST, CREST, NHS, NICE, PubMed, NIHR, UKPRN, ILR, EU Settlement Scheme, Royal
College names. Numbers, prices and dates stay Western digits.

**Two hard rules that protect data:**
- Stored/submitted values stay English; only the label is translated. The
  questionnaire submits `specialty: "Surgery"`, never `"الجراحة"` — the roadmap
  generator and DB see the same values as before. Same for any enum the client
  maps back to a label (roadmap `category`/`priority`).
- The SAS scoring criteria in `shared/sas-data.ts` are the authoritative English
  and are **never** translated in place. Arabic for them lives in a separate
  additive layer, `shared/sas-i18n-ar.ts` (keyed by specialty/domain/criterion
  id), shown *above* the English, which stays visible. A missing Arabic entry
  just shows English — safe. Never edit sas-data.ts to add Arabic.

**AI answers** in the reader's language: the three prompts in `server/routers.ts`
take an optional `language` and append `languageInstruction()` from
`server/_core/llm.ts`, which tells the model to write prose in Arabic but keep
enum tokens, URLs and official UK terms in English.

`content-data.json` is dead (unreferenced) — do not spend time translating it.

## Still outstanding

- `ANTHROPIC_API_KEY` and `RESEND_API_KEY` to be set in Railway by the owner
- Domain `medpathuk.hcqsai.uk` still points at Manus; switch once stable
- Cancel the Manus subscription after ~a week of stable running
- Stripe integration pending the owner's keys
- T&O weighting document; Radiology's portfolio/MSRA/interview weighting
- Arabic scoring-data layer (`shared/sas-i18n-ar.ts`) may not cover all 46
  specialties yet. Any id without an entry shows English, which is safe. To
  finish: add entries keyed by specialty/domain/criterion id, translating
  faithfully — never touch the English in sas-data.ts.

## Manus and GitHub — do not reconnect

The GitHub repo (`drhanadyosmman-sys/medpathuk`) is the single source of truth;
Railway deploys from it. Manus once force-pushed its old pre-migration history
over this repo and wiped the work from GitHub (recovered from local). Manus is
now disconnected (its GitHub tab shows "Connect"). Do NOT reconnect it or press
Publish-to-GitHub from Manus — a sync would clobber this history again, and
Railway would then deploy the old build (no login fix, no Arabic). Push only
from here.

## History worth knowing

This project was originally built on Manus and has been fully migrated off it.
AI now goes through the Anthropic SDK (`server/_core/llm.ts`, model
`claude-opus-4-8`). Manus-specific server modules (map, voice, image, dataApi,
notification) and `client/src/components/Map.tsx` were deleted, not stubbed.

A live bug was fixed where an anonymous failed registration returned the full
`users` column list — including `passwordHash` and Stripe IDs — in the error.
`server/_core/trpc.ts` now redacts unhandled errors. Don't loosen that.
