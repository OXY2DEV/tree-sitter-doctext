;;; Inline elements.

(italic) @markup.italic
(bold) @markup.strong
((code) @markup.raw @nospell)

(single_quote) @markup.link
(double_quote) @markup.quote @nospell

(issue_reference) @constant @nospell

(number) @number
; (punctuation) @punctuation.delimiter

(mention) @label
(url) @string.special.url @nospell


;; Task specific highlights

(task
  (label) @markup.strong)

(task
  (decorations
    (topic) @markup.strong))

(task
  (label) @comment.note @nospell
  (#any-of? @comment.note "PRAISE" "praise" "SUGGESTION" "suggestion" "THOUGHT" "thought" "note" "NOTE" "info" "INFO" "XXX"))

(task
  (label) @comment.warn @nospell
  (#any-of? @comment.warn "NITPICK" "nitpick" "WARNING" "warning" "FIX" "fix" "HACK" "hack"))

(task
  (label) @comment.todo @nospell
  (#any-of? @comment.todo "TODO" "todo" "TYPO" "typo" "WIP" "wip"))

(task
  (label) @comment.error @nospell
  (#any-of? @comment.error "ISSUE" "issue" "ERROR" "error" "FIXME" "fixme" "DEPRECATED" "deprecated"))

(task
  (label)
  (decorations
    (topic) @markup.strong))

((task)
 (paragraph) @comment)
