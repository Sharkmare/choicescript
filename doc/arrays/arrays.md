[ChoiceScript Docs](../../README.md) › [Arrays](README.md) › Arrays

# Arrays

ChoiceScript has no native array type. Arrays are stored as a set of numbered variables plus a count variable. All array commands generate and manipulate these variables under the hood.

---

## How Arrays Work

`*create_array inventory 3 "empty"` expands into four variables:

```
inventory_1     = "empty"
inventory_2     = "empty"
inventory_3     = "empty"
inventory_count = 3
```

Every array command follows this same convention: `arrayname_1` through `arrayname_N` hold the elements, and `arrayname_count` holds the current length.

---

## Declaring Arrays

### `*create_array` — Permanent Array

Declared in `startup.txt`. Persists for the entire game session.

```
*create_array inventory 3 "empty"
```

Syntax: `*create_array name length default_value`

- `name` — base name; elements become `name_1`, `name_2`, etc.
- `length` — number of slots to create (must be a literal integer).
- `default_value` — initial value assigned to every slot.

### `*temp_array` — Scene-Local Array

Declared anywhere in a scene file. Destroyed when the scene exits.

```
*temp_array buffer 5 0
```

Same syntax as `*create_array`. Use `*temp_array` for scratch space that does not need to survive a `*finish` or `*goto_scene`.

---

## Reading and Writing Elements

Access elements by index directly or through a variable index.

```
*set inventory_1 "iron sword"
```

```
*temp slot 2
*set inventory_[slot] "healing potion"
*print inventory_[slot]
```

The `[varname]` syntax inside a variable name substitutes the value of `varname` as the index. The variable must hold an integer in the valid range.

---

## Iterating with a Loop

Use the `*for` extension to walk every element.

```
*temp i 0
*for i from 1 to inventory_count
  *print inventory_[i]
*next i
```

`inventory_count` is updated automatically by `*push` and `*pop`, so this loop always covers the current contents regardless of how the array grew or shrank at runtime.

> **Note:** `*for`/`*next` is an engine extension. See [Loops and Switch](../extensions/loops-and-switch.md) for full syntax.

---

## Dynamic Arrays — `*push` and `*pop` [EXT]

Standard `*create_array` arrays have a fixed size. `*push` and `*pop` let you append and remove elements at runtime.

### `*push` — Append a Value

The count variable must exist before the first push.

```
*create inventory_count 0

*push inventory "lantern"
*push inventory "rope"
```

After both pushes:

```
inventory_1     = "lantern"
inventory_2     = "rope"
inventory_count = 2
```

Syntax: `*push arrayname value`

### `*pop` — Remove and Return the Last Element

```
*temp item ""
*pop inventory item
```

After: `item = "rope"`, `inventory_count = 1`.

Syntax: `*pop arrayname destvar`

- `destvar` must already be declared (`*temp` or `*create`).
- Throws an error if the array is empty (`count = 0`).

---

## When to Use `*create_array` vs `*push`/`*pop`

| Situation | Recommended approach |
|---|---|
| Size is known at startup and never changes | `*create_array` in `startup.txt` |
| Size is known at scene start, scene-local | `*temp_array` |
| Size varies at runtime (inventory, history log, stack) | `*create name_count 0` + `*push`/`*pop` |

---

## Removing a Temporary Array — `*delete_array`

Destroys a `*temp_array` before the scene ends. Useful when you need to reuse the name or free memory in a long scene.

```
*delete_array buffer
```

Syntax: `*delete_array name`

`*delete_array` works on both temporary and permanent arrays. Deleting a permanent array removes all its element variables and count variable for the rest of the game session — the data cannot be recovered without a full game restart. Use with care on permanent arrays.
