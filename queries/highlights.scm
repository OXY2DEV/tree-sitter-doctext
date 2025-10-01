((word) @spell)

(italic) @markup.italic
(bold) @markup.strong
(code) @markup.raw

(single_quote) @markup.link
(double_quote) @markup.quote

(issue_reference) @constant

(number) @number

[
  (punctuation)
  (start_delimeter)
  (end_delimeter)
] @punctuation.delimiter

[
 ":"
 ","
] @punctuation.delimiter

[
 "("
 ")"
] @punctuation.bracket

(mention) @label
(url) @string.special.url

(_
  type: (string) @type)

(breaking) @operator

(_
  type: (string) @comment.note
  (#any-of? @comment.note "PRAISE" "praise" "SUGGESTION" "suggestion" "THOUGHT" "thought" "note" "NOTE" "info" "INFO" "XXX" "BREAKING CHANGE"))
;
(_
  type: (string) @comment.warning
  (#any-of? @comment.warning "NITPICK" "nitpick" "WARNING" "warning" "FIX" "fix" "HACK" "hack"))

(_
  type: (string) @comment.todo
  (#any-of? @comment.todo "TODO" "todo" "TYPO" "typo" "WIP" "wip"))
;
(_
  type: (string) @comment.error
  (#any-of? @comment.error "ISSUE" "issue" "ERROR" "error" "FIXME" "fixme" "DEPRECATED" "deprecated"))

(task_scope
  (string) @markup.strong)

(code_block
  language: (string) @label
  content: (code_block_content) @markup.raw)

(comment) @comment

(comment
  property: (string) @type
  content: (string) @string)

