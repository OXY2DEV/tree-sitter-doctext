#include "tree_sitter/parser.h"
#include <ctype.h>

enum TokenType {
	NEWLINE_OR_EOF,
	INJECTION_DELIMITER
};

void *tree_sitter_doctext_external_scanner_create() { return NULL; }
void tree_sitter_doctext_external_scanner_destroy(void *payload) {}
void tree_sitter_doctext_external_scanner_reset(void *payload) {}
unsigned tree_sitter_doctext_external_scanner_serialize(void *payload, char *buffer) { return 0; }
void tree_sitter_doctext_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {}

bool tree_sitter_doctext_external_scanner_scan(
	void *payload,
	TSLexer *lexer,
	const bool *valid_symbols
) {
	if (valid_symbols[NEWLINE_OR_EOF]) {
		if (lexer->eof(lexer)) {
			lexer->result_symbol = NEWLINE_OR_EOF;
			return true;
		}

		bool matched = false;

		while (lexer->lookahead == '\n' || lexer->lookahead == '\r') {
			matched = true;

			if (lexer->lookahead == '\r') {
				lexer->advance(lexer, true);

				if (lexer->lookahead == '\n') {
					lexer->advance(lexer, true);
				}
			} else {
				lexer->advance(lexer, true);
			}
		}

		if (matched) {
			lexer->result_symbol = NEWLINE_OR_EOF;
			return true;
		}
	} else if (valid_symbols[INJECTION_DELIMITER]) {
		if (lexer->eof(lexer)) {
			return false;
		} else if (!ispunct(lexer->lookahead)) {
			return false;
		}

		while (ispunct(lexer->lookahead)) {
			lexer->advance(lexer, false);
		}

		lexer->result_symbol = INJECTION_DELIMITER;
		return true;
	}

	return false;
}

// vim:noexpandtab:
