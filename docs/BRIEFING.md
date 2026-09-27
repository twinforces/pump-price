# Briefing

**Role:** Architect.  
**Status:** product shape is locked, including state grain. The price function is not.

## Goal chat

- Share: https://grok.com/share/bGVnYWN5_3397e417-2d45-47e9-9b1b-9e91146a6122
- Title: Sim Planning for Next Project
- Conversation: `d242a5b4-6f13-4016-a92a-e587e6aa7165`
- Human lines are the spec. Assistant pitches that were not adopted are not requirements.

## Locked

1. Calculator, not a game. God levers. No score.
2. Levers edit supply, taxes, and specs. They do not add a fixed bump.
3. Gasoline and diesel from one barrel, four crude buckets (heavy/light, sour/sweet).
4. Basket: hamburger, bread, eggs, milk, toilet paper (display name). Series for paper is BLS `CUUR0000SEHN02`.
5. Map grain is the state. All 50 show gasoline (🚗) and diesel (🚚) at once. Click a state: inspector for the other prices. See [STATE-GRAIN.md](STATE-GRAIN.md).
6. Header, MVVM, tests on Model and ViewModel, receipts page, public repo. See [ARCHITECTURE.md](ARCHITECTURE.md).

The PADD map proposal is dead.

## Not adopted

Red-pulse map, animated trucks, rewind button, cheese, one-fuel minimum build, the 0.15-cent beef sketch, any hardcoded headline price.

## Still open

1. **Price identity.** Now per state, with a basis flag. Next note: `docs/PRICE-IDENTITY.md`.
2. **Refinery checkboxes.** Plants versus state capacity. Names from the planning chat are not toggles until the capacity table confirms them.
3. **Policy catalog** beyond tax and the California/Oregon green-fuel spec.
4. **Country-to-quality table.**
5. **Graph.** Working rule: US until a click, then the state. Strike if the graph should stay national.

## Handoff

Not ready for Implementer. State grain was the blocker for the identity, and it is examined. The identity itself is still unfitted. A map of made-up state prices fails the tests in STATE-GRAIN.
