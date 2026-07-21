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

## Still outstanding

- `ANTHROPIC_API_KEY` and `RESEND_API_KEY` to be set in Railway by the owner
- Domain `medpathuk.hcqsai.uk` still points at Manus; switch once stable
- Cancel the Manus subscription after ~a week of stable running
- Stripe integration pending the owner's keys
- T&O weighting document; Radiology's portfolio/MSRA/interview weighting

## History worth knowing

This project was originally built on Manus and has been fully migrated off it.
AI now goes through the Anthropic SDK (`server/_core/llm.ts`, model
`claude-opus-4-8`). Manus-specific server modules (map, voice, image, dataApi,
notification) and `client/src/components/Map.tsx` were deleted, not stubbed.

A live bug was fixed where an anonymous failed registration returned the full
`users` column list — including `passwordHash` and Stripe IDs — in the error.
`server/_core/trpc.ts` now redacts unhandled errors. Don't loosen that.
