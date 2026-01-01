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
/**
 * @file Tree-sitter parser for writing documentation in plaintext(usually as comments in code)
 * 
 * @license MIT
 * @param {RuleOrLiteral} delimiter
 * @param {string | undefined} [escaped]
 */
function inlineSyntax (delimiter, escaped) {
  return token(
    seq(
      delimiter,
      repeat(
        choice(
          "\\" + (escaped || delimiter),
          // Do not allow Newlines & Carriage returns within inline elements
          RegExp("[^\n\r" + (escaped || delimiter) + "]"),
        )
      ),
      delimiter,
    )
  );
}

module.exports = grammar({
  name: "comment",

  extras: _ => [
    /[ \t]/,
  ],

  externals: $ => [ $.newline_or_eof, $.injection_delimiter ],

  rules: {
    //|fS

    documentation: $ => seq(
      optional($.injection_delimiter),
      repeat(
        choice(
          /[\n\r]+/,
          $._documentation_line
        )
      ),
    ),

    _documentation_line: $ => seq(
      $._documentation_component,
      $.newline_or_eof,
    ),

    _documentation_component: $ => choice(
      $.task,
      $.footer,
      $.code_block,
      $.comment,

      alias($.string, $.line),
    ),

    //|fE

    //|fS "chunk: Comment"

    comment: $ => choice(
      $._property_comment,
      $._content_comment
    ),

    _property_comment: $ => seq(
      $.comment_delimiter,
      field("property", alias($.comment_property, $.string)),
      ":",
      optional(
        field("content", alias($.comment_string, $.string))
      ),
    ),
    _content_comment: $ => seq(
      $.comment_delimiter,
      optional(
        field("content", alias($.comment_property, $.string))
      ),
    ),

    comment_delimiter: _ => "#",

    comment_property: _ => token(/[^:\s][^:\n\r]+/),
    comment_string: _ => token(/\S[^\n\r]+/),

    //|fE

    //|fS "chunk: Task"

    task: $ => seq(
      field("type", $.word),
      optional($.task_scope),

      optional(
        alias(
          token.immediate("!"),
          $.breaking
        )
      ),
      token.immediate(":"),
      field("description", $.string),
    ),

    task_scope: $ => seq(
      "(",
      $._scope_name,
      repeat(
        seq(
          ",",
          $._scope_name
        )
      ),
      ")",
    ),

    _scope_name: $ => choice(
      $.mention,
      $.issue_reference,
      alias(token(/[0-9a-zA-Z_-]+/), $.word) // Topic names may have `numbers` in them.
    ),

    //|fE

    //|fS "chunk: Footer"

    footer: $ => seq(
      field("type", $.footer_type),
      token.immediate(
        choice(":", "#")
      ),
      field("description", $.string),
    ),

    footer_type: $ => choice(
      "BREAKING CHANGE",
      "Last Change",
      seq(
        $.word,
        repeat(
          seq("-", $.word,)
        )
      ),
    ),

    //|fE

    //|fS "chunk: String"

    string: $ => repeat1($._string_component),

    _string_component: $ => prec.left(choice(
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
      $.autolink,

      $.taglink,
    )),

    word: _ => token(/[a-zA-Z_-]+/),

    url: _ => token(
      choice(
        /http:\/\/\S+/,
        /https:\/\/\S+/,
        /www\.\S+/,
      )
    ),

    issue_reference: _ => token(choice(
      seq(
        "#",
        token.immediate(/\d+/)
      ),
      seq(
        /[a-zA-Z0-9_-]+/,
        token.immediate("/"),
        token.immediate(/[a-zA-Z0-9_-]+/),
        token.immediate("#"),
        token.immediate(/\d+/),
      )
    )),

    code: _ => inlineSyntax("`"),
    italic: _ => inlineSyntax("*"),
    bold: _ => inlineSyntax("**", "*"),

    autolink: _ => token(/<[^>]+>/),

    // Single quotes can't have spaces & tabs inside them.
    single_quote: _ => inlineSyntax("'", "\t '"),
    double_quote: _ => inlineSyntax('"'),

    number: _ => token(choice(
      /[+-]?\.\d+/,
      /[+-]?\d+/,
      /[+-]?\d+\.\d+/
    )),
    punctuation: _ => token(/\p{P}/u),

    mention: _ => token(seq(
      "@",
      /[a-zA-Z0-9_-]+/
    )),

    taglink: _ => inlineSyntax("|", "\t \|"),

    //|fE

    //|fS "chunk: Code blocks"

    code_block: $ => seq(
      alias("```", $.start_delimiter),
      optional(
        field(
          "language",
          alias(/[\w_]+/, $.string)
        )
      ),
      /\n/,
      field(
        "content",
        $.code_block_content,
      ),
      alias("```", $.end_delimiter),
    ),

    code_block_content: _ => prec.right(
      repeat1(
        choice(
          /[^`]+/,
          /`\{1,2}[^`]+/,
        )
      )
    ),

    //|fE
  }
});

