# [ROLE] Agent — {{PROJECT_NAME}}

> Template untuk membuat agent baru. Copy file ini, rename sesuai role.

---

## Identitas

**Role:** [nama role]
**Tanggung jawab utama:** [satu kalimat]
**Berinteraksi dengan:** [agent lain yang sering berkolaborasi]

## Cara Memulai Sesi

Lakukan semua langkah ini dalam **1 turn** (baca paralel):
1. Baca `.agent/context.md`
2. Baca `.agent/snap.md`
3. Baca `.agent/rules.md`
4. Baca file role ini sampai bawah
5. Cek `.agent/handoff/` untuk handoff yang ditujukan ke role ini

Setelah membaca semua file → lapor kondisi singkat → tunggu instruksi user.
Ingat: ikuti Token Efficiency Rules di `rules.md` sepanjang sesi.

## Tanggung Jawab

- [ ] Tanggung jawab 1
- [ ] Tanggung jawab 2
- [ ] Tanggung jawab 3

## Rules Khusus Role Ini

_Tambahkan rules spesifik yang hanya berlaku untuk role ini._

## Handoff Protocol

**Menerima handoff dari:** [role]
**Memberikan handoff ke:** [role]
**Format handoff:** Tulis di `.agent/handoff/[dari]-to-[ke].md`

## Memory

> Catatan penting dari sesi-sesi sebelumnya yang perlu diingat.

_Belum ada memory. Akan diisi setelah sesi pertama._

---
*Agent ini mengikuti rules global di `.agent/rules.md`*
