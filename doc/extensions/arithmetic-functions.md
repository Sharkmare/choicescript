[ChoiceScript Docs](../../README.md) › [Extensions](README.md) › Arithmetic Functions

# Arithmetic Functions

These functions can be used anywhere a value is expected: in `*set`, `*temp`, `*if` conditions, and as arguments to other functions.

---

## Math Functions

### `floor(n)`: Round Down

Returns the largest integer less than or equal to `n`.

```
*temp x floor(3.9)
```

`x = 3`

```
*temp x floor(-1.2)
```

`x = -2`

### `ceil(n)`: Round Up

Returns the smallest integer greater than or equal to `n`.

```
*temp x ceil(3.1)
```

`x = 4`

### `abs(n)`: Absolute Value

Returns the non-negative magnitude of `n`.

```
*temp x abs(-5)
```

`x = 5`

```
*temp x abs(score)
```

`x` is always non-negative regardless of `score`'s sign.

### `min(a, b)`: Smaller of Two Values

```
*temp capped min(health, 100)
```

Caps `health` at 100. If `health` is already below 100, returns `health` unchanged.

### `max(a, b)`: Larger of Two Values

```
*temp floored max(score, 0)
```

Floors `score` at 0. If `score` is already above 0, returns `score` unchanged.

---

## String Functions

### `lowercase(s)`: Convert to Lowercase

```
*temp slug lowercase(playername)
```

Useful for normalizing user input before comparison or display.

### `uppercase(s)`: Convert to Uppercase

```
*set title uppercase(title)
```

---

## Unary Minus

Negate a number literal or variable anywhere a value is expected. No parentheses required.

```
*temp x -7
```

```
*temp x -score
```

Works inside function arguments:

```
*set damage max(0, -armor + raw_damage)
```

Works at the start of expressions and after operators:

```
*if abs(-cunning + 50) > 20
  You are far from the middle ground.
```

---

## Combining Functions

Functions compose: the return value of one can be passed directly as an argument to another.

```
*temp result floor(abs(-3.7))
```

`result = 3`

```
*temp safe min(max(raw, 0), 100)
```

Clamps `raw` to the range [0, 100] in one expression.
