# Windows setup notes

This workspace is primarily Markdown/configuration and does not need Node.js
to run. Use Git Bash or PowerShell.

1. Install Git for Windows and Claude Code using the current official instructions.
2. Extract this ZIP to a development folder.
3. Open the extracted folder in VS Code.
4. Open a terminal in the folder and run `git init`.
5. Review `.claude/settings.json` and `CLAUDE.md`.
6. Start `claude` and verify the project instructions are loaded.
7. Clone BookCars into a separate sibling folder for the read-only audit.

Do not change PowerShell execution policy globally just to run a project script.
If a command is blocked, use the official installation instructions or Git Bash.

Official Claude Code docs: https://code.claude.com/docs/
