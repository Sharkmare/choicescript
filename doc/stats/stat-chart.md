[ChoiceScript Docs](../../README.md) › [Stats & Achievements](README.md) › Stat Chart

# Stat Chart

---

## The Stats Screen

The stats screen is accessible from the in-game menu at any time. Its contents are defined entirely in `choicescript_stats.txt`. Every ChoiceScript game must include this file. The engine will error if it is missing.

---

## `*stat_chart`

Defines the rows that appear on the stats screen. Each row type controls how a variable is presented.

### Row types

| Row type | Syntax | Notes |
|---|---|---|
| `text` | `text varname [Label]` | Shows the variable's value as plain text. Label is optional; defaults to the variable name. |
| `percent` | `percent varname [Label]` | Shows the variable as a percentage bar (0-100). Label optional. |
| `opposed_pair` | `opposed_pair varname` then two indented label lines | Two-label percentage bar. High value (100) = first label. Low value (0) = second label. |

### `opposed_pair` syntax

The variable name goes on the `opposed_pair` line. The two label names go on the next two indented lines: high-value label first, low-value label second.

```
*stat_chart
  opposed_pair Brutality
    Brutality
    Finesse
  opposed_pair Cunning
    Cunning
    Honor
  opposed_pair Disdain
    Disdain
    Vigilance
  percent Infamy
  text wealth_text Wealth
  text wound_text Wounds
```

For `opposed_pair Brutality`, the engine reads the variable `brutality`. A value of 100 displays fully toward "Brutality"; a value of 0 displays fully toward "Finesse".

Optional definitions: each label may have a further-indented definition line below it, which appears as tooltip or supplemental text on supported platforms.

---

## `*achievement`: Declaring Achievements

Achievements must be declared in `startup.txt` before they can be awarded. Place all `*achievement` declarations together near the top of the file.

```
*achievement id points title
  Description shown to the player when the achievement is locked (not yet earned).
  Description shown to the player when the achievement is unlocked (earned).
```

### Parameters

| Parameter | Type | Notes |
|---|---|---|
| `id` | identifier | Unique. Letters and numbers only. Used by `*achieve` to award it. |
| `points` | integer | Typically 5, 10, 15, or 20. Displayed alongside the achievement. |
| `title` | string | Display name shown on the achievements screen. |

The two description lines are required. The first appears when the achievement is locked (may be vague). The second appears once earned (may be specific).

### Example

```
*achievement hoarder 15 The Hoard Grows
  Accumulate a great sum of gold.
  You amassed 10,000 gold pieces. A worthy hoard.

*achievement first_blood 5 First Blood
  You have shed blood for the first time.
  You slew your first enemy. Many more followed.
```

---

## `*achieve`: Awarding Achievements

Award an achievement at the moment a condition is met.

```
*if wealth >= 10000
  *achieve hoarder
```

Syntax: `*achieve id`

- If the achievement was already earned, the call is silently ignored.
- Order of `*achieve` calls does not matter; duplicate awards are safe.

---

## `*check_achievements`

Forces a refresh of the achievements display. Rarely needed, as the engine updates automatically on screen open. Use if you award multiple achievements in rapid succession and need the UI to reflect them immediately.

```
*check_achievements
```

---

## Platform Note

Achievements only function in the Choice of Games platform environment (web player, mobile app, Steam). In the local testing environment (`index.html` opened directly), `*achieve` calls succeed silently without recording anything. Test achievement logic through conditional branching; verify the award display on the platform.
