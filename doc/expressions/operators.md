[ChoiceScript Docs](../../README.md) › [Expressions](README.md) › Operators

# Operators

Operators combine values in expressions used with `*set`, `*if`, and `*elseif`.

---

## Arithmetic

Standard arithmetic for numeric variables.

| Operator | Meaning |
|---|---|
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `modulo` | Remainder (e.g., `7 modulo 3` = 1) |

```
*set gold gold + 500
*set damage strength * 2
*set remainder score modulo 10
```

**Two operands per expression.** The engine evaluates binary expressions only. For longer chains, use parentheses to group sub-expressions:

```
*set result (a + b) * c
*set total (base + bonus) - penalty
```

Do not write `a + b + c` without parentheses; the engine will not evaluate it as expected.

---

## Unary minus [EXT]

Negates a number, variable, or expression. Requires extended ChoiceScript.

```
*temp x -7
*temp x -score
```

In an expression:

```
*set result 10 + -3
*set inverted -wounds
```

Also enables `abs()` with negative variable arguments (see [functions.md](functions.md)).

---

## Fairmath (percentile stats)

Fairmath operators push a value toward a pole on a 0–100 scale. They are designed for opposed-pair stats and produce diminishing returns as the value approaches the pole.

| Operator | Direction | Effect |
|---|---|---|
| `%+` | Toward 100 | Harder to move when already high |
| `%-` | Toward 0 | Harder to move when already low |

**Only use `%+` and `%-` on variables in the 0–100 range.** Never use them on `wealth`, `wounds`, `blasphemy`, or other plain integers.

### Formulas

```
x %+ y  →  floor(x + (100 - x) * (y / 100))   capped at 99
x %- y  →  ceil(x - x * (y / 100))             floored at 1
```

### Example: `brutality %+ 20`

| Starting value | Result |
|---|---|
| 0 | 0 + (100 − 0) × 0.20 = **20** |
| 50 | 50 + (100 − 50) × 0.20 = **60** |
| 80 | 80 + (100 − 80) × 0.20 = **84** |
| 95 | 95 + (100 − 95) × 0.20 = **99** (capped) |

### Example: `brutality %- 20`

| Starting value | Result |
|---|---|
| 100 | ceil(100 − 100 × 0.20) = **80** |
| 50 | ceil(50 − 50 × 0.20) = **40** |
| 10 | ceil(10 − 10 × 0.20) = **8** |
| 5 | ceil(5 − 5 × 0.20) = **4** (floored at 1 if result < 1) |

```
*set brutality %+20
*set cunning %-15
```

---

## String concatenation

The `&` operator joins two values as a string. Either operand can be a string literal, a number, or a variable.

```
*set title "Dr. " & last_name
*set msg "Round " & round_number & " complete."
```

For longer chains, parenthesize to control order:

```
*set full_name (first_name & " ") & last_name
```

Numbers are automatically converted to strings when joined with `&`.

---

## Comparison operators

Used in `*if`, `*elseif`, and `*selectable_if` conditions.

| Operator | Meaning |
|---|---|
| `=` | Equal to (**this is equality, not assignment**) |
| `!=` | Not equal to |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal to |
| `>=` | Greater than or equal to |

```
*if gold = 0
*if name != "stranger"
*if wounds >= 3
```

Assignment uses `*set`. The `=` operator never assigns; it only tests.

---

## Boolean operators

Combine conditions with `and` and `or`. Sub-expressions must be parenthesized.

```
*if (score > 50) and (health > 0)
  You survive.

*if (brave) or (cunning > 70)
  You find a way through.
```

`not()` is a function, not an operator; see [functions.md](functions.md).

---

## Operator precedence

ChoiceScript has **no operator precedence rules**. Expressions are evaluated strictly left to right within a parenthetical group. Always parenthesize to make your intent explicit.

```
*set result (a + b) * c       ← correct: parentheses control order
*set result a + b * c         ← ambiguous: do not rely on this
```

When in doubt, add parentheses. The engine will not silently misread a well-parenthesized expression.
