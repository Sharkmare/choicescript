[ChoiceScript Docs](../../README.md) › [Control Flow](README.md) › Navigation

# Navigation

Navigation commands move execution to a different point in the current scene, a different scene file, or end the game entirely.

---

## `*label`

Marks a named jump target within the current scene. Labels are referenced by `*goto` and `*gosub`.

```
*label name
```

Label names must be unique within the scene. They are case-insensitive and cannot contain spaces.

```
*label start
What will you do next?
```

---

## `*goto`

Jumps to a `*label` within the current scene. Execution continues from the line after the label.

```
*goto labelname
```

`*goto` can only jump to labels in the **same scene file**. For cross-scene jumps, use `*goto_scene`.

```
*label start
What will you do?
*choice
  #Try again.
    *goto start
  #Give up.
    *finish
```

---

## `*gotoref`

Jumps to a label whose name is stored in a variable. Useful when the destination is computed at runtime.

```
*gotoref varname
```

```
*set destination "chapter2"
*gotoref destination
```

The variable must contain a string that matches an existing `*label` in the current scene.

---

## `*goto_scene`

Jumps to a different scene file. Execution does not return to the calling scene.

```
*goto_scene scenename
```

Optionally, jump directly to a named label within the target scene:

```
*goto_scene scenename labelname
```

`*temp` variables are reset when entering a new scene. `*create` variables (permanent) persist.

```
*goto_scene forest
*goto_scene dungeon boss_room
```

---

## `*finish`

Ends the current scene and advances to the next scene listed in the navigator (`mygame.js`).

```
*finish
```

You can provide an optional label for the "Next" button:

```
*finish The adventure continues...
```

Use `*finish` at the end of every branch that does not jump elsewhere. Every path through a `*choice` must terminate.

---

## `*ending`

Like `*finish`, but signals that the game is complete. Displays a "Play Again" button instead of a "Next" button.

```
*ending
```

Use `*ending` on any branch that represents a true conclusion: victory, death, or a definitive end state.

---

## `*goto_random_scene`

Jumps to a randomly selected scene from a list. Each scene name is on its own indented line.

```
*goto_random_scene
  scene_a
  scene_b
  scene_c
```

Each entry has an equal probability of being selected. The jump is one-way, like `*goto_scene`; execution does not return.

---

## `*redirect_scene`

A specialized command for use inside `choicescript_stats.txt` only. It cannot be used in regular scene files; doing so throws a runtime error.

For subroutine calls that span scene files, use `*gosub_scene` instead.

---

## `*abort`

Immediately halts execution. Used during development to mark branches that have not been written yet.

```
*abort
```

Players will see an error. Remove all `*abort` commands before release.

---

## `*bug`

Like `*abort`, but prints a custom message before halting. Useful for asserting conditions that should never occur.

```
*bug Something went wrong here.
*bug wounds should never exceed 5 at this point.
```

---

## `*looplimit`

Changes the maximum number of consecutive `*goto` jumps allowed before the engine throws an infinite loop error. The default is 1000.

```
*looplimit 500
```

You would lower this during development to catch runaway loops faster, or raise it for scenes with intentionally deep loops.

---

## `*reset` / `*restart`

Reset all permanent variables to their starting values and restart the game from the first scene. Both commands are equivalent.

```
*reset
*restart
```

Use only when you intend to offer a "start over" path. These commands discard all player progress.

---

## Loop detection

The engine tracks consecutive `*goto` jumps within a scene. If execution passes through more than 1000 jumps without encountering a `*choice`, it throws an **"infinite loop"** error.

To avoid this:

- Include a `*choice` inside any loop that players can cycle through more than a few times. A `*choice` resets the jump counter.
- Use `*looplimit` to adjust the threshold when working with intentionally deep structures.
- `*page_break` does **not** reset the jump counter; only `*choice` does.

```
*label poll_loop
*gosub check_condition
*if done *goto poll_exit
*page_break
*goto poll_loop

*label poll_exit
The wait is over.
```
