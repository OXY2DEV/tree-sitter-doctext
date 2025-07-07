/**
 * @file Tree-sitter parser for writing documentation in plaintext(usually as comments in code)
 * @author MD. Mouinul Hossain <mdmouinulhossainshawon@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

/*
  * Creates a rule for an inline element.
  */
function inlineSyntax (delimiter, escaped) {
  return seq(
    delimiter,
    repeat(
      choice(
        "\\" + (escaped || delimiter),
        RegExp("[^" + (escaped || delimiter) + "]"),
      )
    ),
    delimiter,
  );
}

module.exports = grammar({
  name: "doctext",

  rules: {
    documentation: $ => repeat(
      choice(
        $.task,
        $.paragraph
      )
    ),

    task: $ => prec.right(seq(
      alias(/\w+/, $.label),
      optional($.decorations),
      token.immediate(":"),

      alias(repeat1($._inline), $.subject),
      optional("\n"),
    )),

    decorations: $ => seq(
      "(",
      $._decoration,
      optional(
        repeat1(
          seq(
            ",",
            $._decoration,
          )
        )
      ),
      ")",
    ),
    _decoration: $ => choice(
      $.mention,
      alias($.word, $.topic),
    ),

    paragraph: $ => prec.right(seq(
      repeat1($._inline),
      optional(/\n\n+/)
    )),

    _inline: $ => choice(
      $.code,
      $.bold,
      $.italic,

      $.issue_reference,
      $.url,

      $.word,
      $.number,
      $.punctuation,

      $.mention,
    ),

    issue_reference: _ => token(choice(
      seq("#", /\d+/),
      seq(/[a-zA-Z0-9_-]+/, "/", /[a-zA-Z0-9_-]+/, "#", /\d+/)
    )),

    url: _ => token(seq(
      optional(
        choice(
          "http://",
          "https://",
        ),
      ),
      optional("www."),
      /[a-zA-Z0-9@:%_\+.~#=-]{2,256}/,
      ".",
      /[a-z]{2,6}/,
      /[a-zA-Z0-9@:%_\+.~#?&//=-]+/,
    )),

    code: _ => inlineSyntax("`"),
    italic: _ => inlineSyntax("*"),
    bold: _ => inlineSyntax("**", "*"),

    word: _ => /\w+/,
    number: _ => choice(
      /\.\d+/,
      /\d+/,
      /\d+\.\d+/
    ),
    punctuation: _ => /\p{P}+/u,

    mention: _ => token(seq(
      "@",
      /\w+/
    )),
  }
});

