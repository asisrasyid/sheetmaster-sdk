# Rules Global — {{PROJECT_NAME}}

> Berlaku untuk SEMUA agent tanpa pengecualian.

---

## Wajib Dilakukan

- Baca `context.md` dan file role kamu sebelum mulai kerja
- Update `log.md` setelah setiap sesi dengan ringkasan apa yang dikerjakan
- Update `snap.md` setiap kali ada perubahan status task
- Tulis handoff note di `handoff/` sebelum menyerahkan pekerjaan ke agent lain
- Jika membuat keputusan arsitektur, catat di `decisions.md` format ADR
- Semua task yang dikerjakan harus terhubung ke SheetMaster board

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

---

## Token Efficiency Rules

> Aturan ini wajib diterapkan di setiap sesi untuk menjaga efisiensi biaya.
> Token di Claude Code bersifat kumulatif — makin panjang sesi, makin mahal tiap turn berikutnya.

### 1. Baca File Sekali, Tidak Lebih

- Setiap file hanya dibaca **sekali per sesi** — simpan informasinya di memory kerja
- Dilarang re-read file yang sudah dibaca di turn sebelumnya dalam sesi yang sama
- Jika perlu referensi ulang, gunakan ingatan dari bacaan pertama — bukan baca ulang

### 2. Batch Tool Calls

- Semua file yang perlu dibaca di awal sesi → baca dalam **satu turn sekaligus** (paralel)
- Jangan baca file satu per satu secara berurutan jika tidak ada dependensi
- Contoh benar: baca `context.md` + `snap.md` + `agents/[role].md` dalam 1 turn
- Contoh salah: baca `context.md` → tunggu → baca `snap.md` → tunggu → baca role

### 3. Stop Segera Setelah Selesai

- Setelah task selesai: update snap.md + tulis log + lapor ke user → **stop**
- Dilarang menambahkan penjelasan panjang, ringkasan ulang, atau komentar tambahan setelah laporan
- Format laporan akhir maksimal 5 baris:
  ```
  [DONE] Nama task
  Apa yang dikerjakan: 1 kalimat
  Hasil: 1 kalimat
  Status SheetMaster: dipindah ke [kolom]
  Task berikutnya: [nama] atau "tunggu instruksi"
  ```

### 4. Output Ringkas — Detail Hanya Kalau Diminta

- Default output: ringkasan singkat, actionable
- Jangan jelaskan proses yang sudah jelas — langsung hasil
- Jika user butuh detail, mereka akan minta — jangan anticipate dengan verbose output
- Kode: tampilkan hanya bagian yang berubah, bukan seluruh file

### 5. Model Routing — Gunakan Model Sekecil yang Cukup

```
HAIKU  → operasi rutin:
         - baca dan parse task dari SheetMaster
         - update status, move task, centang subtask
         - update snap.md dan log.md
         - generate subtask checklist untuk task baru
         - ekstrak intent dari pesan user yang jelas

SONNET → reasoning kompleks:
         - keputusan arsitektur
         - debugging yang butuh analisis dalam
         - review code dengan banyak konteks
         - task yang ambigu dan butuh interpretasi

OPUS   → jangan digunakan kecuali ada kebutuhan sangat spesifik
         dan user secara eksplisit memintanya
```

### 6. Jaga Sesi Tetap Pendek dan Focused

- 1 sesi = 1 task atau 1 topik diskusi yang jelas
- Jika task membutuhkan lebih dari 8 turn — pertanda task terlalu besar, pecah dulu
- Mulai sesi baru untuk task baru — jangan lanjutkan sesi panjang yang sudah berat
- Target: selesaikan task dalam 4-6 turn

### Estimasi Efisiensi

| Kondisi | Token per sesi | Biaya per sesi |
|---------|---------------|----------------|
| Tanpa rules (baseline) | ~170,000 | ~$1.53 |
| Dengan rules 1-4 | ~27,000 | ~$0.24 |
| + Model routing (rule 5) | ~27,000 | ~$0.12 |
| **Total penghematan** | **84%** | **~92%** |
