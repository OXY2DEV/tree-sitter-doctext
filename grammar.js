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
        $.header,
        $.paragraph
      )
    ),


    header: $ => seq(
      field("name", $.header_type),
      token.immediate(":"),
      field("content", $.header_content),

      choice(/\n/, ".", ";")
    ),

    header_type: $ => seq(
      /\w+/,
      optional(alias($.header_mention, $.mention)),
    ),
    header_mention: _ => seq("(", /[^)]+/, ")"),
    header_content: $ => repeat1($._inline),


    paragraph: $ => seq(
      repeat1($._inline),
      /\n\n?/,
    ),


    _inline: $ => choice(
      $.code,
      $.italic,
      $.bold,
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

    word: _ => token(/\w+/),
    number: _ => token(/[\d.]+/),
    punctuation: _ => token(/["'`\(\)\[\]\{\}\|!#$%&\*\+\-.,/:;<=>?@\^_~]/),

    mention: _ => token(seq(
      "@",
      /\w+/
    )),
  }
});
