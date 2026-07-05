# MAWD Challenge Design Documentation v2

Design source: Figma frame `MAWD Editable Desktop Website / v2`

Product and copy source: `docs/prd/mawd-challenge-prd-final.md`

The site direction is now application-first. Visual design can keep the MAWD pixel/arcade world, but the page structure must prioritize hackathon participation, submission, evaluation, and sponsor value.

## Core Rule

Do not ship meaningful Korean copy as flattened image text.

Decorative textures, stickers, and atmospheric art may remain raster assets, but all navigation labels, headlines, body copy, CTA labels, program steps, benefit lists, and footer copy must be editable Figma text and live HTML text.

## Canvas

- Desktop frame: 1440 x 3683
- Header: 0-70
- Hero: 70-810
- Intro: 810-1560
- Process: 1560-2380
- Benefits: 2380-3060
- Final CTA/Footer: 3060-3683

## Color Tokens

- Stage Black: `#050505`
- Panel Black: `#090A08`
- Paper White: `#F4F2E8`
- Neon Green: `#7CFF00`
- Arcade Purple: `#9B4CFF`

## Typography

- Korean display/headlines: Noto Sans KR Black
- Korean body: Noto Sans KR Regular
- Korean CTA/button: Noto Sans KR Bold
- Utility/pixel labels: Inter Black/Bold
- Letter spacing: 0

## Editable Sections

- `01 Header / editable`
  - Logo text
  - Nav labels
  - Header CTA
  - Sponsor CTA
- `02 Hero / editable text and layout`
  - HUD score
  - Main logo text
  - Hero headline
  - Hero subcopy
  - Hero CTAs
  - Program flow cards
  - Benefit mini panels
- `03 Intro Section / editable`
  - Section label
  - Main headline
  - Description
  - Three intro cards
- `04 Process Section / editable`
  - Progressive market headline
  - Round descriptions
  - Process panel
- `05 Benefits Section / editable`
  - Participant benefit list
  - Sponsor benefit list
- `06 Final CTA Section / editable`
  - Final stage headline
  - CTA copy
  - Footer brand and tagline

## Motion Design

- CTA pulse: subtle neon glow, 1.9s ease-in-out loop.
- Section reveal: opacity fade + `translateY(18px -> 0)`, 0.8s ease.
- CTA hover: translate `-2px, -2px`; add purple shadow and green glow.
- Motion states should be represented as named frames or notes in Figma, then implemented in CSS/JS.

## Implementation Notes

- Build production HTML from the editable Figma v2 frame, not from a full-page screenshot.
- Keep decorative raster layers separate from text.
- CTA/hotspot links should map to live anchors or explicit external actions.
- Keep the primary CTA aligned with the PRD: `마우드 참가 신청하기`.
- Treat the application flow as the first product workflow: learn the challenge, check fit, apply, submit materials, receive evaluation, and progress to the offline build round.
- Verify desktop at 1440px first. Mobile is intentionally deferred.
