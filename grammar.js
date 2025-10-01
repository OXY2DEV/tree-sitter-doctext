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
  name: "doctext",

  extras: _ => [
    /[ \t]/,
  ],

  externals: $ => [ $.newlinw_or_eof ],

  rules: {
    //|fS

    documentation: $ => repeat(
      choice(
        /[\n\r]+/,
        seq(
          $._documentation_component,
          $.newlinw_or_eof,
        )
      ),
    ),

    _documentation_component: $ => choice(
      $.task,
      prec(-1, alias($.string, $.line)),
      $.code_block,
      $.comment,

      $.footer
    ),

    //|fE

    //|fS "chunk: Comment"

    comment: $ => choice(
      $._property_comment,
      $._content_comment
    ),

    _property_comment: $ => seq(
      $.comment_delimeter,
      field("property", alias($.comment_property, $.string)),
      ":",
      field("content", alias($.comment_string, $.string)),
    ),
    _content_comment: $ => seq(
      $.comment_delimeter,
      field("content", alias($.comment_property, $.string)),
    ),

    comment_delimeter: _ => "#",

    comment_property: _ => token(/[^:\s][^:\n\r]+/),
    comment_string: _ => /[^ \t][^\n\r]+/,

    //|fE

    //|fS "chunk: Task"

    task: $ => seq(
      field("type", alias(/\w+/, $.string)),
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
      alias(/[^\s,\)\(@#]+/, $.string)
    ),

    //|fE

    //|fS

    footer: $ => seq(
      field("type", alias($.footer_type, $.string)),
      token.immediate(
        choice(":", "#")
      ),
      field("description", $.string),
    ),

    footer_type: _ => choice(
      "BREAKING CHANGE",
      /\w[^:#\s\(\!]*/
    ),

    //|fE

    //|fS "chunk: String"

    string: $ => prec.right(repeat1($._string_component)),

    _string_component: $ => choice(
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
      $.autolink
    ),

    word: _ => token(/\w+/),

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

    single_quote: _ => inlineSyntax("'"),
    double_quote: _ => inlineSyntax('"'),

    number: _ => token(choice(
      /\.\d+/,
      /\d+/,
      /\d+\.\d+/
    )),
    punctuation: _ => token(/\p{P}/u),

    mention: _ => token(seq(
      "@",
      /\w+/
    )),

    //|fE

    //|fS "chunk: Code blocks"

    code_block: $ => seq(
      alias("```", $.start_delimeter),
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
      alias("```", $.end_delimeter),
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

