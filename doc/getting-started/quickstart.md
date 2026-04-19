[ChoiceScript Docs](../../README.md) › [Getting Started](README.md) › Quickstart

# Quickstart

ChoiceScript is a plain-text scripting language for writing branching interactive fiction. You write scenes in `.txt` files; the engine reads them in a browser and presents the story as a sequence of prose passages and numbered choices.

---

## A Complete Minimal Scene

Save this as `web/mygame/scenes/chapter1.txt`:

```
You stand at a crossroads. To the north, a forest. To the south, a city.

*choice
  #Head into the forest.
    The trees close around you. Silence.
    *finish
  #Walk toward the city.
    The gates loom ahead, iron and rust.
    *finish
```

Open `web/mygame/index.html` in your browser. You will see the prose, two choices, and after picking one, the scene ends.

---

## `*choice`

`*choice` presents a set of options to the player. Each option starts with `#` and its body is indented one level deeper than the `#` line. Every option body **must** end with `*finish`, `*goto`, or `*goto_scene`; the engine will throw an error if a branch has no exit.

```
*choice
  #Option one.
    This is what happens if the player picks option one.
    *finish
  #Option two.
    This is what happens if the player picks option two.
    *finish
```

---

## `*finish`

`*finish` ends the current scene and advances to the next scene listed in `mygame.js`. It is the standard way to move the story forward.

```
You reach the end of the chapter.
*finish
```

---

## `*label` and `*goto`

`*label` marks a jump target within the current scene. `*goto` jumps to it. Use them to loop back, skip sections, or converge branches.

Every option in a `*choice` must exit, either with `*finish` or `*goto`. Here is a scene that loops until the player picks an exit:

```
*label top
You pace the room. Nothing has changed.

*choice
  #Look out the window.
    Rain. More rain.
    *goto top
  #Leave.
    You walk out the door and don't look back.
    *finish
```

The label name (`top`) is arbitrary. Use something descriptive.

---

## `*page_break`

`*page_break` inserts a pause in the middle of a scene. The player sees a "Next" button; clicking it reveals the prose that follows. Use it to let a dramatic moment land before continuing.

```
The door swings open.

*page_break

Nothing is there. Or so it seems.
```

---

## Indentation Rules

- Use spaces **or** tabs, not both. Pick one and be consistent throughout the file.
- The engine is sensitive to inconsistent indentation. A file that mixes tabs and spaces will produce confusing errors.
- Indentation only increases inside `*choice`, `*fake_choice`, and `*if` blocks. Increasing indent anywhere else is a syntax error.

```
*choice
  #This option is indented two spaces.
    This body is indented four spaces.
    *finish
```

---

## Common Mistakes

- **Forgetting `*finish` at the end of a choice branch.** Every branch must have an exit. A branch with prose but no `*finish`, `*goto`, or `*goto_scene` will cause an error or silently fall through.
- **Mixing tabs and spaces.** ChoiceScript counts indent characters literally. A tab is not equivalent to spaces. Use one or the other, never both in the same file.
- **Using a label name that doesn't exist.** `*goto nowhere` will throw an error at runtime if there is no `*label nowhere` in the current scene. Label names are case-insensitive (the engine normalizes them to lowercase), but spelling must be exact.
