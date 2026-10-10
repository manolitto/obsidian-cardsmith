This intro is the note's own text. The card type reads a `## Front` section before it, so the card shows the section and not this paragraph.

## Front

A character who spends a **night** without rest gets a bane on all rolls until they have slept again.

%% keep-together %%
- First night: a bane
- Second night: two banes
%% /keep-together %%

## Notes

The same rule in English, the body from a `## Front` section, which wins over the intro above it. The deck prints `de` and leaves it out.

```cardsmith
card:
  system: dragonbane
  card-type: generic
  language: en
data:
  back-image: "[[Drachensiegel.png]]"
  name: Sleep Deprivation
```
