[ChoiceScript Docs](../../README.md) › [Variables](README.md) › Setting and Reading Variables

# Setting and Reading Variables

---

## `*set`: Assign or Update a Variable

`*set` changes the value of a variable. The right-hand side is an expression: a literal value, another variable name, or an arithmetic formula.

```
*set syntax: *set varname expression
```

```
*set score 100
*set name "Aria"
*set health true
*set bonus (score / 2)
```

---

## Shorthand Arithmetic with `*set`

When the expression starts with an operator (`+`, `-`, `*`, `/`), ChoiceScript expands it automatically: the current value of the variable is placed on the left-hand side.

```
*set score +10
```

This is exactly equivalent to:

```
*set score score+10
```

All four operators work the same way:

```
*set gold +500      (add 500)
*set health -1      (subtract 1)
*set damage *2      (double it)
*set speed /4       (divide by 4)
```

This shorthand only works when the operator is the very first character of the expression.

---

## `*setref`: Set a Variable by Name

`*setref` assigns a value to a variable whose **name** is stored in another variable. This allows dynamic dispatch, useful when you have several similar variables and want to pick one at runtime.

```
*setref syntax: *setref name_variable value
```

```
*temp stat_name "courage"
*setref stat_name 30
```

After these two lines, `courage` is `30`. `stat_name` still holds the string `"courage"`.

---

## Reading Variables in Prose: `${}`

Wrap a variable name in `${}` to substitute its value inline in prose.

```
Your score is ${score}.
Welcome back, ${name}.
You have ${gold} gold pieces.
```

The substitution happens at render time. If `score` is `42`, the player sees "Your score is 42."

---

## Capitalization Modifiers

Two modifier forms adjust the case of a substituted value:

- `$!{varname}`: capitalizes the first letter of the value.
- `$!!{varname}`: converts the entire value to ALL CAPS.

```
*create title "dragon slayer"

You are known as the $!{title}.
The crowd chants: $!!{title}!
```

Output:
```
You are known as the Dragon slayer.
The crowd chants: DRAGON SLAYER!
```

---

## `*print`: Legacy Variable Output

`*print` outputs the value of a variable as a line of prose. It predates `${}` substitution and is rarely needed in modern scenes.

```
*print score
```

Prefer `${score}` embedded in prose over `*print`; it gives you more control over formatting and context.

---

## Inline Conditionals: `@{}`

`@{}` substitutes different text depending on a condition or a variable's value.

**Boolean condition:**

```
You are @{alive alive|dead}.
```

If `alive` is `true`, the player sees "You are alive." If false, "You are dead."

**Numeric range (1-based index):**

```
@{score Very low|Low|Medium|High|Very High}
```

The variable's value is used directly as a 1-based index into the options. If `score` is `1`, the player sees "Very low." If `score` is `5`, "Very High."

The value must be a **whole integer** in range. If it is below 1, above the number of options, or a non-integer decimal, the engine throws a runtime error; there is no clamping. Ensure the index is always valid before using `@{}`.

There is no automatic mapping from a range (like 0–100). You must compute the index explicitly. For example, `@{round(score/25) ...}` would map a 0–100 value to a 4-bucket index, but only if the result is always 1–4.

The options are separated by `|`.

---

## `*rand`: Random Number

`*rand` sets a variable to a random integer between `min` and `max`, inclusive.

```
*rand syntax: *rand varname min max
```

```
*rand die_roll 1 6
*rand encounter_type 1 3
```

After `*rand die_roll 1 6`, `die_roll` is a random integer from 1 to 6.

---

## `*input_text`: Player Text Input

`*input_text` pauses the game and prompts the player to type a value. The result is stored in the named variable.

```
*input_text syntax: *input_text varname
```

```
What is your name, traveler?
*input_text player_name

You will be known as ${player_name}.
```

---

## `*input_number`: Player Number Input

`*input_number` prompts the player to type a number and validates that it falls within a specified range.

```
*input_number syntax: *input_number varname min max
```

```
How many soldiers do you send? (1–10)
*input_number soldiers_sent 1 10

You dispatch ${soldiers_sent} soldiers to the front.
```

If the player types a value outside the range, the engine asks again until a valid number is entered.
