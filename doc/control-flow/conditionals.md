[ChoiceScript Docs](../../README.md) › [Control Flow](README.md) › Conditionals

# Conditionals

Conditionals let you show or skip blocks of text and commands based on variable values or expressions.

---

## `*if`

Executes an indented block only when the condition is true.

```
*if condition
  indented block
```

The indented block can contain prose, commands, or nested conditionals. The block ends when indentation returns to the level of the `*if` line.

```
*if wounds > 2
  You are badly hurt. Every step is agony.
  *set speed %-20
```

---

## `*else`

Optional. Follows an `*if` block at the same indentation level. Executes when the `*if` condition is false.

```
*if score > 50
  You pass.
  *finish
*else
  You fail.
  *finish
```

Both the `*if` block and the `*else` block must terminate their own paths (with `*finish`, `*goto`, etc.) or fall through correctly to the next line.

---

## `*elseif` / `*elsif`

Chains multiple conditions. `*elseif` and `*elsif` are identical; use whichever you prefer.

```
*if score > 80
  Excellent.
  *finish
*elseif score > 50
  Passing.
  *finish
*else
  Failed.
  *finish
```

Conditions are evaluated top to bottom. The first matching branch executes; the rest are skipped.

---

## One-line `*if`

When the action fits on a single line, you can write the condition and command together with no indented block.

```
*if brave *goto fight
```

This is equivalent to:

```
*if brave
  *goto fight
```

One-line `*if` does not support `*else` or `*elseif`. Use the indented form for chained conditions.

---

## Comparison operators

| Operator | Meaning |
|---|---|
| `=` | Equal to (this is equality, **not** assignment) |
| `!=` | Not equal to |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal to |
| `>=` | Greater than or equal to |

```
*if gold = 0
  Your hoard is empty.
*if wounds != 0
  You are injured.
*if brutality >= 80
  You have a reputation for savagery.
```

---

## Boolean operators

Use `and`, `or`, and `not()` to combine conditions. Sub-expressions must be parenthesized.

```
*if (score > 50) and (health > 0)
  You survive, barely.

*if (brave) or (cunning > 70)
  You find a way through.

*if not(defeated)
  You press the attack.
```

`not()` is a function, not a keyword. It takes its argument in parentheses.

Do not chain without parentheses. The engine evaluates strictly left to right, so parentheses make precedence explicit.

---

## Comparing strings

Use `=` to compare a variable against a string literal.

```
*if outcome = "victory"
  The crowd roars.
*if element = "fire"
  Your breath ignites the room.
```

**Loose string/number comparison:** `"5" = 5` evaluates to true. The engine coerces types for equality checks.

---

## Boolean variables

Declare with `*create` (in `startup.txt`) or `*temp`. Set with `*set`. Test with `*if`; no operator needed.

```
*set has_key true
*set door_locked false

*if has_key
  You unlock the door.
*if not(door_locked)
  The door swings open freely.
```

Setting:

```
*set flag true
*set flag false
```

Never compare a boolean variable with `= true`. Use `*if flag` or `*if not(flag)` instead.
