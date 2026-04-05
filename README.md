# sheetmaster-sdk

TypeScript SDK untuk [SheetMaster](https://github.com/asisrasyid/SheetMaster) — task management app berbasis Google Apps Script + Google Spreadsheet.

Satu install untuk dua hal:
1. **API Client** — baca dan tulis task SheetMaster dari kode TypeScript/JavaScript
2. **Agent Scaffold** — buat workspace `.agent/` untuk tim AI agent di project manapun

---

## Prasyarat

Sebelum menggunakan SDK ini, kamu perlu memiliki SheetMaster yang sudah berjalan.

### 1. Setup Google Spreadsheet

Buat Google Spreadsheet baru. Spreadsheet ini akan menjadi database SheetMaster kamu.
Catat Spreadsheet ID dari URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`

### 2. Deploy SheetMaster ke Google Apps Script

1. Buka [script.google.com](https://script.google.com) dan buat project baru
2. Copy source code SheetMaster ke editor Apps Script
3. Di file konfigurasi, isi `SPREADSHEET_ID` dengan ID spreadsheet kamu
4. Klik **Deploy > New deployment**
5. Pilih type: **Web App**
6. Execute as: **Me**
7. Who has access: **Anyone**
8. Klik **Deploy** dan copy URL deployment

URL deployment akan berbentuk:
```
https://script.google.com/macros/s/[SCRIPT_ID]/exec
```

### 3. Generate API Key

1. Buka SheetMaster di browser (gunakan URL deployment di atas)
2. Masuk ke **Profile → API Keys → Generate**
3. Copy API key yang dihasilkan (format: `sm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

---

## Instalasi

```bash
# Install dari GitHub
npm install github:asisrasyid/sheetmaster-sdk
```

---

## Penggunaan: API Client

```typescript
import { SheetMasterClient } from 'sheetmaster-sdk';

const sm = new SheetMasterClient({
  apiKey: process.env.SHEETMASTER_KEY!,
  baseUrl: process.env.SHEETMASTER_URL!,
});
```

Simpan kredensial di `.env`:
```
SHEETMASTER_KEY=sm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHEETMASTER_URL=https://script.google.com/macros/s/[SCRIPT_ID]/exec
```

### Contoh Penggunaan

```typescript
// Ambil semua board
const boards = await sm.getBoards();

// Ambil detail board (kolom + task + member + label)
const detail = await sm.getBoard('board_id');

// Buat board baru + hapus kolom default bawaan
const board = await sm.createBoard('Project Baru', 'Deskripsi project');
await sm.clearDefaultColumns(board.id); // hapus To Do/In Progress/Review/Done default

// Buat kolom custom
const todo     = await sm.createColumn(board.id, 'Backlog', '#94a3b8');
const doing    = await sm.createColumn(board.id, 'Development', '#3b82f6');
const done     = await sm.createColumn(board.id, 'Done', '#22c55e');

// Buat task
const task = await sm.createTask(board.id, todo.id, 'Judul Task', {
  priority: 'high',
  description: 'Deskripsi lengkap task ini',
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

## Penggunaan: Agent Scaffold

Buat workspace `.agent/` di project manapun dengan satu perintah:

```bash
npx sheetmaster-sdk init
```

Perintah ini akan menanyakan:
- Nama project
- Deskripsi singkat
- Tech stack
- SheetMaster Board ID (opsional, bisa diisi belakangan)

Lalu membuat struktur berikut:

```
.agent/
├── context.md        ← entry point — overview project, stack, tujuan
├── rules.md          ← rules global semua agent
├── snap.md           ← status project terkini
├── log.md            ← history diskusi dan keputusan
├── decisions.md      ← architectural decision records (ADR)
├── agents/
│   ├── _template.md  ← template untuk membuat agent baru
│   ├── pm.md         ← Project Manager
│   ├── frontend.md   ← Frontend Engineer
│   ├── backend.md    ← Backend Engineer
│   ├── design.md     ← UI/UX Designer
│   ├── qa.md         ← Quality Assurance
│   └── devil.md      ← Devil's Advocate
└── handoff/
    ├── pm-to-fe.md
    ├── pm-to-be.md
    ├── design-to-fe.md
    ├── fe-to-qa.md
    └── be-to-qa.md
```

### Cara Pakai Agent Workspace

Setiap kali memanggil agent untuk mengerjakan task di project, awali dengan:

```
"Baca .agent/context.md dan .agent/agents/[role].md dulu sebelum mulai."
```

Agent akan memahami:
- Apa project ini dan apa tujuannya
- Apa tech stack yang digunakan
- Apa status task saat ini (dari snap.md)
- Apa keputusan yang sudah dibuat (dari decisions.md)
- Apa yang diharapkan dari role mereka

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

Ketika satu agent selesai dan menyerahkan ke agent lain:

1. Agent yang menyerahkan menulis catatan di file `handoff/[dari]-to-[ke].md`
2. Agent penerima membaca file handoff sebelum mulai kerja
3. Catat di `log.md` dengan tag `[HANDOFF]`

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

## License

MIT © [asisrasyid](https://github.com/asisrasyid)
