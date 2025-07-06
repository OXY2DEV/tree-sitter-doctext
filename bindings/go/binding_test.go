package tree_sitter_doctext_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_doctext "github.com/oxy2dev/tree-sitter-doctext/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_doctext.Language())
	if language == nil {
		t.Errorf("Error loading DocText grammar")
	}
}
