# ChoiceScript Documentation

ChoiceScript is a plain-text scripting language for writing interactive fiction: branching stories where the reader makes choices that shape the outcome. Games are interpreted directly in the browser; no compilation step is needed.

---

## Quick Start

New here? Start with the [Quickstart guide](getting-started/quickstart.md). It walks you through a complete minimal scene from scratch.

---

## Reference

| Section | What it covers | Link |
|---|---|---|
| **Getting Started** | Minimal scene, project layout, how scenes connect | [getting-started/](getting-started/README.md) |
| **Variables** | Declaring, reading, writing, and scoping variables | [variables/](variables/README.md) |
| **Control Flow** | `*if`, `*elseif`, `*else`, `*goto`, `*label`, loops | [control-flow/](control-flow/README.md) |
| **Choices** | `*choice`, `*fake_choice`, conditions, reuse flags | [choices/](choices/README.md) |
| **Expressions** | Arithmetic, boolean logic, comparisons, operator precedence | [expressions/](expressions/README.md) |
| **Arrays** | `*create_array`, `*temp_array`, indexed access, loops over arrays | [arrays/](arrays/README.md) |
| **Formatting & Output** | Text substitution, capitalization, inline conditionals, `*page_break` | [formatting/](formatting/README.md) |
| **Stats & Achievements** | `*stat_chart`, opposed pairs, `*achieve`, achievement conditions | [stats/](stats/README.md) |
| **Engine Extensions** | `*for`/`*next`, `*switch`/`*case`, `*push`/`*pop`, math functions, unary minus [EXT] | [extensions/](extensions/README.md) |

---

## How to Run Your Game

Open `web/mygame/index.html` directly in a browser. Most modern browsers allow local file access for ChoiceScript without any extra setup.

For a more reliable local development experience (especially if you use `*image` or other asset commands), run the bundled static server:

```bash
node serve.js
```

Then navigate to `http://localhost:8080/` in your browser.

---

## Testing

ChoiceScript ships with two automated test tools and a full unit-test suite.

**Quicktest**: walks every branch of your game automatically and flags errors.

```bash
node quicktest.js
```

**Randomtest**: stress-tests your game by making random choices many times over, catching runtime errors that only appear on unusual paths.

```bash
node randomtest.js
```

**Full engine test suite**: runs the engine's own unit tests. Run this if you modify `scene.js` or any core file.

```bash
node tests/suite.js tests/qunit.js web/scene.js web/util.js headless.js tests/scenetest.js tests/dragontest.js tests/utiltest.js
```

---

> Extensions marked **[EXT]** are additions to the standard ChoiceScript engine available in this fork. They may not be present in the official Choice of Games release.
