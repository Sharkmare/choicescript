[ChoiceScript Docs](../../README.md) › [Getting Started](README.md) › Project Structure

# Project Structure

A ChoiceScript project is a small collection of plain files. There is no build step — the engine reads everything at runtime.

---

## The Files That Matter

```
web/
└── mygame/
    ├── index.html        Open this in a browser to play your game
    ├── mygame.js         Scene list and starting stats
    └── scenes/
        ├── startup.txt   Always the first scene
        ├── chapter1.txt
        ├── chapter2.txt
        └── death.txt     Shared game-over scene (by convention)
```

- **`web/mygame/scenes/`** — all your scene files live here, one `.txt` per scene.
- **`web/mygame/mygame.js`** — tells the engine which scenes exist and in what order, and sets the starting values of all permanent variables.
- **`web/mygame/index.html`** — the entry point. Open this file in a browser to run the game. No server required for basic play.

---

## `mygame.js`

This file has two responsibilities: defining the scene order and declaring starting stats.

```js
nav = new SceneNavigator([
  "startup",
  "chapter1",
  "chapter2",
  "ending"
]);

stats = {
  name:     "Hero",
  courage:  50,
  wealth:   100
};
```

- The array passed to `SceneNavigator` is the default scene order. `*finish` advances through this list from top to bottom.
- The `stats` object sets the initial value of every permanent variable. These values are overridden if your `startup.txt` uses `*set` after `*create`.
- Scene names in the array are **filenames without the `.txt` extension**.

---

## `startup.txt`

`startup.txt` is always the first scene the engine loads. It has two special responsibilities:

**All `*create` commands must be here.** `*create` declares a permanent variable. Putting it anywhere else will cause an error.

```
*create name "Hero"
*create courage 50
*create wealth 100
*create dragon_slain false
```

**Alternatively, use `*scene_list`** to declare the scene order from within `startup.txt` instead of `mygame.js`:

```
*scene_list
  startup
  chapter1
  chapter2
  ending

*create name "Hero"
*create courage 50
```

If you use `*scene_list`, you can omit the `SceneNavigator` call from `mygame.js`. Most projects use one approach or the other, not both.

---

## Game Metadata

Two commands in `startup.txt` set the game's display name and author credit. Both are optional but recommended.

```
*title Choice of the Dragon
*author Choice of Games
```

- `*title` sets the game's title as shown in the browser tab and the title screen.
- `*author` sets the author credit displayed on the title screen.

Both must appear in `startup.txt` if used. Placing them near the top of the file, before `*create` declarations, is conventional.

---

## Scene Naming

- Filenames are lowercase, no spaces, no special characters other than hyphens or underscores.
- The scene name used in code (in `*goto_scene`, the navigator array, or `*scene_list`) is the filename **without** `.txt`.
- Examples: `chapter1`, `the-forest`, `dream_sequence`.

---

## The `death.txt` Convention

Most ChoiceScript games have a shared scene for game-over states. By convention this is called `death.txt`. Any scene can jump to it with:

```
*goto_scene death
```

`death.txt` typically displays a game-over message and offers a restart link. Because it is reached via `*goto_scene` rather than the normal scene order, it does not need to appear in the navigator array — but it must exist in the `scenes/` folder.

```
You have died.

The story ends here, O ill-fated traveler.

*ending
```
