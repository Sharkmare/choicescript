[ChoiceScript Docs](../../README.md) › [Extensions](README.md) › Loops and Switch

# Loops and Switch

---

## `*for` / `*next`: Counted Loop

Runs a block of statements a fixed number of times, counting a variable from a start value to an end value.

### Syntax

```
*for varname from min to max
*next varname
```

```
*for varname from min to max step n
*next varname
```

### Rules

- `varname` is auto-declared as a temp if it does not already exist.
- The body runs at the **same indent level** as `*for`; it is not indented. This is a ChoiceScript engine constraint: only `*if` and `*choice` introduce indented blocks.
- `step` defaults to `1`. Must be non-zero.
- The body is **skipped entirely** if `min > max` with a positive step, or `min < max` with a negative step.
- The loop throws after 1,000 iterations by default (same guard as `*goto` loops). Override with `*looplimit n` before the loop.
- After the loop exits normally, `varname` holds the first value that exceeded the bound, not the last in-range value. For `*for i from 1 to 5`, `i` will be `6` after the loop ends. If you need the final in-range value, capture it inside the body.

### Examples

Summing a range:

```
*temp total 0
*for i from 1 to 5
*set total + i
*next i
The total is ${total}.
```

Calling a subroutine each round:

```
*for round from 1 to max_rounds
*gosub play_round
*if game_over
  *goto battle_over
*next round
```

Negative step, counting down:

```
*for i from 10 to 1 step -1
Round ${i}...
*next i
```

Body skip, min exceeds max with positive step:

```
*for i from 10 to 5
*set ran true
*next i
```

The body never runs. `ran` stays at its previous value.

---

## `*switch` / `*case` / `*default` / `*endswitch`

Branch on a single value without chaining `*if`/`*elseif`. Cleaner than a long `*elseif` ladder when testing one expression against several known values.

### Syntax

```
*switch expression
*case value1
  body for value1
  *finish
*case value2
  body for value2
  *finish
*default
  body if nothing matched
  *finish
*endswitch
```

### Rules

- All labels (`*case`, `*default`, `*endswitch`) must be at the **same indent level** as `*switch`.
- Body lines also run at the same indent (same engine constraint as `*for`).
- When a matching `*case` (or `*default`) is found, its body runs until `*finish`, `*goto`, or `*goto_scene`. If execution reaches another `*case`, `*default`, or `*endswitch` label, it jumps immediately to `*endswitch`; there is no fall-through.
- If no case matches and there is no `*default`, execution falls through to `*endswitch` and continues normally.
- `*endswitch` is required. Omitting it is a parse error.
- Nested `*switch` is supported.

Value matching compares as string and loosely as number. `*case "5"` matches a variable holding integer `5`.

### Example: Distinct Bodies

```
*switch cunning
*case 0
You are perfectly honorable. Your word is law.
*finish
*case 100
You are perfectly cunning. Your word is a trap.
*finish
*default
You are somewhere in between, pragmatic perhaps.
*finish
*endswitch
```

### Example: Sequential Cases

```
*temp bonus 0
*switch tier
*case "bronze"
*set bonus 100
*finish
*case "silver"
*set bonus 250
*finish
*case "gold"
*set bonus 500
*finish
*endswitch
You receive ${bonus} gold.
```

Only the matching case runs. After its body completes (or hits `*finish`), execution does not continue into subsequent cases.

**No fall-through:** `*switch` does not support C-style fall-through. When a `*case` or `*default` label is reached during execution of a matched case's body, it acts as an immediate jump to `*endswitch`. You cannot deliberately let one case run into the next.
