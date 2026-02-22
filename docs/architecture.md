# Architectural Decisions

## 1. Tech Stack
- **Frontend**: React 19 with Vite.
- **Styling**: Tailwind CSS 4.0.
- **Animations**: Motion (framer-motion).
- **Icons**: Lucide React.
- **Backend**: Node.js + Express.
- **Database**: SQLite (`better-sqlite3`) for a lightweight, file-based "Inbox" queue.
- **AI**: Google Gemini API (`@google/genai`) for content processing.

## 2. Mobile-First Persistence
To ensure no idea is lost, we use a multi-layered persistence strategy:
1. **Client-Side (Immediate)**: `localStorage` captures every keystroke.
2. **Server-Side (Queue)**: Notes are sent to the Express/SQLite backend.
3. **Local Storage (Final)**: Users export notes to their device's file system (Obsidian vault).

## 3. The iOS Sandbox Bypass
Since iOS Safari does not support the *File System Access API* for direct folder writing, we utilize two primary patterns:
- **Blob Download Pattern**: The app generates a `.md` file in memory and triggers a browser download.
- **ZIP Export Pattern**: For bulk transfers, the app bundles all inbox notes into a single `.zip` file. This is often more convenient than individual downloads, though slightly less seamless than a direct GitHub sync. On iOS, this triggers the "Save to Files" dialog where the user can save and then "Uncompress" the ZIP directly into their vault.

## 4. Design Philosophy (Recipe 8: Clean Utility)
- **Typography**: Inter (Sans) for UI, JetBrains Mono for data/previews.
- **Color Palette**: Zinc/Slate for a neutral, focused environment.
- **Interaction**: High-feedback buttons and subtle motion transitions to make the app feel "native."

## 5. Security
- Gemini API calls are handled on the frontend (per guidelines).
- Sensitive operations (like potential future GitHub sync) will be handled via the Express backend to protect secrets.
