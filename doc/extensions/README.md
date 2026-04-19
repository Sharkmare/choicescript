[ChoiceScript Docs](../README.md) › Engine Extensions [EXT]

# Engine Extensions [EXT]

> **These features are additions to the standard ChoiceScript engine. Standard games published through Choice of Games do not support them. Use them in projects that distribute their own engine (this fork).**

Extensions add capabilities that the standard engine lacks: counted loops, multi-way branching, arithmetic functions, and dynamic array operations. All extension commands are prefixed with `*` like standard commands and follow the same indent rules.

## Pages

| Page | Description |
|---|---|
| [loops-and-switch.md](loops-and-switch.md) | `*for`/`*next` counted loops and `*switch`/`*case`/`*endswitch` multi-way branching. |
| [arithmetic-functions.md](arithmetic-functions.md) | Math functions (`floor`, `ceil`, `abs`, `min`, `max`), string functions (`lowercase`, `uppercase`), and unary minus. |
| [push-pop.md](push-pop.md) | `*push` and `*pop` for dynamic arrays that grow and shrink at runtime. |
