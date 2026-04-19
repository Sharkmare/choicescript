[ChoiceScript Docs](../../README.md) › [Expressions](README.md) › Functions

# Functions

Functions transform values and are used inside expressions: in `*set` assignments, `*if` conditions, and anywhere an expression is valid.

Multi-argument functions (`min`, `max`) separate their arguments with commas. All other functions take a single argument.

Commands marked **[EXT]** require extended ChoiceScript and may not be available in all runners.

---

## Built-in functions

### `not(value)`

Returns the boolean opposite of `value`.

```
*if not(defeated)
  You press the attack.

*set still_alive not(dead)
```

`not(true)` = `false`. `not(false)` = `true`. `not(0)` = `true`. `not(1)` = `false`.

---

### `round(n)`

Rounds `n` to the nearest integer. Halfway values round away from zero.

```
*set display_score round(raw_score)
*if round(average) > 50
  Above average.
```

`round(3.7)` = `4`. `round(3.2)` = `3`. `round(3.5)` = `4`.

---

### `length(s)`

Returns the number of characters in string `s`.

```
*set name_len length(player_name)
*if length(password) < 8
  Password is too short.
```

`length("hello")` = `5`. `length("")` = `0`.

---

### `log(n)`

Returns the base-10 logarithm of `n`.

```
*set magnitude log(damage)
```

`log(100)` = `2`. `log(1)` = `0`. `log(10)` = `1`.

---

### `timestamp(datestring)`

Parses a date string and returns a Unix timestamp (seconds since 1970-01-01 00:00:00 UTC).

```
*set event_time timestamp("2025-06-15")
*if timestamp(today) > event_time
  The deadline has passed.
```

Date string format must be parseable by the underlying JavaScript `Date` constructor. ISO 8601 format (`"YYYY-MM-DD"`) is the most reliable.

---

## Extension functions [EXT]

The following functions are available in extended ChoiceScript environments. They are not part of the original engine.

---

### `floor(n)`

Rounds `n` down to the nearest integer (toward negative infinity).

```
*set pieces floor(total / 3)
*if floor(score) >= 80
  High marks.
```

`floor(3.9)` = `3`. `floor(3.1)` = `3`. `floor(-2.3)` = `-3`.

---

### `ceil(n)`

Rounds `n` up to the nearest integer (toward positive infinity).

```
*set slots ceil(items / 4)
*if ceil(average) > 50
  Rounds up to a pass.
```

`ceil(3.1)` = `4`. `ceil(3.9)` = `4`. `ceil(-2.7)` = `-2`.

---

### `abs(n)`

Returns the absolute value of `n`, removing the sign.

```
*set distance abs(target - position)
*if abs(balance) > 1000
  The account is significantly out of balance.
```

`abs(-5)` = `5`. `abs(5)` = `5`. `abs(0)` = `0`.

For `abs(-variable)` to work, unary minus support must also be present [EXT]. See [operators.md](operators.md).

---

### `min(a, b)`

Returns the smaller of two values.

```
*set safe_wounds min(wounds, 5)
*set capped min(score + bonus, 100)
```

`min(10, 3)` = `3`. `min(7, 7)` = `7`.

---

### `max(a, b)`

Returns the larger of two values.

```
*set floor_score max(score, 0)
*set effective max(base, minimum_allowed)
```

`max(10, 3)` = `10`. `max(0, 0)` = `0`.

---

### `lowercase(s)`

Converts all characters in `s` to lowercase.

```
*set normalized lowercase(player_input)
*if lowercase(answer) = "yes"
  Confirmed.
```

`lowercase("DRAGON")` = `"dragon"`. `lowercase("Hello World")` = `"hello world"`.

---

### `uppercase(s)`

Converts all characters in `s` to uppercase.

```
*set display uppercase(title)
*if uppercase(code) = "OVERRIDE"
  Access granted.
```

`uppercase("dragon")` = `"DRAGON"`. `uppercase("Hello World")` = `"HELLO WORLD"`.

---

## Quick reference

| Function | Args | Returns | EXT? |
|---|---|---|---|
| `not(value)` | 1 | boolean | No |
| `round(n)` | 1 | integer | No |
| `length(s)` | 1 | integer | No |
| `log(n)` | 1 | number | No |
| `timestamp(datestring)` | 1 | integer | No |
| `floor(n)` | 1 | integer | Yes |
| `ceil(n)` | 1 | integer | Yes |
| `abs(n)` | 1 | number | Yes |
| `min(a, b)` | 2 | number | Yes |
| `max(a, b)` | 2 | number | Yes |
| `lowercase(s)` | 1 | string | Yes |
| `uppercase(s)` | 1 | string | Yes |
