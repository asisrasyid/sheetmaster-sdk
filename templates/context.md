# Project Context — {{PROJECT_NAME}}

> File ini adalah entry point utama. WAJIB dibaca setiap agent sebelum melakukan apapun.
> Berisi gambaran lengkap project: tujuan, stack, status, dan siapa yang terlibat.

---

## Overview

**Nama Project:** {{PROJECT_NAME}}
**Deskripsi:** {{PROJECT_DESC}}
**Dibuat:** {{DATE}}
**Status:** Active

## Tech Stack

{{TECH_STACK}}

## Tujuan Project

_Jelaskan tujuan utama project ini. Apa masalah yang diselesaikan? Siapa penggunanya?_

## SheetMaster Board

**Board ID:** `{{BOARD_ID}}`

Semua task project ini dikelola di SheetMaster.
Install SDK: `npm install github:asisrasyid/sheetmaster-sdk`

## Struktur Folder `.agent/`

```
.agent/
├── context.md       ← kamu sedang baca ini
├── rules.md         ← rules global semua agent
├── snap.md          ← status project terkini
├── log.md           ← history diskusi dan keputusan
├── decisions.md     ← architectural decisions (ADR)
├── agents/          ← definisi peran dan memory tiap agent
└── handoff/         ← catatan serah terima antar agent
```

## Cara Mulai (untuk Agent Baru)

1. Baca `context.md` ini sampai selesai
2. Baca `rules.md` — pahami aturan global
3. Baca `snap.md` — pahami kondisi project saat ini
4. Baca file role kamu di `agents/[role].md`
5. Cek `handoff/` jika ada serah terima untukmu
6. Baru mulai bekerja
