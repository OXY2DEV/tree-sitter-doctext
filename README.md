# tree-sitter-comment

![Syntax highlighting](./images/comment-demo.png)

[Tree-sitter](https://github.com/tree-sitter/tree-sitter) parser for [conventional comments](https://conventionalcomments.org/).

>[!NOTE]
> It wasn't named `tree-sitter-comment` as that name is already taken and this parser isn't strictly for `comments`.

## 💡 Features

- Supports a subset of `markdown` such as,
    + *Italic text*
    + **Bold text**
    + `Inline_code`
    + `Code blocks`
- Supports extra syntax such as,
    + `'Single quoted text'`
    + `"Double quoted text"`
    + `@mentions`
    + `owner/repo#12`(Issue reference)
    + `https://example.com`(links)
- Supports correct tree structure for topics, subjects, description etc. to be leveraged by plugins/external programs.
- Queries(syntax & injection) for common comment topics(e.g. NOTE, WIP, FIX etc.).

## 📥 Installation

### 💡 nvim-treesitter

>[!IMPORTANT]
> Make sure to run `:TSUninstall comment` to remove the old parser as this is meant to be a replacement.

>[!NOTE]
> We only support the `main` branch of `nvim-treesitter`!

Put this in your `nvim-treesitter` config,

```lua
vim.api.nvim_create_autocmd("User", {
    pattern = "TSUpdate",
    callback = function()
        require("nvim-treesitter.parsers").comment = {
            install_info = {
                url = "https://github.com/OXY2DEV/tree-sitter-comment",

                branch = "main", -- only needed if different from default branch
                queries = "queries/",
            },
        }
    end
})
```

Now, quit & open Neovim and run this command,

```vim
:TSInstall comment
```

### 💡 manual

1. Install the `tree-sitter` CLI tool.

2. Clone the repository in your machine and `cd` into it.

3. Run `tree-sitter build`(if it tells you to install dependencies then you should install them and retry).

4. Copy the `comment.so` file to `~/.config/nvim/parser/`.

## 💥 Query files(syntax highlighting & injections)

Copy everything inside `queries/` to `~/.config/nvim/queries/comment/` in your machine.

