# SheetMaster API Reference

> Semua credentials ada di `.sheetmaster.json`. Baca file itu sebelum hit API.

---

## Request Format

```
POST {baseUrl}
Content-Type: text/plain
Body: JSON string
```

Semua request menggunakan format yang sama:
```json
{
  "apiKey": "...",
  "action": "nama_action",
  ...params
}
```

Response selalu:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "pesan error" }
```

---

## Actions

### getBoards
Ambil semua board yang dimiliki user. Gunakan ini PERTAMA untuk menemukan boardId.

```json
{ "apiKey": "...", "action": "getBoards" }
```
Response: array of `{ id, name, description, myRole }`

---

### getBoard
Ambil detail board: kolom, task, member, label.

```json
{ "apiKey": "...", "action": "getBoard", "boardId": "..." }
```
Response: `{ board, columns[], tasks[], members[], labels[] }`

> Task berada di `data.tasks`. Setiap task punya `columnId` untuk mengetahui posisinya.

---

### createBoard
```json
{ "apiKey": "...", "action": "createBoard", "name": "...", "description": "..." }
```

---

### deleteBoard
```json
{ "apiKey": "...", "action": "deleteBoard", "boardId": "..." }
```

---

### createColumn
```json
{ "apiKey": "...", "action": "createColumn", "boardId": "...", "name": "...", "color": "#hex" }
```

---

### deleteColumn
```json
{ "apiKey": "...", "action": "deleteColumn", "columnId": "..." }
```

---

### createTask
```json
{
  "apiKey": "...",
  "action": "createTask",
  "boardId": "...",
  "columnId": "...",
  "title": "...",
  "priority": "low|medium|high|urgent"
}
```

---

### updateTask
Hanya sertakan field yang ingin diubah.

```json
{
  "apiKey": "...",
  "action": "updateTask",
  "taskId": "...",
  "title": "...",
  "description": "...",
  "priority": "...",
  "deadline": "YYYY-MM-DD"
}
```

---

### moveTask
Pindahkan task ke kolom lain.

```json
{
  "apiKey": "...",
  "action": "moveTask",
  "taskId": "...",
  "toColumnId": "...",
  "position": 0
}
```

---

### deleteTask
```json
{ "apiKey": "...", "action": "deleteTask", "taskId": "..." }
```

---

### createSubTask
```json
{ "apiKey": "...", "action": "createSubTask", "taskId": "...", "title": "..." }
```

---

### updateSubTask
```json
{ "apiKey": "...", "action": "updateSubTask", "subTaskId": "...", "isCompleted": true }
```

---

### deleteSubTask
```json
{ "apiKey": "...", "action": "deleteSubTask", "subTaskId": "..." }
```

---

### createLabel
```json
{ "apiKey": "...", "action": "createLabel", "boardId": "...", "name": "...", "color": "#hex" }
```

---

### addTaskLabel
```json
{ "apiKey": "...", "action": "addTaskLabel", "taskId": "...", "labelId": "..." }
```

---

### removeTaskLabel
```json
{ "apiKey": "...", "action": "removeTaskLabel", "taskId": "...", "labelId": "..." }
```

---

## Priority Values
`low` | `medium` | `high` | `urgent`

## Role Values
`owner` | `approver` | `contributor` | `viewer`
