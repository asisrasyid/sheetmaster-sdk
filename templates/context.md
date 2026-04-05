# Project Context — {{PROJECT_NAME}}

> File ini adalah entry point utama. WAJIB dibaca setiap agent sebelum melakukan apapun.

---

## Overview

**Nama Project:** {{PROJECT_NAME}}
**Deskripsi:** {{PROJECT_DESC}}
**Dibuat:** {{DATE}}
**Tech Stack:** {{TECH_STACK}}

---

## Kredensial SheetMaster

Semua kredensial ada di `.sheetmaster.json` di root project (tidak di-commit ke GitHub).

```json
{
  "apiKey":  "...",
  "baseUrl": "...",
  "boardId": "..."
}
```

Cara hit API SheetMaster:
- Method: POST ke `baseUrl`
- Header: `Content-Type: text/plain`
- Body JSON: `{ "apiKey": "...", "action": "...", ...params }`

---

## Standard Commands

Ketika user mengatakan **"cek task"** atau **"task apa yang tersedia"**:
1. Baca `.sheetmaster.json` untuk mendapatkan apiKey, baseUrl, boardId
2. Hit API: action `getBoard` dengan boardId
3. Tampilkan semua task per kolom beserta statusnya
4. Update `.agent/snap.md` dengan kondisi terkini

Ketika user mengatakan **"kerjakan task [X]"**:
1. Baca `.agent/agents/[role].md` sesuai task yang dikerjakan
2. Kerjakan task sampai selesai
3. Hit API: action `moveTask` untuk pindahkan task ke kolom berikutnya
4. Update `.agent/snap.md` dan tulis ringkasan di `.agent/log.md`

Ketika user mengatakan **"task selesai"** atau **"done"**:
1. Hit API: action `moveTask` — pindahkan task ke kolom `Done`
2. Update `.agent/snap.md`
3. Tulis di `.agent/log.md` dengan tag `[DONE]`

Ketika user mengatakan **"buat task baru [judul]"**:
1. Baca `.sheetmaster.json` untuk boardId
2. Hit API: action `createTask` di kolom yang sesuai
3. Tambahkan subtask checklist yang detail
4. Update `.agent/snap.md`

---

## Struktur `.agent/`

```
.agent/
├── context.md       ← kamu sedang baca ini
├── rules.md         ← rules global semua agent
├── snap.md          ← status task terkini
├── log.md           ← history diskusi dan keputusan
├── decisions.md     ← architectural decisions (ADR)
├── agents/          ← definisi peran tiap agent
└── handoff/         ← catatan serah terima antar agent
```

---

## Cara Mulai (untuk Agent Baru)

1. Baca `context.md` ini sampai selesai
2. Baca `rules.md`
3. Baca `snap.md` — pahami kondisi task saat ini
4. Baca `agents/[role].md` sesuai tugasmu
5. Mulai kerja
