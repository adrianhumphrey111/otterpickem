// Constants for *SEARCH/REPLACE block* Rules

const SEARCH_REPLACE_BLOCK_FORMAT = [
  "1. The file path alone on a line, verbatim. No bold asterisks, no quotes around it, no escaping of characters, etc.",
  "2. The opening fence and code language, eg: ```python",
  "3. The start of search block: <<<<<<< SEARCH",
  "4. A contiguous chunk of lines to search for in the existing source code",
  "5. The dividing line: =======",
  "6. The lines to replace into the source code",
  "7. The end of the replace block: >>>>>>> REPLACE",
  "8. The closing fence: ```"
];

const SEARCH_REPLACE_RULES = [
  "Every *SEARCH* section must *EXACTLY MATCH* the existing source code, character for character, including all comments, docstrings, etc.",
  "*SEARCH/REPLACE* blocks will replace *all* matching occurrences.",
  "Include enough lines to make the SEARCH blocks uniquely match the lines to change.",
  "Keep *SEARCH/REPLACE* blocks concise.",
  "Break large *SEARCH/REPLACE* blocks into a series of smaller blocks that each change a small portion of the file.",
  "Include just the changing lines, and a few surrounding lines if needed for uniqueness.",
  "Do not include long runs of unchanging lines in *SEARCH/REPLACE* blocks.",
  "Only create *SEARCH/REPLACE* blocks for files that the user has added to the chat!",
  "To move code within a file, use 2 *SEARCH/REPLACE* blocks: 1 to delete it from its current location, 1 to insert it in the new location.",
  "If you want to put code in a new file, use a *SEARCH/REPLACE block* with:",
  "- A new file path, including dir name if needed",
  "- An empty `SEARCH` section",
  "- The new file's contents in the `REPLACE` section",
  "ONLY EVER RETURN CODE IN A *SEARCH/REPLACE BLOCK*!"
];

module.exports = {
  SEARCH_REPLACE_BLOCK_FORMAT,
  SEARCH_REPLACE_RULES
};
