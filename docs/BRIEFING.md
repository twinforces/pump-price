# Briefing

**Role:** Architect.  
**Why this role:** new system. The job is to understand the problem before anyone writes a sim.  
**Status:** blocked on the source conversation. No mechanics are decided.

Loaded from the Ringmaster pack (`twinforces/grokdevprompts`, plugin `ringmaster` 0.2.1): master prompt, role routing, hygiene playbook, and Architect core values (system as a whole, documentation as first-class, make the right path the easy path).

## What this session actually said

The ask, in the words we have:

> We're building a web game that simulates gasoline, diesel and various consumer prices.

Then: read a prior Grok chat as the briefing, make a repo under `twinforces` called Pump Price, and start tweaking the design.

That is the whole product statement. Everything else below is either a fetch result or an open question.

## Source chat (not loaded)

Link given:

https://grok.com/c/d242a5b4-6f13-4016-a92a-e587e6aa7165?rid=8df3b34c-d348-470c-a9ff-f7fb5e6b8e85

The page is a login-gated app shell. No transcript is in the HTML. `GET https://grok.com/rest/app-chat/conversations/d242a5b4-6f13-4016-a92a-e587e6aa7165` exists and returns `Invalid bearer token` with the keys available in this workspace. Those keys are not a Grok management credential for that chat.

**Do not invent the missing design and call it the briefing.** The chat is the spec until it is pasted or shared.

How to unblock, pick one:

1. Paste the chat (or the decisions) into this thread.
2. Make a public share link that returns the transcript without a login.
3. Say "ignore the old chat, here is the design" and state it here.

## Not the spec (context only)

These are nearby facts. They are **not** requirements until you adopt them.

- [Hormuz Toll](https://github.com/twinforces/hormuzboardgame) is a one-sitting browser game. Model has no React. View never owns the rules. Claims have receipts. Oil on that meter cannot print past the 2026 peak.
- A public note from 19 Sep 2026: gasoline pricing is too complicated to "game" by chasing a penny, and stations make their money on the high-markup shelf (beef jerky), not on the commodity people will cross town to save a cent on. Source: https://x.com/GrumpyTechBro/status/2101439713576161322

If the chat already rejected either of those, they stay rejected.

## Questions that block a design

Answer in any order. A one-line reply per question is enough. "Same as the chat" is not, until the chat is in the repo.

1. **Who is the player?** Household buyer, station owner, jobber, refiner, or more than one role in one sitting?
2. **What is one sitting?** A single fill-up, a week of street prices, a quarter, a year?
3. **What prices are in the model on day one?** Gasoline grades, diesel, and which other consumer prices (and which are out of scope)?
4. **What should the player believe afterward?** One sentence. If we cannot say it, we do not have a game yet.
5. **What is the score?** Dollars, a basket you can actually buy, a station's gross margin, or something else?
6. **Where does the argument live?** Same split as Hormuz (pure model, viewmodel, view, receipts page), or a different shape, and why?
7. **What must not be faked?** Real rack/retail relationships, real units, a ceiling on printed prices, or none of that?
8. **Repo visibility.** This repo is private. Say if it should be public like Hormuz.

## Architecture (empty on purpose)

No modules, no stack choice, no data model. Choosing them before the eight questions is how a price sim becomes a tycoon skin.

When the questions are answered, the next Architect artifact is `docs/MASTER-DESIGN.md`: the one-sitting claim, the price identities, what is state vs what is a label, and the first slice small enough for an Implementer to build without inventing the economy.

## Handoff

Not ready for Implementer. The missing input is the source chat, or a replacement for it.
