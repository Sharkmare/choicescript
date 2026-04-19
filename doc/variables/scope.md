[ChoiceScript Docs](../../README.md) › [Variables](README.md) › Variable Scope

# Variable Scope

ChoiceScript has two variable scopes: **permanent** and **temporary**. Understanding the difference prevents hard-to-diagnose bugs.

---

## Permanent vs Temporary

**Permanent variables** (`*create`) live for the entire game. They are initialized in `startup.txt`, persist across scenes, and are included in saved-game state.

**Temporary variables** (`*temp`) live for a single scene. They are initialized when the scene begins and are gone the moment it ends (whether via `*finish`, `*goto_scene`, or a sub-routine return).

```
*create score 0          (lives forever)
*temp bonus 0            (gone after this scene ends)

*set bonus 50
*set score score + bonus

Your score is ${score}.
*finish
```

After `*finish`, `bonus` no longer exists. `score` carries its updated value into the next scene.

---

## Shadowing

If a `*temp` variable has the same name as a `*create` variable, the temp **shadows** the permanent for the duration of the scene. All reads and writes go to the temp; the permanent variable is unaffected.

```
*create gold 1000

*temp gold 0

*set gold 999
You have ${gold} gold.
```

Here, the player sees "You have 999 gold", but the permanent `gold` variable is still `1000`. The `*set` wrote to the temp.

To expose the permanent variable again within the same scene, delete the temp:

```
*create gold 1000

*temp gold 0
*set gold 999

*delete gold

You actually have ${gold} gold.
```

After `*delete gold`, `gold` resolves to the permanent variable, so the player sees "You actually have 1000 gold."

Shadowing is rarely intentional. Choose temp names that don't collide with permanent ones unless you specifically need this behavior.

---

## Internal Storage: `stats` and `temps`

Internally, the engine stores permanent variables in a `stats` object and temporary variables in a `temps` object (sometimes called `tempStats`). Both are plain JavaScript objects.

If you use `*script` to write custom JavaScript inside a scene, you can access them directly:

```
*script
  stats.gold = stats.gold + 100;
  temps.local_flag = true;
```

This is an advanced feature. Prefer `*set` for all normal variable manipulation; `*script` bypasses the engine's error checking.

---

## Lifecycle: When Temps Reset

Temporary variables start fresh at the beginning of each scene. Their initialization happens before any scene prose runs.

| Event | Effect on temps |
|---|---|
| Scene starts | All `*temp` declarations run; temps from the previous scene are gone |
| `*goto label` (same scene) | Temps are **not** reset (you remain in the same scene) |
| `*gosub label` | Temps are **shared**: the subroutine sees the same temp scope as the caller |
| `*finish` | Scene ends; all temps are destroyed |
| `*goto_scene othername` | Scene ends; all temps are destroyed |
| `*gosub_scene` | A new temp scope is created for the subscene; the caller's temps are preserved and restored on return |

The key rule: **scene boundary = temp reset.** Within a single scene (including jumps with `*goto` and calls with `*gosub`), temps survive.
