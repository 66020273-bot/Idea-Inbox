# Idea Inbox MVP Roadmap

## Project Overview
A minimalist Progressive Web Application (PWA) designed for high-speed capture of fleeting thoughts and ideas on mobile devices, with the ultimate goal of syncing them into an Obsidian vault.

## Phase 1: Core Capture (The "Inbox")
- [ ] **UI/UX Implementation**: 
    - Apply "Clean Utility" design (Recipe 8).
    - Auto-focus text area on load.
    - Large, accessible "Send" button.
- [ ] **Local Persistence**:
    - Use `localStorage` for draft persistence (prevent data loss on refresh/crash).
    - Implement an offline buffer to queue notes when signal is poor.
- [ ] **Backend Foundation**:
    - Express server with SQLite (`better-sqlite3`) to store the "Inbox" queue.
    - Basic API routes for saving and retrieving notes.

## Phase 2: Intelligence & Organization
- [ ] **Gemini Integration**:
    - Auto-generate concise filenames based on content.
    - Smart tagging (extracting `#tags` from text).
    - Markdown formatting (wrapping notes in YAML frontmatter).
- [ ] **PWA Manifest**:
    - Add `manifest.json` and service worker for "Add to Home Screen" support.

## Phase 3: The Obsidian Bridge
- [ ] **Export to Files**:
    - Implement a "Download as Markdown" feature for individual notes.
    - Implement a **"Download as ZIP"** feature for bulk export of the entire inbox.
    - Both trigger the iOS "Save to Files" dialog.
- [ ] **Web Share API**:
    - Add a "Share to Obsidian" option using the native share sheet.

## Phase 4: Advanced Sync (Future)
- [ ] **GitHub Integration**: Automatic sync for users with Git-backed vaults.
- [ ] **Obsidian URI Support**: Deep-linking to open/create notes directly in the Obsidian app.

## Success Metrics
- Time from app open to "Send" should be under 10 seconds.
- Zero data loss for captured notes.
