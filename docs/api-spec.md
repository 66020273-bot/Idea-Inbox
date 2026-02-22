# API Specification

## Base URL
`/api`

## Endpoints

### 1. Save Note
`POST /api/notes`
- **Body**: 
  ```json
  {
    "content": "string",
    "title": "string (optional)",
    "tags": ["string"]
  }
  ```
- **Response**: `201 Created` with the saved note object.

### 2. List Inbox
`GET /api/notes`
- **Description**: Returns all notes currently in the "Inbox" queue.
- **Response**: `200 OK` with an array of notes.

### 3. Delete/Clear Note
`DELETE /api/notes/:id`
- **Description**: Removes a note from the inbox (usually after successful export to Obsidian).
- **Response**: `204 No Content`.

### 4. Process Content (AI)
`POST /api/ai/process`
- **Description**: Sends raw text to Gemini to get a suggested title, tags, and formatted Markdown.
- **Body**: `{ "text": "string" }`
- **Response**: 
  ```json
  {
    "suggestedTitle": "string",
    "suggestedTags": ["string"],
    "formattedMarkdown": "string"
  }
  ```
