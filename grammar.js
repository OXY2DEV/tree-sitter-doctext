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
  return token(seq(
    delimiter,
    repeat(
      choice(
        "\\" + (escaped || delimiter),
        RegExp("[^" + (escaped || delimiter) + "]"),
      )
    ),
    delimiter,
  ));
}

module.exports = grammar({
  name: "doctext",

  rules: {
    documentation: $ => repeat(
      choice(
        $.task,
        $.paragraph,
        $.code_block,
      )
    ),

    code_block: $ => seq(
      "```",
      optional(
        alias(/[\w_]+/, $.language),
      ),
      /\n/,
      alias(
        repeat1(/./),
        $.content
      ),
      "```"
    ),

    task: $ => prec.right(seq(
      alias(/\w+/, $.label),
      optional($.decorations),
      token.immediate(":"),

      alias(repeat1($._inline), $.subject),
      optional(/\n+/),
    )),

    decorations: $ => seq(
      "(",
      repeat1(
        seq(
          $._decoration,
          optional(","),
        )
      ),
      ")",
    ),
    _decoration: $ => choice(
      $.mention,
      alias(
        token(/[\w\-_]+/),
        $.topic
      ),
    ),

    paragraph: $ => prec.right(seq(
      repeat1($._inline),
      optional(/\n{2,}/)
    )),

    _inline: $ => choice(
      $.code,
      $.bold,
      $.italic,

      $.single_quote,
      $.double_quote,

      $.issue_reference,

      $.word,
      $.number,
      $.punctuation,

      $.mention,
      $.url,
    ),

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

    issue_reference: _ => token(choice(
      seq("#", /\d+/),
      seq(/[a-zA-Z0-9_-]+/, "/", /[a-zA-Z0-9_-]+/, "#", /\d+/)
    )),

    code: _ => inlineSyntax("`"),
    italic: _ => inlineSyntax("*"),
    bold: _ => inlineSyntax("**", "*"),

    single_quote: _ => inlineSyntax("'"),
    double_quote: _ => inlineSyntax('"'),

    word: _ => token(/\w+/),
    number: _ => token(choice(
      /\.\d+/,
      /\d+/,
      /\d+\.\d+/
    )),
    punctuation: _ => prec(-100, token(/\p{P}/u)),

    mention: _ => token(seq(
      "@",
      /\w+/
    )),
  }
});

