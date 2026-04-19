[ChoiceScript Docs](../../README.md) › [Formatting & Output](README.md) › Output and Formatting

# Output and Formatting

---

## Paragraphs

A blank line in the scene file creates a new paragraph. Consecutive non-blank lines are joined into a single paragraph with a space inserted between them.

```
This is the first sentence.
This continues the same paragraph.

This starts a new paragraph.
```

Renders as two paragraphs: the first two lines merged, then a break before the third.

---

## `*line_break`

Inserts a single line break within a paragraph — equivalent to HTML `<br>`. Does not create a new paragraph.

```
Name: ${playername}
*line_break
Title: ${title}
```

---

## `*page_break`

Pauses output and shows a "Next" button. Everything before the command appears on one page; everything after appears on the next.

```
*page_break
```

Optional custom button label:

```
*page_break Continue the story...
```

---

## `*comment`

Everything after `*comment` on that line is ignored. No output is produced. Use for author notes, section markers, and TODO annotations.

```
*comment This is a note to the author. Players never see this.
*comment TODO: add a stat check here once cunning is balanced
```

---

## `*image`

Display an image inline in the prose.

```
*image dragon.png
*image banner.png left
*image portrait.png right
```

Syntax: `*image filename [alignment]`

Alignment values: `none` (default, centered), `left`, `right`.

---

## `*text_image`

Display an image with alt text for accessibility.

```
*text_image map.png A hand-drawn map of the northern territories.
```

Syntax: `*text_image filename Alt text here`

---

## `*sound`

Play a sound file.

```
*sound roar.mp3
```

Syntax: `*sound filename`

Playback behavior depends on the platform. Sound is not supported in all environments.

---

## `*link`

Insert a hyperlink inline in the text.

```
*link http://example.com Visit the author's site
```

Syntax: `*link url Link text here`

---

## `*link_button`

Show a button that opens a URL when clicked.

```
*link_button http://example.com Open in browser
```

Syntax: `*link_button url Button label`

---

## Variable Interpolation

Embed variable values directly in prose.

| Syntax | Effect |
|---|---|
| `${varname}` | Insert the variable's value as-is. |
| `$!{varname}` | Insert with the first letter capitalized. |
| `$!!{varname}` | Insert in ALL CAPS. |
| `@{condition true_text\|false_text}` | Conditional inline text. |
| `@{numvar opt1\|opt2\|opt3}` | Select text by numeric value (1 = first option). |

### Examples

```
You, ${playername}, have ${wealth} gold pieces.
```

```
$!{playername} raises a claw in greeting.
```

```
Your reputation is $!!{title}.
```

```
You are @{cunning cunning|honorable}.
```

```
The wyrm is @{wounds young|scarred|ancient}.
```

---

## Escaping Special Characters

To print characters that ChoiceScript interprets as special syntax, use a backslash.

| Character | Escaped form | Notes |
|---|---|---|
| `$` | `\$` | Prevents variable interpolation. |
| `#` | `\#` | Prevents interpretation as a choice option. |
| `"` | `\"` | Inside a quoted string. |
| `\` | `\\` | Literal backslash. |
| newline | `\n` | Literal newline inside a string value. |

```
The price is \$50.
```

---

## `*save_game` and `*restore_game`

Trigger the platform's save and load UI.

```
*save_game
*restore_game
```

- `*save_game` — opens the save dialog, allowing the player to write the current game state to a named slot.
- `*restore_game` — opens the load dialog, allowing the player to resume from a previously saved slot.

Both commands are no-ops in the local `index.html` test environment. They only function in the Choice of Games web player and mobile app.

---

## `*save_checkpoint` and `*restore_checkpoint`

Save and restore a single automatic checkpoint slot.

```
*save_checkpoint
*restore_checkpoint
```

- `*save_checkpoint` — writes the current game state to the checkpoint slot, overwriting any previous checkpoint.
- `*restore_checkpoint` — jumps back to the scene and state at the most recent checkpoint. If no checkpoint exists, this is a no-op.

Checkpoint saves are intended for automatic progress saves (e.g. at the start of each chapter) rather than player-managed slots. The checkpoint slot is separate from the named save slots used by `*save_game`.

---

## `*script`

Execute arbitrary inline JavaScript. The result of the expression is discarded — `*script` produces no output on its own.

```
*script Math.floor(Math.random() * 6) + 1
```

To produce visible output or modify game state from `*script`, call `println()` directly or write to `stats` or `temps` via the engine's global scope. This is an advanced escape hatch intended for platform integrations and analytics hooks. Prefer ChoiceScript expressions for anything that reads or writes game variables.

---

## `*achieve`

Award an achievement to the player immediately.

```
*achieve first_blood
```

Syntax: `*achieve achievement_id`

The achievement must be declared with `*achievement` in `startup.txt` before it can be awarded. See [Stat Chart](../stats/stat-chart.md) for the declaration syntax.
