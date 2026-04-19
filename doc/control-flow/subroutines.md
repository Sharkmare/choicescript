[ChoiceScript Docs](../../README.md) › [Control Flow](README.md) › Subroutines

# Subroutines

Subroutines are reusable labeled blocks that execute and then return control to the caller. Use them to avoid duplicating logic across a scene or across scenes.

---

## `*gosub`

Calls a subroutine defined with `*label` in the current scene. Execution jumps to the label, runs until `*return`, then resumes on the line after `*gosub`.

```
*gosub labelname
```

```
*gosub add_wound
*finish

*label add_wound
*set wounds +1
*return
```

You can call the same subroutine as many times as needed. Each call returns to its own call site.

---

## `*params`

Binds positional arguments passed to a subroutine to named `*temp` variables. Place `*params` as the first line inside the subroutine, immediately after the `*label`.

```
*params var1 var2 ...
```

Pass arguments after the label name in the `*gosub` call:

```
*gosub greet "Alice" "Hello"
*finish

*label greet
*params name greeting
${greeting}, ${name}!
*return
```

Arguments are matched left to right. The variables created by `*params` are temporary (`*temp`) variables. They persist in the scene's temp scope after the subroutine returns; they are not automatically cleaned up. Do not rely on them being reset between calls to the same subroutine.

---

## `*return`

Returns from a subroutine to the line after the `*gosub` that called it.

```
*return
```

Every subroutine must end with `*return`. A subroutine that reaches `*finish` or `*goto_scene` instead of `*return` will not return to the caller.

---

## `*return` with a value [EXT]

In extended ChoiceScript, a subroutine can return a computed value. The result is stored in the temp variable `choice_return`.

```
*return expression
```

```
*gosub double 21
*set result choice_return

*label double
*params n
*return n*2
```

After this, `result` holds `42`.

Return values work only with same-scene `*gosub`. They do not work with `*gosub_scene`.

---

## `*gosub_scene`

Calls a subroutine in a different scene file. Execution jumps to the named label in the other scene, runs until `*return`, then resumes in the original scene after the `*gosub_scene` line.

```
*gosub_scene scenename
*gosub_scene scenename labelname
```

If no label name is given, execution begins at the top of the scene file.

```
*gosub_scene utilities heal_player
```

`*temp` variables do not persist across scene boundaries. Use permanent variables (`*create`) to pass data to and from cross-scene subroutines.

---

## Nesting

Subroutines can call other subroutines. Each nested call pushes a frame onto the call stack.

```
*label outer
*gosub inner
*return

*label inner
*set score +10
*return
```

Stack depth is limited by available memory. Recursive subroutines that do not converge will exhaust the stack.

---

## When to use subroutines vs. `*goto`

| Use | Command |
|---|---|
| Reusable logic that needs to return to the caller | `*gosub` / `*gosub_scene` |
| One-way jump to a different part of the scene | `*goto` |
| One-way jump to a different scene | `*goto_scene` |

`*goto` is simpler and has no stack overhead. Use it when you do not need to return. Use `*gosub` when you need the same logic in multiple places and need execution to continue after the block completes.
