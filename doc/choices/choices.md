[ChoiceScript Docs](../../README.md) › [Choices](README.md) › Choices

# Choices

Choice commands are the core mechanic of ChoiceScript. They present the player with options and branch the scene accordingly.

---

## `*choice`

Presents a list of options to the player. Each option begins with `#`. The body of each option must terminate with `*finish`, `*goto`, `*goto_scene`, or another branching command; every path must end.

```
*choice
  #Attack.
    You swing your sword.
    *finish
  #Flee.
    You run away.
    *goto_scene forest
```

Indentation is significant. The `#` line is indented one level from `*choice`. The option body is indented one additional level.

---

## Nested choices

Option bodies can contain further `*choice` blocks, indented deeper. This creates multi-step decision trees within a single scene.

```
*choice
  #Enter the tower.
    Do you go up or down?
    *choice
      #Up.
        You climb the stairs.
        *finish
      #Down.
        You descend to the cellar.
        *finish
  #Walk away.
    Some battles aren't worth fighting.
    *finish
```

---

## `*fake_choice`

Like `*choice`, but all paths converge to the line immediately after the `*fake_choice` block; no `*goto` or `*finish` needed inside option bodies. Use this for flavor decisions that don't affect the narrative outcome.

```
*fake_choice
  #Be bold.
    You step forward confidently.
  #Be cautious.
    You move carefully.
Either way, you enter the room.
```

The line after the block (`Either way, you enter the room.`) runs regardless of which option the player chose.

For choices that need to branch to different destinations, use `*choice`.

---

## Conditional options (`*if` inside `*choice`)

Place a `*if` on its own line inside a `*choice` block (before the `#`) to show that option only when the condition is true. If the condition is false, the option is hidden entirely.

```
*choice
  #Talk to the guard.
    You strike up a conversation.
    *finish
  *if has_key
    #Unlock the door.
      The lock clicks open.
      *finish
```

The `*if` line is at the same indentation as the `#` it guards.

---

## `*selectable_if`

Shows an option but renders it unclickable (grayed out) when the condition is false. The player can see that the option exists but cannot select it.

```
*selectable_if (condition) #Option text
```

```
*choice
  *selectable_if (strength > 50) #Force the door open.
    You put your shoulder into it. The door bursts off its hinges.
    *finish
  #Look for another way.
    There must be a window somewhere.
    *finish
```

Use `*selectable_if` when you want the player to understand what they are missing. Use a conditional `*if` when a hidden option would be confusing.

**Note:** `*selectable_if` is a platform feature implemented in the official Choice of Games runner. In this engine build it is not available; the line will be treated as an unknown command and throw an error. Use a conditional `*if` instead.

---

## Reuse modifiers

These modifiers go on their own line immediately before the `#` of the option they affect. They control what happens to an option when the player returns to the same `*choice` (in a looping scene).

### `*hide_reuse`

Hides the option permanently after it has been selected once.

```
*choice
  *hide_reuse #Search the chest.
    You find an iron key.
    *goto start
  #Leave.
    *finish
```

### `*disable_reuse`

Shows the option but makes it unclickable after the first selection. The player can see they have already chosen it.

```
*choice
  *disable_reuse #Ask about the war.
    The innkeeper tells you what he knows.
    *goto start
  #Order another drink.
    *goto start
```

### `*allow_reuse`

Overrides the scene-level default (if the scene was authored with global reuse restrictions) and always allows this option to be selected again.

```
*choice
  *allow_reuse #Look around.
    Nothing has changed.
    *goto start
  *hide_reuse #Pick up the lantern.
    You take the lantern.
    *goto start
```

---

## Summary: which modifier to use

| Goal | Modifier |
|---|---|
| Option disappears after first use | `*hide_reuse` |
| Option visible but grayed after first use | `*disable_reuse` |
| Option always available regardless of scene defaults | `*allow_reuse` |
| Option hidden unless condition met | `*if` (before `#`) |
| Option visible but grayed unless condition met | `*selectable_if` |
