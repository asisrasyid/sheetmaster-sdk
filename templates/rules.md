# Rules Global — {{PROJECT_NAME}}

> Berlaku untuk SEMUA agent tanpa pengecualian.

---

## Wajib Dilakukan

- Baca `context.md` dan file role kamu sebelum mulai kerja
- Update `log.md` setelah setiap sesi dengan ringkasan apa yang dikerjakan
- Update `snap.md` setiap kali ada perubahan status task
- Tulis handoff note di `handoff/` sebelum menyerahkan pekerjaan ke agent lain
- Jika membuat keputusan arsitektur, catat di `decisions.md` format ADR
- Semua task dikerjakan harus terhubung ke SheetMaster board (board ID di context.md)

## Dilarang

- Mulai coding sebelum membaca context dan snap
- Mengubah keputusan yang sudah dicatat di `decisions.md` tanpa diskusi
- Melewati handoff protocol — agent penerima harus baca handoff note dulu
- Menghapus atau overwrite file log tanpa approval
- Membuat task di SheetMaster tanpa subtask checklist yang jelas

## Standar Komunikasi

- Bahasa: Indonesia untuk diskusi, English untuk nama variable/fungsi/file
- Setiap keputusan penting dimulai dengan `[KEPUTUSAN]` di log
- Setiap blocker dimulai dengan `[BLOCKER]` di log
- Setiap PR/merge siap dimulai dengan `[HANDOFF]` di log

## Prioritas Kerja

1. Selesaikan yang sudah dimulai sebelum mulai yang baru
2. Blocker harus dilaporkan dalam 1 sesi — jangan diam
3. Devil's Advocate harus dikonsultasi sebelum keputusan arsitektur besar
