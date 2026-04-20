[ChoiceScript Docs](../../README.md) › [Getting Started](README.md) › Editor

# Editor

The ChoiceScript Editor is a browser-based code editor purpose-built for writing and previewing ChoiceScript scenes. It provides syntax highlighting, autocomplete, inline error display, a live game preview, and a stat simulator, all in a single page.

---

## Starting the Editor

The editor requires the development server (`serve.js`) to be running. Start it from the project root:

```
node serve.js
```

Then navigate to:

```
http://localhost
```

By default `serve.js` binds to port 80. Navigate to `/editor/` to open the editor:

```
http://localhost/editor/
```

If you see "Cannot reach server. Is serve.js running?" in the status bar, the server is not up or is on a different port.

---

## Interface Overview

The editor is divided into four visible regions:

```
┌─────────────────────────────────────────────────────────┐
│  Toolbar                                                │
├──────────────────────────────┬──────────────────────────┤
│                              │  Preview Tabs            │
│  Editor Pane                 │  (Game Preview /         │
│                              │   Stats Preview)         │
│  [Error Panel]               │                          │
├──────────────────────────────┴──────────────────────────┤
│  Status Bar                                             │
└─────────────────────────────────────────────────────────┘
```

**Toolbar:** Scene switcher, new scene button, container scope dropdown, Preview button, save indicator, and cursor position readout. Fixed at the top.

**Editor Pane:** The main text editing area. Occupies the left side of the window.

**Error Panel:** A collapsible strip that appears at the bottom of the editor pane when a save error occurs.

**Preview Pane:** The right side of the window. Contains the tab strip (Game Preview / Stats Preview) and the active panel for the selected tab.

**Status Bar:** One line at the bottom of the window. Shows the currently open filename on the left and supplementary info on the right.

---

## Scene Management

### Scene Switcher

The dropdown in the toolbar lists every `.txt` scene file that `serve.js` knows about. Selecting a scene loads it into the editor immediately. The browser title updates to reflect the active scene name.

On load the editor fetches the scene list from the server (`/api/scenes`) and populates the dropdown. If `startup.txt` is present in the list, it is loaded first and its `*create` declarations are used to seed the starting stat values for the Stats Preview.

### Creating a New Scene

Click the **＋** button in the toolbar (to the right of the scene switcher dropdown) to create a new scene file.

A prompt asks for the scene name. Rules:

- Letters, numbers, hyphens, and underscores only. No spaces.
- Do not include the `.txt` extension. The editor adds it automatically.
- The name must not already exist in the scene list.

After confirmation the editor creates the file on disk as an empty `.txt`, refreshes the scene list, and switches to the new scene. The new file is immediately open and ready to write.

If the name contains invalid characters or duplicates an existing scene, an alert explains the problem and no file is created.

### Auto-Save

The editor saves automatically. Any time you stop typing for 1.2 seconds the current scene is posted to `/api/scene/<name>`. You do not need to save manually during normal writing. Ctrl+S forces an immediate save if you want to flush changes before switching scenes or running a preview.

### Save Indicator States

The save indicator sits to the right of the Preview button in the toolbar.

| State | Color | Label | Meaning |
|---|---|---|---|
| *(blank)* | n/a | *(empty)* | Content is saved and unchanged |
| Unsaved | Yellow | `● unsaved` | You have typed since the last save; auto-save will fire in under 1.2 s |
| Saving | Yellow | `● saving…` | Network request in flight |
| Saved | Green | `✓ saved` | Last save succeeded (clears after 2 seconds) |
| Error | Red | `✗ <message>` | Save failed; message is the HTTP status or network error |

---

## Syntax Highlighting

The editor uses a custom CodeMirror mode for ChoiceScript. Every token category has a distinct color.

### Commands (`*word`)

Commands are grouped by function. The color tells you what a command does at a glance.

| Color | Category | Commands |
|---|---|---|
| **Pink** (bold) | Flow control | `*if`, `*elseif`, `*else`, `*endif`, `*choice`, `*fake_choice` |
| **Purple** | Navigation | `*goto`, `*goto_scene`, `*goto_random_scene`, `*finish`, `*ending`, `*return`, `*gosub`, `*gosub_scene` |
| **Cyan** | Variables | `*create`, `*temp`, `*set`, `*setref`, `*rand`, `*input_text`, `*input_number`, `*print` |
| **Green** | Other builtins | `*label`, `*stat_chart`, `*achievement`, `*page_break`, `*line_break`, `*comment`, `*image`, `*sound`, `*title`, `*author`, `*scene_list` |
| **Orange** (bold) | Extensions | `*for`, `*next`, `*switch`, `*case`, `*default`, `*endswitch`, `*push`, `*pop` |
| **Red** (underlined) | Unknown | Any `*word` not in the known command set. Likely a typo. |

### Labels

| Color | Token | Example |
|---|---|---|
| **Yellow** (bold) | Label definition (`*label name`) | `*label start_battle` |
| **Yellow** | Label reference (after `*goto` or `*gosub`) | `*goto start_battle` |

Label references are clickable. Click any yellow label name after a `*goto` or `*gosub` to jump the cursor to the matching `*label` in the current scene. Hover shows an underline before you click.

If you're currently scoped to a container and the target label lives outside it, the container scope switches automatically to the container that holds the label. If the label is between containers (not inside any named section), the view resets to **(Full file)**.

### Options

Option lines (`#` at the start of an indented line inside a `*choice` block) are rendered in **green italic**.

```
*choice
  #Breathe fire.       ← green italic
    *finish
```

### Interpolation

Variable substitution expressions (`${var}`, `$!{var}`, `$!!{var}`) and inline conditionals (`@{condition true|false}`) are highlighted in **cyan**.

```
You have ${wealth} gold coins.
```

### Fairmath Operators

The operators `%+` and `%-` are highlighted in **orange bold** to distinguish them from plain arithmetic `+` and `-`. This makes it visually obvious when a fairmath push is in play.

```
*set brutality %+15    ← %+ is orange bold
*set wealth +500       ← plain + is unstyled
```

### Other Tokens

| Color | Token type |
|---|---|
| Light (default) | String literals (`"..."`) |
| Default number color | Numeric literals |
| Default variable color | Variable names and identifiers |
| Default operator color | Arithmetic and comparison operators (`+ - * / = < > !`) |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+S` | Save immediately |
| `Ctrl+Space` | Open autocomplete |
| `Ctrl+Q` | Fold / unfold the block at the cursor |
| `Tab` | Indent the current line one level |
| `Shift+Tab` | Outdent the current line one level |

Indentation uses 2-space units. The editor does not use tab characters; `Tab` inserts spaces.

---

## Autocomplete

Press `Ctrl+Space` to trigger autocomplete at the cursor. The editor selects completion candidates based on context:

### After `*`

Completes the command name. Type `*go` then `Ctrl+Space` to see all commands beginning with `go`.

```
*go|        ← cursor here
→ goto, goto_scene, goto_random_scene, gosub, gosub_scene
```

Completions are displayed as `*commandname` in the dropdown.

### After `*goto` or `*gosub`

Completes label names defined anywhere in the current scene. Only labels that match the typed prefix are shown.

```
*goto ba|
→ battle_start, battle_end  ← if those *label lines exist in the file
```

### After `*set`, `*if`, `*elseif`, `*create`, or `*temp`

Completes variable names. The variable list is built from two sources: the known stat variables (`brutality`, `cunning`, `disdain`, `infamy`, `wealth`, `wounds`, `blasphemy`) plus any variables declared with `*create` or `*temp` in the current scene text.

```
*set br|
→ brutality, blasphemy
```

### Mid-Expression

When the cursor is inside an expression (not immediately after a command keyword), the autocomplete list includes both variable names and built-in function names. Function entries show the full signature in the dropdown and insert the function name followed by `(` on selection.

```
*set wealth floor(|
→ floor(n), ceil(n), abs(n), min(a, b), max(a, b), …
```

---

## Error Display

When a save request fails, an error panel slides into view at the bottom of the editor pane. It shows the error message in monospace red text on a dark red background.

If the server response includes a line number, the editor:

1. Highlights that line with a red background tint.
2. Scrolls the line into view.

The error panel and the line highlight are cleared automatically on the next successful save. You can also clear them manually by saving with `Ctrl+S` after fixing the problem.

---

## Game Preview Tab

Click **▶ Preview** in the toolbar (or select the **Game Preview** tab) to run the game in an embedded iframe on the right side.

Clicking **▶ Preview** triggers an immediate save, then reloads the iframe to `http://localhost/web/mygame/?t=<timestamp>`. The timestamp cache-buster ensures the browser picks up the latest saved scene files rather than a cached copy.

The iframe runs with a restricted sandbox (`allow-scripts allow-same-origin allow-forms allow-modals`). This means:

- The game engine runs normally: scripts execute, forms submit, modals appear.
- The game cannot open new top-level browser windows or navigate the parent page.
- External resources (fonts, CDN assets) load normally because `allow-same-origin` is set.

If the game does not update after clicking Preview, confirm that `serve.js` is still running and that the save indicator shows `✓ saved` before the frame reloads.

---

## Stats Preview Tab

Click the **Stats Preview** tab in the right pane to open the stat simulator.

The Stats Preview answers the question: *given the choices I have made so far in this scene, what are the stat values at the current cursor position?*

### What It Shows

The panel has two sections:

1. **Stat-Affecting Choices Before Cursor:** A list of every `*choice` or `*fake_choice` block that appears before the cursor line and contains at least one option with a `*set` command targeting a stat variable. Each choice is rendered as a dropdown.
2. **Resulting Stats at Cursor:** Stat bars showing the simulated values after applying the selected options from every choice above.

### How Choices Are Filtered

A choice block is included in the list only if at least one of its options contains a `*set` command that targets one of the seven tracked stat variables:

```
brutality  cunning  disdain  infamy  wealth  wounds  blasphemy
```

Choices that set only non-stat variables are not shown. `*fake_choice` blocks are treated identically to `*choice` blocks for this purpose.

### Path Awareness

The panel is path-aware. If the cursor is inside a particular branch of a `*choice` block, only the nested choices within that branch (and its parent choices) are included. Choices in sibling branches that the cursor is not inside are excluded. This mirrors the actual execution path that would lead to the cursor's position.

### Using the Dropdowns

Each dropdown entry in the **Stat-Affecting Choices Before Cursor** section represents one `*choice` block. The dropdown options are the `#` option lines from that block. Options that have stat effects show the affected variable names in brackets:

```
#Crush them underfoot. [brutality, infamy]
#Negotiate a surrender. [cunning]
#Ignore them entirely.
```

Select an option to simulate choosing that branch. The stat bars update immediately. Selections are remembered per scene for the duration of the session.

A short prose snippet from the lines just before the `*choice` command serves as the label for each dropdown, giving context for which moment in the story the choice represents.

### Stat Bars

The **Resulting Stats at Cursor** section renders one bar for each tracked stat.

**Opposed pairs** (brutality, cunning, disdain) display as a gradient bar (purple to pink) with the pole labels at each end. The current value is shown as `n/100`.

| Bar | Poles |
|---|---|
| Brutality | Finesse ←→ Brutality |
| Cunning | Honor ←→ Cunning |
| Disdain | Vigilance ←→ Disdain |

**Infamy** displays as a percentage bar (orange). Range 0-100. No pole labels.

**Integer stats** display as follows:

| Stat | Bar color | Scale |
|---|---|---|
| Wealth | Green | 0 to max of (current wealth, starting wealth, 1) |
| Wounds | Red | 0-5 |
| Blasphemy | Red | 0-3 |

Starting values come from `startup.txt`. If `startup.txt` cannot be read, the defaults are used: brutality 50, cunning 50, disdain 50, infamy 0, wealth 5000, wounds 0, blasphemy 0.

### Known Limitation

The simulator evaluates only simple `*set` expressions:

| Expression form | Handled |
|---|---|
| `*set brutality %+15` | Yes: fairmath push toward high pole |
| `*set brutality %-10` | Yes: fairmath push toward low pole |
| `*set wealth +500` | Yes: plain addition |
| `*set wounds -1` | Yes: plain subtraction |
| `*set infamy 75` | Yes: direct assignment |
| `*set wealth other_var+10` | No: skipped |
| `*set brutality (100-cunning)` | No: skipped |

Any `*set` where the right-hand side references another variable or uses a subexpression is silently skipped. The stat value will not change for that operation in the simulation. This is a display limitation only; the actual game engine handles all expressions correctly.

---

## Code Folding

The editor shows a fold gutter: a narrow column between the line numbers and the code. When a line is followed by indented content, a collapse indicator appears in the gutter. Click it to fold the block; click it again to expand.

Any line followed by indented content is foldable: `*choice` option bodies, `*if`/`*elseif`/`*else` branches, and any other indented block.

`Ctrl+Q` folds or unfolds the block at the current cursor position without reaching for the mouse.

Folding is purely visual. It does not affect the file on disk. Switching scenes or reloading the editor clears all folds. Folding works normally inside a scoped container view.

---

## Container Markers

Container markers are an editor-only navigation tool. They let you scope the editor view to a named section of a scene file, hiding everything outside that section so you can focus on one part without scrolling past the rest.

Container markers are written as `*comment` lines, so the game engine ignores them entirely.

### Syntax

The depth of a container is set by the number of `=` signs between `*comment` and the name.

| `=` count | Depth | Example |
|---|---|---|
| `=` | 1 (top level) | `*comment = Act One` |
| `==` | 2 | `*comment == The Crossroads` |
| `===` | 3 | `*comment === Introduction` |
| `====` | 4 | `*comment ==== Opening monologue` |

There is no fixed limit on depth. Any number of `=` signs is valid.

Everything after the `=` run (trimmed) is the name. Names can contain spaces and punctuation.

Markers may be placed at any indent level, though top-level placement (no leading spaces) is recommended for clarity.

**Scope rule:** a container spans from its marker line to the line before the next marker at the same depth or shallower. Deeper-nested markers inside it do not end it.

```
*comment = Act One            (depth 1, spans until Act Two)
*comment == The Crossroads    (depth 2, spans until The Long Road)
*comment === Intro beat       (depth 3, spans until next depth 2 or 1)
*comment == The Long Road     (depth 2, ends Act One sub-sections)
*comment = Act Two            (depth 1, ends Act One)
```

### The Container Dropdown

The toolbar contains a container selector between the scene switcher and the Preview button. When a scene file is loaded, the editor scans it for container markers and renders a collapsible tree. The first entry is always **(Full file)**.

Each depth level is indented and color-coded:

| Depth | Indent | Color |
|---|---|---|
| 1 | none | Purple |
| 2 | 14 px | Cyan |
| 3 | 28 px | Green |
| 4 | 42 px | Orange |
| 5+ | continues | Cycles through the palette |

Containers with children show a `▸` toggle. Clicking the toggle expands or collapses that subtree. Clicking the name scopes the editor to that container. Depth-1 containers are expanded by default.

The dropdown updates automatically as you edit. Any change to a `*comment =` line takes effect within half a second of stopping typing. No reload required. If the active container's marker is renamed or deleted while you are scoped to it, the dropdown resets to **(Full file)** automatically.

### Scoping to a Container

Select a container name in the dropdown to enter scope view. The editor:

1. Collapses all lines above the selected container's marker into a single placeholder: `··· 42 lines above ···`
2. Collapses all lines after the container's last line into a second placeholder: `··· 18 lines below ···`
3. Scrolls the marker line into view.

The collapsed content is not deleted. It exists in the file and will save normally. The placeholder text shows the line count so you can see how much is hidden.

Each container marker line receives a colored left border matching its depth color from the table above. The border width decreases with depth (5 px at depth 1, 4 px at depth 2, 3 px at depth 3, minimum 2 px).

### Exiting Scope View

Select **(Full file)** from the dropdown. Both placeholders are removed and the full file is visible again.

Switching scenes also clears scope view and resets the dropdown to **(Full file)**.

### Preview Container

When a container is active, a **▶ Here** button appears in the toolbar to the left of the **▶ Preview** button. Clicking it runs the game starting from the active container's content only, with stats pre-computed to match the choices you have made in the Stats Preview panel up to that point in the scene.

This lets you test a specific section without replaying the entire scene from the beginning.

The stat values used are computed by running the Stats Preview simulator from the top of the scene to the container's start line, applying whichever option is selected in each Stats Preview dropdown. The resulting values are passed directly into the game instance so the scene begins with realistic stat state.

### Example

A scene file organized at three depths:

```
*comment = Act One

*comment == The Crossroads
*comment === Intro beat
You stand at the crossroads.
*comment === The choice
*choice
  #Go north.
    *goto north_path
  #Go south.
    *goto south_path

*comment == The Long Road
*label north_path
The northern road is cold and quiet.
*finish

*comment = Act Two

*comment == A Familiar Face
*label south_path
The southern road smells of smoke.
*finish
```

The container dropdown shows:

```
(Full file)
▾ Act One
    ▾ The Crossroads
        ◦ Intro beat
        ◦ The choice
    ◦ The Long Road
▸ Act Two
```

Selecting **The Crossroads** scopes to lines from that marker through the line before **The Long Road**. Selecting **Act One** scopes to all of Act One including its nested sections.

---

## Unified Scene Files

A unified scene file contains all of a game's content in a single `.txt` file, organized into depth-1 container sections. One section, named `startup`, holds the declarations that would normally live in `startup.txt`. The rest hold the individual game scenes.

When you click **▶ Preview** on a file that contains a `*comment = startup` section, the editor calls the server's explode endpoint before loading the game. The server reads the file, extracts each depth-1 section, and writes it to its own `.txt` file in the scenes directory. `startup.txt` is written from the startup section; `lair.txt`, `queenpolitics.txt`, and so on from the remaining sections. The game then runs from those extracted files. The source unified file is not altered.

### Writing the Startup Section

Place `*comment = startup` as the very first line of your file. Everything between that line and the next depth-1 container marker becomes the content of `startup.txt`. Write it exactly as you would write `startup.txt` directly: `*title`, `*author`, `*scene_list`, `*create` declarations, `*achievement` declarations, and the prose and choices that make up the first scene the player sees.

```
*comment = startup

*title My Dragon Game
*author You

*scene_list
  lair
  queenpolitics
  clutchmate

*create brutality 50
*create cunning 50
*create disdain 50
*create wealth 5000
*create wounds 0

Let us begin.

A knight charges up the slope at you.
*choice
  #I take to the air.
    *set brutality %-10
    *goto startup_victory
  #I breathe fire.
    *set brutality %+10
    *goto startup_victory

*label startup_victory
The knight retreats.
*finish

*comment = lair

*if wounds >= 3
  *goto_scene death

Deep in the mountain, your hoard gleams.
```

The `*scene_list` in the startup section determines the order the engine loads scenes after startup. List the names of the other sections in the correct play order. The section names in your unified file must match these entries exactly, since the server uses the section names as filenames when extracting.

### Scene Sections

Each depth-1 section after startup becomes one extracted scene file. The section's content (everything between its marker and the next depth-1 marker) is written verbatim to `sectionname.txt`. The `*comment = sectionname` marker line itself is not included in the extracted file.

`*goto_scene` commands in each section resolve against the extracted files. A `*goto_scene queenpolitics` in the lair section works because the server writes `queenpolitics.txt` from the queenpolitics section at the same time.

`*finish` at the end of a section advances to the next scene in the `*scene_list`, same as in multi-file projects.

### Backwards Compatibility

Files without a `*comment = startup` section are not affected. **▶ Preview** works as before: it saves the current file and loads the game using whatever `startup.txt` exists in the scenes directory.

This means you can mix approaches in the same project. Some scenes can be standalone `.txt` files written separately; others can live as sections inside a unified file and be exploded on preview.

### What Gets Written

Every time you click **▶ Preview** on a unified file, the server re-extracts all sections. Changes you make to any section take effect on the next preview click without any manual step. If a section's name matches an existing file in the scenes directory, the extracted content overwrites it.

Files referenced by `*goto_scene` that are not sections in the unified file (such as `checkpoint.txt` in the original *Choice of the Dragon*) must exist separately in the scenes directory. The server writes only what is present in the unified file; it does not delete or modify any files that are not sections in that file.

---

## Resizer

The vertical divider between the editor pane and the preview pane is draggable. Click and drag it left or right to adjust the split. The preview pane has a minimum width of 180 px and a maximum of 70% of the window width. The divider turns purple while dragging.
