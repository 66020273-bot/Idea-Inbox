# User Flow: Mobile Capture

1. **Launch**: User taps the "Idea Inbox" icon on their home screen.
2. **Focus**: The app opens instantly. The keyboard slides up automatically as the text area is focused.
3. **Type**: User jots down a fleeting thought (e.g., "Remember to check out the new D3.js release for the dashboard project").
4. **Auto-Save**: As they type, the text is mirrored to `localStorage`.
5. **Send**: User taps the "Send" button.
    - A loading state appears briefly.
    - Gemini processes the text in the background to suggest a title: `2024-05-20-D3-Dashboard-Research.md`.
6. **Confirmation**: A "Success" toast appears. The text area clears, ready for the next idea.
7. **Export (Later)**: When the user is ready to move notes to Obsidian:
    - They navigate to the "Inbox" tab.
    - They tap "Export All to Vault" (choosing between individual files or a **ZIP archive**).
    - The iOS share/save sheet appears.
    - They select their Obsidian folder.
    - The app prompts to "Clear Inbox" after successful save.
