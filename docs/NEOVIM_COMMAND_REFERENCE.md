# Neovim Command Reference Guide
## Essential Commands & Keybindings for Daily Development

---

## Table of Contents
1. [Modes in Vim/Neovim](#modes-in-vimneovim)
2. [Basic Navigation](#basic-navigation)
3. [Editing Text](#editing-text)
4. [Selecting Text](#selecting-text)
5. [Finding & Replacing](#finding--replacing)
6. [Line Operations](#line-operations)
7. [File Operations](#file-operations)
8. [Tips & Tricks](#tips--tricks)

---

## Modes in Vim/Neovim

Neovim has several modes. Understanding which mode you're in is crucial:

| Mode | What It's For | How to Enter | How to Exit |
|------|---------------|--------------|-------------|
| **Normal** | Navigation and commands | Default mode | Already there |
| **Insert** | Typing/editing text | `i`, `a`, `o`, etc. | `Esc` |
| **Visual** | Selecting text | `v`, `V`, `Ctrl+v` | `Esc` |
| **Command** | Running commands | `:` | `Esc` or `Enter` |

**Pro Tip:** If you're ever lost, press `Esc` a few times to get back to Normal mode.

---

## Basic Navigation

### Moving the Cursor

| Key | Action | Mnemonic |
|-----|--------|----------|
| `h` | Move left | Think: left arrow |
| `j` | Move down | Think: down arrow |
| `k` | Move up | Think: up arrow |
| `l` | Move right | Think: right arrow |
| `w` | Move forward one word | **w**ord |
| `b` | Move backward one word | **b**ack |
| `e` | Move to end of word | **e**nd |
| `0` | Move to start of line | Zero = beginning |
| `$` | Move to end of line | Dollar = end (like regex) |
| `gg` | Go to top of file | **g**o **g**o! |
| `G` | Go to bottom of file | **G**o to end |
| `{` | Move up one paragraph | Curly up |
| `}` | Move down one paragraph | Curly down |

### Jumping Around

| Key | Action | Use Case |
|-----|--------|----------|
| `Ctrl+u` | Scroll up half a page | Quick upward movement |
| `Ctrl+d` | Scroll down half a page | Quick downward movement |
| `Ctrl+o` | Jump to previous location | Navigate back through jumps |
| `Ctrl+i` | Jump to next location | Navigate forward through jumps |
| `%` | Jump to matching bracket | Navigate `()`, `{}`, `[]` |
| `*` | Jump to next occurrence of word under cursor | Quick search |
| `#` | Jump to previous occurrence of word under cursor | Reverse search |

**Example:**
```
Put cursor on opening {
Press % to jump to closing }
Press % again to jump back
```

---

## Editing Text

### Entering Insert Mode

| Key | Action | When to Use |
|-----|--------|-------------|
| `i` | Insert before cursor | Most common |
| `I` | Insert at beginning of line | Start of line edits |
| `a` | Append after cursor | After current character |
| `A` | Append at end of line | End of line edits |
| `o` | Open new line below | Add line after |
| `O` | Open new line above | Add line before |
| `s` | Substitute character | Replace single char |
| `S` | Substitute entire line | Replace whole line |

### Deleting Text

| Key | Action | What Gets Deleted |
|-----|--------|-------------------|
| `x` | Delete character under cursor | One char |
| `X` | Delete character before cursor | Backspace-like |
| `dw` | Delete word | Word from cursor |
| `dd` | Delete entire line | Whole line |
| `D` | Delete from cursor to end of line | Rest of line |
| `d$` | Delete to end of line | Same as `D` |
| `d0` | Delete to start of line | From cursor left |
| `dG` | Delete to end of file | Everything below |
| `dgg` | Delete to start of file | Everything above |

### Changing Text (Delete + Insert Mode)

| Key | Action | Result |
|-----|--------|--------|
| `cw` | Change word | Delete word, enter insert |
| `ciw` | Change inner word | Delete word (anywhere in it), insert |
| `caw` | Change a word | Delete word + space, insert |
| `ci"` | Change inside quotes | Delete text in `"..."`, insert |
| `ci(` | Change inside parentheses | Delete text in `(...)`, insert |
| `ci{` | Change inside braces | Delete text in `{...}`, insert |
| `cc` | Change entire line | Delete line, insert |
| `C` | Change to end of line | Delete rest of line, insert |

**Example - Change Word Under Cursor:**
```typescript
const email = "test@example.com";
      ^^^^^ cursor here

Press: ciw
Result: Deletes "email", enters insert mode
Type: username
Result: const username = "test@example.com";
```

### Copy (Yank) & Paste

| Key | Action | What Gets Copied |
|-----|--------|------------------|
| `yy` | Yank (copy) line | Entire line |
| `Y` | Yank line | Same as `yy` |
| `yw` | Yank word | Word from cursor |
| `yiw` | Yank inner word | Whole word |
| `yi"` | Yank inside quotes | Text in quotes |
| `p` | Paste after cursor | Below/after |
| `P` | Paste before cursor | Above/before |

**Example - Duplicate a Line:**
```
Position cursor on line
Press: yy
Press: p
Result: Line duplicated below
```

### Undo & Redo

| Key | Action |
|-----|--------|
| `u` | Undo last change |
| `Ctrl+r` | Redo (reverse undo) |
| `U` | Undo all changes on line |

---

## Selecting Text

### Visual Mode Types

| Key | Mode Type | What It Selects |
|-----|-----------|-----------------|
| `v` | Character-wise | Individual characters |
| `V` | Line-wise | Entire lines |
| `Ctrl+v` | Block-wise | Rectangular blocks |

### Visual Mode Workflow

1. **Enter visual mode:** Press `v`, `V`, or `Ctrl+v`
2. **Extend selection:** Use movement keys (`hjkl`, `w`, `e`, etc.)
3. **Perform action:** `y` (yank), `d` (delete), `c` (change), etc.
4. **Exit:** Press `Esc`

**Example - Select Multiple Lines:**
```
V      Enter line-wise visual mode
jjj    Select 3 more lines down
y      Copy selection
```

### Text Objects (Super Powerful!)

Format: `{operator}{modifier}{object}`

**Operators:**
- `d` = delete
- `c` = change
- `y` = yank
- `v` = visual select

**Modifiers:**
- `i` = **i**nner (excludes delimiters)
- `a` = **a**round (includes delimiters)

**Objects:**
- `w` = word
- `"` = double quotes
- `'` = single quotes
- `` ` `` = backticks
- `(` or `)` = parentheses
- `{` or `}` = braces
- `[` or `]` = brackets
- `t` = HTML/XML tag

**Examples:**

| Command | Action | Example |
|---------|--------|---------|
| `ciw` | Change inner word | `hello world` → change "hello" |
| `ci"` | Change inside quotes | `"hello"` → `""` (in insert mode) |
| `di(` | Delete inside parens | `(hello)` → `()` |
| `ya{` | Yank around braces | `{ code }` → copies including `{}` |
| `vit` | Visual select inside tag | `<div>text</div>` → selects "text" |

---

## Finding & Replacing

### Search

| Key/Command | Action | Example |
|-------------|--------|---------|
| `/pattern` | Search forward | `/function` finds next "function" |
| `?pattern` | Search backward | `?const` finds previous "const" |
| `n` | Next match | Jump to next occurrence |
| `N` | Previous match | Jump to previous occurrence |
| `*` | Search word under cursor (forward) | Quick find |
| `#` | Search word under cursor (backward) | Quick find reverse |

**Tips:**
- After searching with `/`, press `Enter`, then use `n` and `N` to cycle
- Press `Esc` to exit search highlighting

### Replace (Substitute Command)

**Format:** `:s/old/new/flags`

| Command | What It Does | Scope |
|---------|--------------|-------|
| `:s/old/new/` | Replace first on current line | Current line only |
| `:s/old/new/g` | Replace all on current line | Current line, all matches |
| `:%s/old/new/g` | Replace all in file | Entire file |
| `:%s/old/new/gc` | Replace all with confirmation | Entire file, asks each time |
| `:10,20s/old/new/g` | Replace in line range | Lines 10-20 |

**Confirmation Options (when using `c` flag):**
- `y` = yes, replace this one
- `n` = no, skip this one
- `a` = replace all remaining
- `q` = quit
- `l` = replace this one and quit

**Example - Replace "email" with "username" in File:**
```vim
:%s/email/username/g
```

**Example - Replace with Confirmation:**
```vim
:%s/email/username/gc

" For each match:
" replace with username (y/n/a/q/l)?
```

### Advanced: Change Next Match

Very useful pattern for selective replacements:

1. Search for word: `*` (highlights all instances)
2. Change next occurrence: `cgn`
3. Type replacement
4. Press `Esc`
5. Repeat with `.` (dot) for each additional replacement

**Example:**
```typescript
const email = "test@example.com";
const email = "user@example.com";
const email = "admin@example.com";

Put cursor on "email"
Press: *            (highlights all "email")
Press: cgn          (changes next match)
Type: username
Press: Esc
Press: .            (changes next match)
Press: .            (changes next match)
```

---

## Line Operations

### Duplicating Lines

| Method | Keys | Result |
|--------|------|--------|
| Yank & paste | `yyp` | Duplicate line below |
| Yank & paste above | `yyP` | Duplicate line above |

**Breakdown:**
- `yy` = yank (copy) current line
- `p` = paste below
- `P` = paste above

### Moving Lines

| Keys | Action |
|------|--------|
| `dd` then `p` | Cut line, paste below |
| `dd` then `P` | Cut line, paste above |
| `:m +1` | Move line down one |
| `:m -2` | Move line up one |

### Indenting

| Keys | Action |
|------|--------|
| `>>` | Indent line right |
| `<<` | Indent line left |
| `==` | Auto-indent line |
| `gg=G` | Auto-indent entire file |

**In Visual Mode:**
```
V      Select lines
j      Extend selection
>      Indent right
<      Indent left
```

### Joining Lines

| Keys | Action | Result |
|------|--------|--------|
| `J` | Join line below | Adds space |
| `gJ` | Join without space | No space added |

---

## File Operations

### Saving & Quitting

| Command | Action | Use Case |
|---------|--------|----------|
| `:w` | Write (save) | Save file |
| `:w filename` | Save as | Save to new file |
| `:q` | Quit | Close file (if saved) |
| `:q!` | Quit without saving | Discard changes |
| `:wq` | Write and quit | Save & close |
| `ZZ` | Write and quit | Same as `:wq` |
| `:x` | Write if changed, quit | Smart save & close |

### Multiple Files

| Command | Action |
|---------|--------|
| `:e filename` | Edit file |
| `:bn` | Next buffer |
| `:bp` | Previous buffer |
| `:bd` | Close buffer |
| `:buffers` | List open buffers |
| `:b3` | Go to buffer 3 |

---

## Tips & Tricks

### The Dot Command `.`

**The most powerful command in Vim!**

`.` repeats the last change you made.

**Example:**
```typescript
// Delete word, repeat with dot
dw      Delete word
.       Delete next word
.       Delete next word

// Change word, repeat pattern
ciw     Change word
[type new word]
Esc
.       Change next word to same thing
```

### Macros (Record & Replay)

Record repetitive tasks:

1. **Start recording:** `q{letter}` (e.g., `qa` for macro "a")
2. **Perform actions:** Do your edits
3. **Stop recording:** `q`
4. **Replay macro:** `@{letter}` (e.g., `@a`)
5. **Repeat last macro:** `@@`

**Example - Add semicolon to end of multiple lines:**
```
qa          Start recording to 'a'
A;          Go to end of line, add semicolon
Esc         Exit insert mode
j           Move down
q           Stop recording

@a          Replay macro
@@          Replay again
10@a        Replay 10 times
```

### Combining Commands

Commands can be combined for powerful edits:

| Combination | Breakdown | Result |
|-------------|-----------|--------|
| `d3w` | Delete 3 words | `d` + `3w` |
| `c$` | Change to end of line | `c` + `$` |
| `y10j` | Yank 10 lines down | `y` + `10j` |
| `5dd` | Delete 5 lines | `5` + `dd` |
| `>3j` | Indent 3 lines down | `>` + `3j` |

### Quick Fixes

| Problem | Solution |
|---------|----------|
| Made a mistake | Press `u` to undo |
| Accidentally deleted something | Press `u`, then `p` to paste it back |
| Want to try something risky | Save first with `:w` |
| Lost and confused | Press `Esc` multiple times |
| Need to exit NOW | Press `:q!` and Enter |

### Efficiency Tips

**1. Stay in Normal Mode**
- Don't stay in Insert mode when not typing
- Press `Esc` frequently to return to Normal mode
- Most navigation/editing is done in Normal mode

**2. Use Motions with Operators**
Instead of: `i`, type text, `Esc`, `i`, type text, `Esc`...
Do this: `ciw` to change word, `caw` to change word with space

**3. Think in Text Objects**
- `ci"` = change inside quotes
- `da{` = delete around braces
- `yi(` = yank inside parentheses

**4. Visual Mode is for Uncertainty**
If you're not sure exactly what will be selected, use Visual mode first:
- Press `v` to enter visual
- Move cursor to see selection
- Perform action (y, d, c)

**5. Use Search for Navigation**
Instead of moving line by line:
- `/functionName` to jump to function
- `n` to go to next occurrence

---

## Common Patterns & Workflows

### Pattern 1: Change All Instances of a Word

**Method 1: Substitute (changes all at once)**
```vim
:%s/oldWord/newWord/gc
```

**Method 2: Selective (change one at a time)**
```
*          Search for word
cgn        Change next match
[type]     Type replacement
Esc        Exit insert
.          Repeat on next (press for each)
```

### Pattern 2: Reformat Code

```
gg=G       Auto-indent entire file
```

### Pattern 3: Delete Everything Inside Brackets

```javascript
function test() {
    // lots of code here
}

Position cursor inside {}
Press: di{
Result: function test() {}
```

### Pattern 4: Select & Copy Multiple Lines

```
V          Line-wise visual
5j         Select 5 lines down
y          Yank (copy)
G          Go to end of file
p          Paste
```

### Pattern 5: Replace Word Under Cursor Throughout File

```
*          Highlight word
cgn        Change next
[type]     Type replacement
Esc        Exit
.          Repeat (for each instance)
```

---

## Cheat Sheet - Most Used Commands

### Navigation (Normal Mode)
```
h j k l      ← ↓ ↑ →
w b          Next/previous word
0 $          Start/end of line
gg G         Top/bottom of file
*            Find word under cursor
```

### Editing (Normal Mode)
```
i a o        Enter insert mode (before/after/newline)
x            Delete character
dd           Delete line
yy           Copy line
p            Paste
u            Undo
Ctrl+r       Redo
```

### Changing (Delete + Insert)
```
ciw          Change inner word
ci"          Change inside quotes
caw          Change word + space
cc           Change entire line
```

### Visual Mode
```
v            Character-wise select
V            Line-wise select
```

### Search & Replace
```
/pattern     Search
n N          Next/previous match
:%s/old/new/g    Replace all
```

### Files
```
:w           Save
:q           Quit
:wq or ZZ    Save and quit
:q!          Quit without saving
```

---

## Practice Exercises

### Exercise 1: Basic Editing
Open a file and try:
1. Navigate to a word using `w` and `b`
2. Delete it with `dw`
3. Undo with `u`
4. Redo with `Ctrl+r`

### Exercise 2: Text Objects
In a code file:
1. Find a function call like `console.log("hello")`
2. Put cursor anywhere on "hello"
3. Press `ci"` to change the text inside quotes
4. Type something new

### Exercise 3: Duplication
1. Navigate to a line
2. Press `yyp` to duplicate it
3. Press `u` to undo
4. Press `yyP` to duplicate above

### Exercise 4: Search & Replace
1. Search for a word with `/word`
2. Press `n` to go to next match
3. Replace all with `:%s/word/newword/gc`
4. Choose `y` or `n` for each

### Exercise 5: Visual Mode
1. Press `V` to enter line-wise visual
2. Press `j` a few times to select lines
3. Press `y` to copy
4. Move somewhere and press `p` to paste

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│                    NEOVIM QUICK REF                     │
├─────────────────────────────────────────────────────────┤
│ MODES                                                   │
│  Esc      → Normal mode                                 │
│  i        → Insert mode (before cursor)                 │
│  a        → Insert mode (after cursor)                  │
│  v        → Visual mode                                 │
│  :        → Command mode                                │
├─────────────────────────────────────────────────────────┤
│ NAVIGATION                                              │
│  h j k l  → ← ↓ ↑ →                                     │
│  w b      → Word forward/back                           │
│  0 $      → Line start/end                              │
│  gg G     → File start/end                              │
├─────────────────────────────────────────────────────────┤
│ EDITING                                                 │
│  x        → Delete char                                 │
│  dd       → Delete line                                 │
│  yy       → Copy line                                   │
│  p        → Paste                                       │
│  u        → Undo                                        │
│  Ctrl+r   → Redo                                        │
│  ciw      → Change word                                 │
│  .        → Repeat last change                          │
├─────────────────────────────────────────────────────────┤
│ SEARCH                                                  │
│  /text    → Search forward                              │
│  n        → Next match                                  │
│  *        → Find word under cursor                      │
│  :%s/old/new/g → Replace all                            │
├─────────────────────────────────────────────────────────┤
│ FILES                                                   │
│  :w       → Save                                        │
│  :q       → Quit                                        │
│  :wq      → Save & quit                                 │
│  :q!      → Quit without saving                         │
└─────────────────────────────────────────────────────────┘
```

---

## Remember

**The Vim Philosophy:**
- **Operators** + **Motions** = Powerful edits
- **Repeat** with `.` instead of recording macros
- **Think in text objects:** `ciw`, `ci"`, `da{`
- **Stay in Normal mode** when not actively typing
- **Practice makes perfect** - start with basics, add more as you go

**When Stuck:**
1. Press `Esc` to get back to Normal mode
2. Type `:q!` to quit without saving
3. Start fresh!

---

**Happy Vimming! 🚀**

*The more you use these commands, the more natural they become. Start with the basics (h j k l, i, Esc, :w, :q) and gradually add more to your workflow.*
