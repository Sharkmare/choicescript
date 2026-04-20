# Scribe.ChoiceScript

A fork of the ChoiceScript interactive fiction engine, with a purpose-built browser editor added on top. The engine itself is mostly unchanged from the Choice of Games original. The editor is new.

---

## What this is

ChoiceScript is a plain-text scripting language for branching stories. You write `.txt` scene files, run them in a browser, and the player makes choices that affect stat variables and route them through the story. The format is simple on purpose: `*if`, `*choice`, `*set`, `*goto`. That's most of it.

This fork adds:

- A browser-based editor at `/editor/` with syntax highlighting, autocomplete, and live preview
- Container markers (`*comment = Name`) for scoping the editor to one section of a large file
- A stat simulator that shows how choices accumulate against your stat variables as you write
- A few engine extensions (`*for`/`*next`, `*switch`/`*case`, `*push`/`*pop`, math functions) for things the standard engine doesn't support

The original ChoiceScript engine is at `web/scene.js`. The editor server is `serve.js`. Nothing in the engine has been restructured; the additions are layered on top.

---

## The Editor

Start the server, then open the editor in a browser.

```bash
node serve.js
# navigate to http://localhost/editor/
```

The editor stores scene files in `web/mygame/scenes/`. It reads and writes through the `serve.js` API. Auto-save fires 1.2 seconds after you stop typing. Ctrl+S saves immediately.

### What it does that the original doesn't

**Syntax highlighting.** Commands are color-coded by category: flow control (pink), navigation (purple), variable ops (cyan), other builtins (green), engine extensions (orange). Unknown `*commands` get a red underline so typos are obvious before you run the game.

**Label navigation.** Click any yellow label name after a `*goto` or `*gosub` and the cursor jumps to the matching `*label`. If you're scoped to a container and the target label lives in a different container, the scope switches to that container automatically. Hover shows an underline so it's clear before you click.

**Container markers.** Write `*comment = Section Name` anywhere in your scene. The editor reads these as navigation structure. A dropdown in the toolbar lets you scope the view to any section, hiding everything above and below it. This is how you work on a 4,000-line file without losing your place.

The marker depth is set by the number of `=` signs:

```
*comment = Chapter One          (depth 1, purple)
*comment == The Crossroads      (depth 2, cyan)
*comment === Opening beat       (depth 3, green)
```

Any number of depths works. The dropdown renders a collapsible tree.

**Stats simulator.** Open the Stats tab on the right. The panel lists every choice block above your cursor that affects a stat variable. Pick an option from each dropdown to simulate a playthrough path. The stat bars update immediately. Selections persist per scene for the session.

**Unified scene files.** Write an entire game in one `.txt` file using depth-1 container sections. Name one section `startup` and it becomes your `startup.txt`; the rest become individual scene files. Click Preview and the editor extracts each section to its own `.txt` before loading the game. One file to edit, standard multi-file output to run.

**Preview container.** When you're scoped to a container, a "Here" button appears in the toolbar. It runs the game starting from that container's content, with stats pre-seeded from your current simulator selections. You can test one section without replaying the whole scene.

**Code folding.** Any indented block can be folded with the gutter arrow or Ctrl+Q. Works inside container scope.

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+S | Save immediately |
| Ctrl+Space | Autocomplete |
| Ctrl+Q | Fold / unfold block at cursor |

---

## Variables and the Stat Simulator

The editor reads `startup.txt` on load and derives the stat simulator configuration from it directly. No variables are hardcoded in the editor.

**What it reads:**

- Every `*create varname number` line becomes a tracked stat with that starting value.
- The `*stat_chart` block determines which stats are opposed pairs (fairmath) and what their pole labels are. `opposed_pair` entries produce gradient bars with left/right labels. `percent` entries produce plain 0-100 bars.
- Everything else with a numeric starting value gets an integer bar scaled to its current and starting values.

This means the stat simulator works for any game, not just *Choice of the Dragon*. Point it at a different `startup.txt` and the bars update to match.

**Arithmetic rules** (these come from the ChoiceScript engine, not the editor):

- Opposed pairs and percent vars use `%+` / `%-` for fairmath pushes. `*set brutality %+15` from 50 gives 58, not 65.
- All other numeric vars use plain `+` / `-` for arithmetic.

---

## Engine Extensions

These commands are additions to standard ChoiceScript. They're available in this fork but not in the official Choice of Games release.

| Command | What it does |
|---|---|
| `*for var from N to M` / `*next var` | Counted loop |
| `*switch var` / `*case val` / `*default` / `*endswitch` | Multi-branch switch |
| `*push var value` / `*pop var into` | Stack operations |
| `floor()`, `ceil()`, `abs()`, `min()`, `max()`, `sqrt()`, `log()` | Math functions usable in expressions |
| Unary minus | `-variable` works in expressions |
| Function return values | `*gosub` can return a value via `*return value` |

Full documentation is in [doc/extensions/](doc/extensions/).

---

## Docs

Full reference at [doc/README.md](doc/README.md).

Particularly useful pages:

- [Editor](doc/getting-started/editor.md): container markers, stat simulator, unified scene files, preview container, full shortcut list
- [Variables](doc/variables/declaring.md): `*create` vs `*temp`, scope rules
- [Engine Extensions](doc/extensions/README.md): the non-standard commands available in this fork

---

## Running the Game Without the Editor

Open `web/mygame/index.html` directly in a browser, or serve the directory and navigate to it. The game engine requires no build step.

```bash
node serve.js
# navigate to http://localhost/web/mygame/
```

---

## Tests

```bash
node quicktest.js       # walks every branch, flags errors
node randomtest.js      # stress-tests with random choices
```

The editor's own unit tests live at `test/index.html`. Open it in a browser while the server is running. It covers container marker parsing, the stat simulator's fairmath arithmetic, and selection-key stability across cursor movement.
