[ChoiceScript Docs](../../README.md) › [Variables](README.md) › Declaring Variables

# Declaring Variables

Variables in ChoiceScript are either **permanent** (survive the whole game) or **temporary** (exist only in the current scene). You declare them with different commands depending on which kind you need.

---

## `*create`: Permanent Variables

`*create` declares a permanent variable. **All `*create` commands must appear in `startup.txt`**; the engine will error if you try to create a permanent variable in any other scene.

```
*create syntax: *create varname value
```

The value can be a number, a boolean (`true` or `false`), or a quoted string.

```
*create player_name "Adventurer"
*create gold 100
*create is_knight false
*create reputation 50
```

Permanent variables persist across scenes and are saved with the player's progress.

---

## `*temp`: Scene-Local Variables

`*temp` declares a variable that exists only for the duration of the current scene. It is destroyed when the scene ends (via `*finish`, `*goto_scene`, or any cross-scene jump).

```
*temp syntax: *temp varname [value]
```

The initial value is optional; if omitted, the variable starts as `null`. You can declare a temp anywhere in a scene, not just at the top.

```
*temp roll 0
*temp message
*temp doubled (roll * 2)
```

Temps are useful for intermediate calculations and scene-specific flags you don't need to carry forward.

---

## `*create_array`: Permanent Arrays

`*create_array` declares a numbered set of permanent variables. It must be in `startup.txt` alongside regular `*create` commands.

```
*create_array syntax: *create_array name length value
```

This creates variables `name_1` through `name_N`, each initialized to `value`, plus a special variable `name_count` set to `N`.

```
*create_array inventory 5 "empty"
```

This creates:
- `inventory_1` = `"empty"`
- `inventory_2` = `"empty"`
- `inventory_3` = `"empty"`
- `inventory_4` = `"empty"`
- `inventory_5` = `"empty"`
- `inventory_count` = `5`

Access individual slots with `inventory_1`, `inventory_2`, etc. Use `inventory_count` when looping.

---

## `*temp_array`: Scene-Local Arrays

`*temp_array` works exactly like `*create_array` but the variables are scene-local and disappear at the end of the scene.

```
*temp_array syntax: *temp_array name length value
```

```
*temp_array scores 3 0
```

Creates `scores_1`, `scores_2`, `scores_3` (all `0`) and `scores_count` (`3`), all temporary.

---

## `*delete`: Remove a Temporary Variable

`*delete` removes a temporary variable. This is mainly useful when you have a temp that shadows a permanent variable and you want to expose the permanent again (see [Variable Scope](scope.md)).

```
*delete syntax: *delete varname
```

```
*temp gold 999
*delete gold
```

After `*delete gold`, reads of `gold` will go to the permanent `gold` variable declared in `startup.txt`.

**You cannot delete permanent (`*create`) variables.**

---

## `*delete_array`: Remove a Temporary Array

`*delete_array` removes a temporary array and its count variable.

```
*delete_array scores
```

This deletes `scores_1`, `scores_2`, `scores_3`, and `scores_count`.

---

## Variable Naming Rules

- Lowercase letters, digits, and underscores only.
- Must start with a letter, not a digit or underscore.
- Variable names are **case-insensitive** when used in expressions and `*set` commands. `Gold`, `gold`, and `GOLD` all refer to the same variable.
- Avoid names that shadow ChoiceScript built-ins (e.g., `choice_`, `param_`).

Valid names: `player_name`, `gold2`, `is_alive`  
Invalid names: `2gold` (starts with digit), `player-name` (hyphen not allowed), `_flag` (starts with underscore)
