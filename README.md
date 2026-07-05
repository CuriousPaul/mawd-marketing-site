# MAWD Challenge Site

MAWD Challenge static website and campaign assets.

The product direction is now anchored on the final PRD: MAWD is an AI building survival program where participants turn ideas into PRDs, business plans, MVPs, agents, automation services, and portfolio-ready outcomes. The website should act first as a hackathon application and submission gateway, not just a mood-based marketing page.

## Direction

- Primary job: collect hackathon/program applications.
- Secondary job: explain the MAWD challenge flow clearly enough for participants, judges, and sponsors to decide whether to join.
- Core CTA: `마우드 참가 신청하기`.
- Core story: `아이디어를 실제 프로젝트로 바꾸는 AI 빌딩 서바이벌`.
- Core proof: participants leave with PRD, business plan, presentation material, MVP or agent output, deployment links, review feedback, and portfolio/LinkedIn-ready material.

## Contents

- `docs/prd/mawd-challenge-prd-final.md` - readable final PRD and direction source
- `docs/prd/mawd-challenge-prd-final.docx` - original final PRD document
- `mawd-landing.html` - static landing page
- `mawd-cardnews.html` - card news source page
- `cards-png/` - exported card news images
- `generated-designs-2026-06-23/` - generated visual references used by the landing page
- `mawd-introduction*.md` / `*.docx` - program introduction documents
- `build-mawd-intro-v2.js` - document build helper

## Preview

Open `mawd-landing.html` directly in a browser, or use `index.html` as the GitHub Pages entry point.

The landing page references local assets under `generated-designs-2026-06-23/`, so keep the folder structure intact.

## Notes

- Zip packages are treated as derived delivery artifacts and are not committed by default.
- Large or revised exports can be regenerated from the source HTML and image assets.
