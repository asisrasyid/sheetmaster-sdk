# sheetmaster-sdk

TypeScript SDK untuk [SheetMaster](https://github.com/asisrasyid/SheetMaster) — task management app berbasis Google Apps Script + Google Spreadsheet.

Satu install untuk dua hal:
1. **API Client** — baca dan tulis task SheetMaster dari kode TypeScript/JavaScript
2. **Agent Scaffold** — setup workspace `.agent/` + config kredensial untuk tim AI agent di project manapun

---

## Prasyarat

Sebelum menggunakan SDK ini, kamu perlu memiliki SheetMaster yang sudah berjalan.

### 1. Setup Google Spreadsheet

Buat Google Spreadsheet baru. Catat Spreadsheet ID dari URL:
`https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`

### 2. Deploy SheetMaster ke Google Apps Script

1. Buka [script.google.com](https://script.google.com) dan buat project baru
2. Copy source code SheetMaster ke editor Apps Script
3. Isi `SPREADSHEET_ID` di file konfigurasi
4. Klik **Deploy > New deployment**
5. Pilih type: **Web App**, Execute as: **Me**, Who has access: **Anyone**
6. Klik **Deploy** dan copy URL deployment

URL deployment berbentuk:
```
https://script.google.com/macros/s/[SCRIPT_ID]/exec
```

### 3. Generate API Key

1. Buka SheetMaster di browser
2. Masuk ke **Profile → API Keys → Generate**
3. Copy API key (format: `sm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

---

## Instalasi

```bash
npm install github:asisrasyid/sheetmaster-sdk
```

---

## Penggunaan: Agent Scaffold

Setup workspace AI agent di project manapun dengan satu perintah:

```bash
npx sheetmaster-sdk init
```

Perintah ini akan menanyakan:
- Nama project
- Deskripsi singkat
- Tech stack
- SheetMaster Board ID
- SheetMaster API Key
- SheetMaster URL

Lalu membuat:

**`.sheetmaster.json`** — file kredensial lokal (otomatis masuk `.gitignore`):
```json
{
  "apiKey": "sm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "baseUrl": "https://script.google.com/macros/s/[SCRIPT_ID]/exec",
  "boardId": "your-board-id"
}
```

**`.agent/`** — workspace AI agent:
```
.agent/
├── context.md        ← entry point — overview, stack, kredensial, standard commands
├── rules.md          ← rules global semua agent
├── snap.md           ← status task terkini
├── log.md            ← history diskusi dan keputusan
├── decisions.md      ← architectural decision records (ADR)
├── agents/
│   ├── _template.md
│   ├── pm.md
│   ├── frontend.md
│   ├── backend.md
│   ├── design.md
│   ├── qa.md
│   └── devil.md
└── handoff/
    ├── pm-to-fe.md
    ├── pm-to-be.md
    ├── design-to-fe.md
    ├── fe-to-qa.md
    └── be-to-qa.md
```

### Cara Pakai

Setelah init selesai, cukup satu perintah ke Claude:

```
Baca .agent/context.md. Cek task yang tersedia. Laporkan.
```

Claude akan otomatis:
- Baca kredensial dari `.sheetmaster.json`
- Hit SheetMaster API untuk mengambil semua task
- Tampilkan task per kolom
- Update `.agent/snap.md`

### Standard Commands yang Dipahami Agent

| Perintah | Yang Dilakukan Agent |
|----------|----------------------|
| `"cek task"` | Baca `.sheetmaster.json` → hit API → tampilkan task per kolom → update snap.md |
| `"kerjakan task [X]"` | Baca role di `agents/[role].md` → kerjakan → move task → update snap + log |
| `"task selesai"` | Move task ke kolom Done → update snap.md → tulis `[DONE]` di log.md |
| `"buat task baru [judul]"` | Hit createTask API → tambah subtask checklist → update snap.md |

### Agent Roles

| Agent | File | Tanggung Jawab |
|-------|------|----------------|
| **PM** | `agents/pm.md` | Koordinasi, task management, review progress |
| **Frontend** | `agents/frontend.md` | UI, komponen, responsivitas |
| **Backend** | `agents/backend.md` | API, database, business logic |
| **Design** | `agents/design.md` | Design system, wireframe, handoff |
| **QA** | `agents/qa.md` | Testing, bug report, approval |
| **Devil's Advocate** | `agents/devil.md` | Tantang keputusan, cegah kesalahan arsitektur |

### Handoff Protocol

1. Agent yang selesai tulis catatan di `handoff/[dari]-to-[ke].md`
2. Agent penerima baca file handoff sebelum mulai
3. Catat di `log.md` dengan tag `[HANDOFF]`

---

## Penggunaan: API Client

```typescript
import { SheetMasterClient } from 'sheetmaster-sdk';

const sm = new SheetMasterClient({
  apiKey: process.env.SHEETMASTER_KEY!,
  baseUrl: process.env.SHEETMASTER_URL!,
});
```

### Contoh Penggunaan

```typescript
// Ambil semua board
const boards = await sm.getBoards();

// Ambil detail board (kolom + task + member + label)
const detail = await sm.getBoard('board_id');

// Buat board baru + hapus kolom default bawaan
const board = await sm.createBoard('Project Baru', 'Deskripsi project');
await sm.clearDefaultColumns(board.id);

// Buat kolom custom
const backlog = await sm.createColumn(board.id, 'Backlog', '#94a3b8');
const dev     = await sm.createColumn(board.id, 'Development', '#3b82f6');
const done    = await sm.createColumn(board.id, 'Done', '#22c55e');

// Buat task
const task = await sm.createTask(board.id, backlog.id, 'Judul Task', {
  priority: 'high',
  description: 'Deskripsi lengkap task ini',
  deadline: '2026-12-31',
});

// Tambah banyak subtask sekaligus
await sm.createSubTasks(task.id, [
  'Langkah 1: setup project',
  'Langkah 2: implementasi fitur',
  'Langkah 3: testing',
]);

// Pindahkan task ke kolom lain
await sm.moveTask(task.id, done.id);

// Buat label dan pasangkan ke task
const label = await sm.createLabel(board.id, 'Bug', '#ef4444');
await sm.addTaskLabel(task.id, label.id);

// Update task
await sm.updateTask(task.id, {
  title: 'Judul yang diperbarui',
  priority: 'urgent',
  deadline: '2026-12-31',
});

// Tandai subtask selesai
await sm.updateSubTask('subtask_id', { isCompleted: true });
```

---

## API Reference

### Boards
| Method | Keterangan |
|--------|------------|
| `getBoards()` | Ambil semua board |
| `getBoard(boardId)` | Detail board: kolom, task, member, label |
| `createBoard(name, description?)` | Buat board baru |
| `deleteBoard(boardId)` | Hapus board (owner only) |

### Columns
| Method | Keterangan |
|--------|------------|
| `createColumn(boardId, name, color?)` | Buat kolom baru |
| `deleteColumn(columnId)` | Hapus kolom |
| `clearDefaultColumns(boardId)` | Hapus semua kolom default dari board baru |

### Tasks
| Method | Keterangan |
|--------|------------|
| `createTask(boardId, columnId, title, options?)` | Buat task |
| `updateTask(taskId, fields)` | Update field task |
| `moveTask(taskId, toColumnId, position?)` | Pindah kolom |
| `deleteTask(taskId)` | Hapus task |

### Subtasks
| Method | Keterangan |
|--------|------------|
| `createSubTask(taskId, title)` | Tambah satu subtask |
| `createSubTasks(taskId, titles[])` | Tambah banyak subtask sekaligus |
| `updateSubTask(subTaskId, fields)` | Update judul atau status selesai |
| `deleteSubTask(subTaskId)` | Hapus subtask |

### Labels
| Method | Keterangan |
|--------|------------|
| `createLabel(boardId, name, color)` | Buat label |
| `addTaskLabel(taskId, labelId)` | Pasang label ke task |
| `removeTaskLabel(taskId, labelId)` | Lepas label dari task |

### Assignees
| Method | Keterangan |
|--------|------------|
| `addAssignee(taskId, userId)` | Tambah assignee |
| `removeAssignee(taskId, userId)` | Hapus assignee |

### Priority Values
`'low'` | `'medium'` | `'high'` | `'urgent'`

---

## Related Projects

- [SheetMaster](https://github.com/asisrasyid/SheetMaster) — Task management backend (Google Apps Script + Sheets)
- [tg-task-bot](https://github.com/asisrasyid/tg-task-bot) — Telegram bot untuk buat task via chat

---

## License

MIT © [asisrasyid](https://github.com/asisrasyid)
