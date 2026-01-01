#!/usr/bin/env python3
"""
Flashcard to CSV Converter
Parses markdown flashcards in various formats and exports to CSV
Supports: Front/Back, Q/A, True/False questions
"""

import re
import csv
import sys
from pathlib import Path
from typing import List, Tuple


class FlashcardParser:
    def __init__(self, max_length=1000):
        """
        Initialize parser with configurable max length for flashcards

        Args:
            max_length: Maximum character count for answer (default 1000)
        """
        self.max_length = max_length
        self.flashcards = []

    def clean_text(self, text: str, preserve_code=False) -> str:
        """Remove markdown formatting and extra whitespace"""
        if preserve_code:
            # Keep code blocks but make them compact
            def compact_code(match):
                code = match.group(0)
                # Get first few lines
                lines = code.split('\n')[:5]
                return '\n'.join(lines) + '\n...' if len(code.split('\n')) > 5 else code

            text = re.sub(r'```[\s\S]*?```', compact_code, text)
        else:
            # Remove code blocks entirely
            text = re.sub(r'```[\s\S]*?```', '', text)

        # Remove inline code backticks but keep content
        text = re.sub(r'`([^`]+)`', r'\1', text)
        # Remove bold/italic markers
        text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
        text = re.sub(r'\*([^*]+)\*', r'\1', text)
        # Clean up excessive newlines
        text = re.sub(r'\n{3,}', '\n\n', text)
        # Clean up spaces but preserve newlines
        lines = [' '.join(line.split()) for line in text.split('\n')]
        text = '\n'.join(line for line in lines if line.strip())
        return text.strip()

    def is_header(self, line: str) -> bool:
        """Check if line is a markdown header to skip"""
        return line.strip().startswith('#')

    def is_divider(self, line: str) -> bool:
        """Check if line is a divider"""
        return line.strip() in ['---', '***', '___']

    def extract_code_blocks(self, text: str) -> str:
        """Keep code blocks but make them more compact"""
        # Replace multi-line code blocks with [CODE]
        code_blocks = re.findall(r'```[\s\S]*?```', text)
        if code_blocks and len(text) > self.max_length:
            # If text is too long and has code, just keep a summary
            return re.sub(r'```[\s\S]*?```', '[CODE EXAMPLE]', text)
        return text

    def parse_front_back_format(self, content: str) -> List[Tuple[str, str]]:
        """Parse **Front:** and **Back:** format"""
        cards = []
        pattern = r'\*\*Front:\*\*\s*(.*?)\s*\*\*Back:\*\*([\s\S]*?)(?=\n\s*#{2,}|\*\*Front:|\*\*Q:|---|\Z)'
        matches = re.finditer(pattern, content, re.MULTILINE | re.IGNORECASE)

        for match in matches:
            question = match.group(1).strip()
            answer = match.group(2).strip()

            # Remove any trailing section headers that got captured
            answer = re.sub(r'\n\s*#{2,}.*$', '', answer, flags=re.MULTILINE)

            # Clean and check length
            clean_answer = self.clean_text(answer, preserve_code=True)
            if len(clean_answer) <= self.max_length and clean_answer:
                cards.append((
                    self.clean_text(question),
                    clean_answer
                ))

        return cards

    def parse_qa_format(self, content: str) -> List[Tuple[str, str]]:
        """Parse Q: and A: format (with True/False detection)"""
        cards = []

        # Pattern for Q: ... A: ...
        pattern = r'(?:^|\n)\s*\*\*?Q:?\*\*?\s*(.*?)\s*\*\*?A:?\*\*?\s*(.*?)(?=\n\s*(?:\*\*?Q:?|\-\-\-|#{1,6}\s|\Z))'
        matches = re.finditer(pattern, content, re.MULTILINE | re.IGNORECASE | re.DOTALL)

        for match in matches:
            question = match.group(1).strip()
            answer = match.group(2).strip()

            # Check if it's a True/False question
            tf_match = re.search(r'True or False[:\s]+(.*)', question, re.IGNORECASE)
            if tf_match:
                # Extract the actual question
                question = tf_match.group(1).strip()
                # Keep T/F answer format
                question = f"True or False: {question}"

            # Clean and check length
            clean_answer = self.clean_text(answer, preserve_code=True)
            if len(clean_answer) <= self.max_length and clean_answer:
                cards.append((
                    self.clean_text(question),
                    clean_answer
                ))

        return cards

    def parse_file(self, filepath: str) -> List[Tuple[str, str]]:
        """Parse a markdown file and extract all flashcards"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            all_cards = []

            # Try Front/Back format
            front_back_cards = self.parse_front_back_format(content)
            all_cards.extend(front_back_cards)
            print(f"  Found {len(front_back_cards)} Front/Back cards")

            # Try Q/A format
            qa_cards = self.parse_qa_format(content)
            # Remove duplicates (in case a card matches both patterns)
            qa_cards = [card for card in qa_cards if card not in all_cards]
            all_cards.extend(qa_cards)
            print(f"  Found {len(qa_cards)} Q/A cards")

            return all_cards

        except Exception as e:
            print(f"Error parsing {filepath}: {e}")
            return []

    def export_to_csv(self, flashcards: List[Tuple[str, str]], output_file: str, delimiter='\t'):
        """Export flashcards to CSV/TSV file"""
        try:
            with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile, delimiter=delimiter, quoting=csv.QUOTE_MINIMAL)
                writer.writerow(['Question', 'Answer'])
                writer.writerows(flashcards)

            file_type = "TSV" if delimiter == '\t' else "CSV"
            print(f"\n✅ Successfully exported {len(flashcards)} flashcards to {output_file} ({file_type} format)")

        except Exception as e:
            print(f"❌ Error exporting to CSV: {e}")


def main():
    """Main execution function"""
    # Flashcard files to process
    flashcard_files = [
        "/home/jmillerdev/Documents/jm-secondBrain/web dev core flashcards.md",
        "/home/jmillerdev/Documents/jm-secondBrain/03 - Resources/Anki Decks/PHP Laravel Flashcards.md",
        "/home/jmillerdev/Documents/jm-secondBrain/[[Foundation Layer Flashcards.md",
    ]

    # Output file
    output_csv = "/home/jmillerdev/Documents/jm-secondBrain/php_laravel_flashcards.csv"
    output_tsv = "/home/jmillerdev/Documents/jm-secondBrain/php_laravel_flashcards.tsv"
    output_semicolon = "/home/jmillerdev/Documents/jm-secondBrain/php_laravel_flashcards_semicolon.csv"

    # Parse flashcards
    parser = FlashcardParser(max_length=1000)
    all_flashcards = []

    print("📚 Parsing flashcard files...\n")

    for filepath in flashcard_files:
        if Path(filepath).exists():
            print(f"Processing: {Path(filepath).name}")
            cards = parser.parse_file(filepath)
            all_flashcards.extend(cards)
        else:
            print(f"⚠️  File not found: {filepath}")

    # Remove duplicates while preserving order
    seen = set()
    unique_flashcards = []
    for card in all_flashcards:
        if card not in seen:
            seen.add(card)
            unique_flashcards.append(card)

    print(f"\n📊 Total unique flashcards: {len(unique_flashcards)}")
    print(f"   (Removed {len(all_flashcards) - len(unique_flashcards)} duplicates)")

    # Export to multiple formats
    if unique_flashcards:
        # Tab-separated (TSV) - Best for Anki with code
        parser.export_to_csv(unique_flashcards, output_tsv, delimiter='\t')

        # Comma-separated (CSV) - Standard format
        parser.export_to_csv(unique_flashcards, output_csv, delimiter=',')

        # Semicolon-separated - Alternative for Excel
        parser.export_to_csv(unique_flashcards, output_semicolon, delimiter=';')

        # Show sample
        print("\n📋 Sample flashcards:")
        for i, (q, a) in enumerate(unique_flashcards[:3], 1):
            q_preview = q[:80] + "..." if len(q) > 80 else q
            a_preview = a[:80] + "..." if len(a) > 80 else a
            print(f"\n  {i}. Q: {q_preview}")
            print(f"     A: {a_preview}")

        print("\n💡 Recommendation: Use the .tsv file for Anki (tab-separated works best with code)")
    else:
        print("\n⚠️  No flashcards found to export")


if __name__ == "__main__":
    main()
