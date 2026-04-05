# Context — {{PROJECT_NAME}}

> WAJIB dibaca penuh sebelum melakukan apapun.

---

## Project

**Nama:** {{PROJECT_NAME}}
**Deskripsi:** {{PROJECT_DESC}}
**Tech Stack:** {{TECH_STACK}}
**Dibuat:** {{DATE}}

---

## Inti Sistem Ini

```
AGENT  →  punya ROLE (agents/*.md)
           punya TASK (dari SheetMaster)
           
FLOW:
1. Ambil task dari SheetMaster
2. Diskusikan dengan user — board mana, task mana
3. Assign ke agent yang sesuai dengan role-nya
4. Kerjakan sampai selesai
5. Tandai done, lanjut task berikutnya
```

**Pemilihan task selalu melalui diskusi dengan user — agent tidak boleh memilih sendiri.**

---

## Kredensial

Baca `.sheetmaster.json` di root project:

```json
{
  "apiKey": "...",
  "baseUrl": "..."
}
```

Cara hit API — selalu POST ke `baseUrl`:
```
POST {baseUrl}
Content-Type: text/plain
Body: { "apiKey": "...", "action": "...", ...params }
```

Semua action tersedia di `.agent/task-api.md`.

---

## Langkah Wajib Saat Sesi Dimulai

```
1. Baca context.md ini (sudah kamu lakukan)
2. Baca rules.md
3. Baca snap.md — pahami kondisi task terakhir
4. Baca agents/[role].md sesuai tugasmu
5. Siap — tunggu instruksi user
```

**Jangan mulai kerja sebelum user memberikan instruksi eksplisit.**

---

## Cara Cek Task

Jika user berkata **"cek task"**, **"ada task apa"**, atau sejenisnya:

1. Baca `.sheetmaster.json` untuk `apiKey` dan `baseUrl`
2. Hit `getBoards` → tampilkan daftar board yang tersedia
3. Tanya user: board mana yang ingin dicek
4. Hit `getBoard` dengan boardId yang dipilih
5. Tampilkan task per kolom secara ringkas
6. Update `.agent/snap.md`

---

## Cara Kerjakan Task

Setelah user menentukan task mana yang dikerjakan:

1. Baca `agents/[role].md` sesuai jenis task
2. Kerjakan task sampai selesai — jangan berhenti di tengah untuk konfirmasi kecuali ada blocker nyata
3. Setelah selesai: hit `moveTask` ke kolom berikutnya
4. Tulis ringkasan di `log.md` dengan tag `[DONE]`
5. Update `snap.md`
6. Laporkan ke user: apa yang dikerjakan, apa hasilnya, task apa berikutnya

---

## Cara Tandai Task Selesai (Done)

1. Hit `moveTask` — pindahkan ke kolom `Done`
2. Centang semua subtask: hit `updateSubTask` dengan `isCompleted: true`
3. Tulis di `log.md`: `[DONE] nama task — tanggal`
4. Update `snap.md`

---

## Aturan Penting

- **Jangan tebak boardId atau columnId** — selalu ambil dari API (`getBoards` / `getBoard`)
- **Jangan pilih task sendiri** — pemilihan task adalah keputusan user
- **Jangan setengah-setengah** — kalau sudah mulai kerjakan task, selesaikan
- **Selalu update snap.md** setelah ada perubahan status task
- **Blocker wajib dilaporkan** — jangan diam jika ada yang tidak bisa diselesaikan

---

## File di `.agent/`

| File | Fungsi |
|------|--------|
| `context.md` | Kamu sedang baca ini — entry point |
| `rules.md` | Rules global semua agent |
| `snap.md` | Status task terkini |
| `log.md` | History diskusi dan keputusan |
| `decisions.md` | Architectural decisions (ADR) |
| `task-api.md` | Referensi lengkap semua SheetMaster API action |
| `agents/` | Definisi peran tiap agent |
| `handoff/` | Catatan serah terima antar agent |
