import XCTest
import SwiftTreeSitter
import TreeSitterDoctext

final class TreeSitterDoctextTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_doctext())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading DocText grammar")
    }
}
