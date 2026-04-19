[ChoiceScript Docs](../../README.md) › [Extensions](README.md) › Push and Pop

# Push and Pop

---

## `*push` / `*pop` — Dynamic Arrays

Standard arrays declared with `*create_array` have a fixed size set at declaration time. `*push` and `*pop` let you grow and shrink arrays at runtime, making them suitable for inventories, history logs, and stacks where the final size is not known in advance.

---

## Setup

The count variable must exist before the first `*push`. Create it with `*create` for a permanent array, or `*temp` for a scene-local one.

Permanent (survives `*finish` and `*goto_scene`):

```
*create inventory_count 0
```

Scene-local (destroyed when the scene exits):

```
*temp stack_count 0
```

---

## `*push` — Append to End

Increments the count variable and assigns the value to the new last slot.

```
*push inventory "lantern"
*push inventory score
```

After both pushes:

```
inventory_1     = "lantern"
inventory_2     = (value of score at push time)
inventory_count = 2
```

Syntax: `*push arrayname value`

- `arrayname` is the base name. The count variable must be `arrayname_count`.
- `value` can be a literal, a variable reference, or an expression.

---

## `*pop` — Remove from End

Removes the last element, stores it in a destination variable, and decrements the count.

```
*temp item ""
*pop inventory item
```

After: `item = (value of inventory_2)`, `inventory_count = 1`.

Syntax: `*pop arrayname destvar`

- `destvar` must already be declared with `*temp` or `*create` before the `*pop` call.
- Throws an error if `arrayname_count` is 0 (the array is empty). Check the count before popping if emptiness is possible.

---

## Permanent vs Temporary

The permanence of pushed elements follows the permanence of the count variable.

| Count variable declared with | Pushed elements are |
|---|---|
| `*create` | Permanent — survive scene transitions |
| `*temp` | Temporary — destroyed when the scene exits |

Do not mix: if `inventory_count` is a `*create` variable, the elements `inventory_1`, `inventory_2`, etc. are also permanent, and will be present in the next scene.

---

## Use as a Stack (LIFO)

Last in, first out. Push to record; pop to retrieve in reverse order.

```
*temp log_count 0

*push log "Entered the cave."
*push log "Found the gem."
*push log "Heard a sound behind you."

*temp entry ""
*pop log entry
Entry: ${entry}

*pop log entry
Entry: ${entry}
```

Output:

```
Entry: Heard a sound behind you.
Entry: Found the gem.
```

---

## Use as an Append-Only List

Push items as they are acquired; iterate with `*for` to inspect the full history.

```
*create visited_count 0

*push visited current_scene
```

Later:

```
*temp i 0
*for i from 1 to visited_count
*if visited_[i] = "treasure_room"
  *set already_looted true
*next i
```

---

## Checking for Empty Before Popping

```
*if stack_count > 0
  *temp result ""
  *pop stack result
  The last item was ${result}.
*else
  The stack is empty.
```

Always guard a `*pop` if the array might be empty.
