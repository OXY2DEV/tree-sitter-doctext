(italic) @markup.italic
(bold) @markup.strong
(code) @markup.raw

(single_quote) @markup.link
(double_quote) @markup.quote

(issue_reference) @constant

(number) @number
; (punctuation) @punctuation.delimiter

(mention) @label
(url) @string.special.url

(task
  (label) @markup.strong)

(task
  (decorations
    (topic) @markup.strong))

((task)
 (paragraph) @comment)
