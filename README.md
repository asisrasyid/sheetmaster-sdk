# sheetmaster-sdk

TypeScript SDK untuk [SheetMaster](https://github.com/asisrasyid/SheetMaster) — task management berbasis Google Apps Script + Google Spreadsheet.

**Satu install, dua fungsi:**
- **API Client** — baca dan tulis task SheetMaster dari TypeScript/JavaScript
- **Agent Scaffold** — setup workspace AI agent siap pakai di project manapun

---

## Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Instalasi](#instalasi)
3. [Agent Scaffold](#agent-scaffold) ← mulai dari sini
4. [API Client](#api-client)
5. [Token Efficiency](#token-efficiency)
6. [API Reference](#api-reference)

---

## Prasyarat

SDK ini terhubung ke SheetMaster yang sudah di-deploy. Jika belum punya, ikuti langkah berikut:

### 1. Buat Google Spreadsheet

Buat Spreadsheet baru di Google Drive. Catat **Spreadsheet ID** dari URL:
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

### 2. Deploy SheetMaster ke Google Apps Script

1. Buka [script.google.com](https://script.google.com) → buat project baru
2. Copy source code [SheetMaster](https://github.com/asisrasyid/SheetMaster) ke editor
3. Isi `SPREADSHEET_ID` di file konfigurasi
4. **Deploy → New deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy URL deployment — berbentuk:
   ```
   https://script.google.com/macros/s/[SCRIPT_ID]/exec
   ```

### 3. Generate API Key

Buka SheetMaster di browser → **Profile → API Keys → Generate**

Format API key: `sm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Instalasi

```bash
npm install github:asisrasyid/sheetmaster-sdk
```

---

## Agent Scaffold

Fitur utama SDK ini: setup workspace AI agent di project manapun dengan **satu perintah**.

### Cara Setup

```bash
npx sheetmaster-sdk init
```

Isi 5 pertanyaan yang muncul:

```
Nama project:        My Project
Deskripsi singkat:   Aplikasi e-commerce berbasis Next.js
Tech stack:          Next.js, TypeScript, PostgreSQL
SheetMaster API Key: sm_xxxx (dari Profile → API Keys)
SheetMaster URL:     https://script.google.com/macros/s/.../exec
```

### Hasil

**`.sheetmaster.json`** — kredensial lokal, otomatis masuk `.gitignore`:
```json
{
  "apiKey": "sm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "baseUrl": "https://script.google.com/macros/s/[SCRIPT_ID]/exec"
}
```

**`.agent/`** — workspace AI agent lengkap:
```
.agent/
├── context.md        ← entry point wajib dibaca agent setiap sesi
├── rules.md          ← rules global + token efficiency rules
├── snap.md           ← status task terkini
├── log.md            ← history diskusi dan keputusan
├── decisions.md      ← architectural decision records (ADR)
├── task-api.md       ← referensi lengkap SheetMaster API
├── agents/
│   ├── _template.md  ← template untuk role baru
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

### Mulai Kerja dengan Agent

Setelah init selesai, **satu prompt** ke Claude sudah cukup:

```
Baca .agent/context.md. Cek task yang tersedia. Laporkan.
```

Claude akan otomatis:
1. Baca kredensial dari `.sheetmaster.json`
2. Hit SheetMaster API — ambil semua board dan task
3. Tampilkan task per kolom
4. Update `.agent/snap.md`
5. Tanya kamu: task mana yang ingin dikerjakan

### Standard Commands

| Kamu bilang | Yang dilakukan agent |
|-------------|----------------------|
| `"cek task"` | Ambil task dari SheetMaster → tampilkan per kolom → update snap.md |
| `"kerjakan task [X]"` | Baca role → kerjakan → move task → update snap + log |
| `"task selesai"` | Move ke Done → centang subtask → tulis `[DONE]` di log |
| `"buat task baru [judul]"` | Buat task di SheetMaster + subtask checklist → update snap |

### Flow Kerja

```
AGENT → punya ROLE (agents/*.md)
         punya TASK (dari SheetMaster)

1. Cek task → diskusi dengan user → pilih task
2. Assign ke agent sesuai role
3. Agent kerjakan sampai selesai
4. Tandai done → lanjut task berikutnya
```

> **Pemilihan task selalu melalui diskusi** — agent tidak memilih sendiri.

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

1. Agent yang selesai tulis catatan di `handoff/[dari]-to-[ke].md`
2. Agent penerima baca file handoff sebelum mulai kerja
3. Catat di `log.md` dengan tag `[HANDOFF]`

---

## API Client

Gunakan `SheetMasterClient` untuk hit SheetMaster API langsung dari kode:

```typescript
import { SheetMasterClient } from 'sheetmaster-sdk';

const sm = new SheetMasterClient({
  apiKey: process.env.SHEETMASTER_KEY!,
  baseUrl: process.env.SHEETMASTER_URL!,
});
```

Simpan di `.env`:
```env
SHEETMASTER_KEY=sm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHEETMASTER_URL=https://script.google.com/macros/s/[SCRIPT_ID]/exec
```

### Contoh Penggunaan

```typescript
// Ambil semua board
const boards = await sm.getBoards();

// Ambil detail board — kolom, task, member, label
const detail = await sm.getBoard('board_id');

// Buat board baru
// Catatan: SheetMaster auto-buat 4 kolom default (To Do/In Progress/Review/Done)
// Gunakan clearDefaultColumns() jika ingin kolom custom
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

## Token Efficiency

Setiap project yang di-scaffold dengan SDK ini sudah include **Token Efficiency Rules** di `.agent/rules.md`. Rules ini dirancang untuk mengurangi konsumsi token Claude secara signifikan.

### Prinsip Utama

| Rule | Penjelasan |
|------|------------|
| **Baca sekali** | Setiap file hanya dibaca sekali per sesi — tidak re-read |
| **Batch tool calls** | Baca semua file yang dibutuhkan dalam 1 turn paralel |
| **Stop segera** | Setelah task selesai, langsung stop — tidak tambah penjelasan |
| **Output ringkas** | Default: ringkasan singkat. Detail hanya kalau diminta |
| **Model routing** | Haiku untuk operasi rutin, Sonnet untuk reasoning kompleks |
| **Sesi pendek** | 1 sesi = 1 task. Target selesai dalam 4–6 turn |

### Model Routing

```
HAIKU  → operasi rutin (update status, move task, buat task, update snap/log)
SONNET → reasoning kompleks (arsitektur, debugging, fitur ambigu)
OPUS   → tidak disarankan kecuali ada kebutuhan spesifik
```

### Estimasi Penghematan

| Kondisi | Token/sesi | Biaya/sesi |
|---------|-----------|------------|
| Tanpa rules | ~170,000 | ~$1.53 |
| Dengan rules | ~27,000 | ~$0.24 |
| + Model routing (Haiku) | ~27,000 | ~$0.12 |
| **Total penghematan** | **84%** | **~92%** |

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

### CreateTaskOptions

```typescript
interface CreateTaskOptions {
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  description?: string;
  deadline?: string; // format: YYYY-MM-DD
}
```

---

## Related Projects

- [SheetMaster](https://github.com/asisrasyid/SheetMaster) — Task management backend (Google Apps Script + Sheets)
- [tg-task-bot](https://github.com/asisrasyid/tg-task-bot) — Telegram bot untuk buat task via chat

---

## License

MIT © [asisrasyid](https://github.com/asisrasyid)
