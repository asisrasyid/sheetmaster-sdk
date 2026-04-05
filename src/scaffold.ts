import fs from 'fs';
import path from 'path';
import readline from 'readline';

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyTemplate(src: string, dest: string, vars: Record<string, string>): void {
  if (!fs.existsSync(src)) return;
  let content = fs.readFileSync(src, 'utf-8');
  for (const [key, value] of Object.entries(vars)) {
    content = content.split(`{{${key}}}`).join(value);
  }
  fs.writeFileSync(dest, content, 'utf-8');
}

export async function scaffold(targetDir: string): Promise<void> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('\n=== SheetMaster SDK — Agent Context Setup ===\n');

  const projectName = await ask(rl, 'Nama project: ');
  const projectDesc = await ask(rl, 'Deskripsi singkat: ');
  const techStack  = await ask(rl, 'Tech stack (contoh: Next.js, Python, PostgreSQL): ');
  const boardId    = await ask(rl, 'SheetMaster Board ID (kosongkan jika belum ada): ');

  rl.close();

  const vars: Record<string, string> = {
    PROJECT_NAME: projectName,
    PROJECT_DESC: projectDesc,
    TECH_STACK:   techStack,
    BOARD_ID:     boardId || 'belum-dikonfigurasi',
    DATE:         new Date().toISOString().split('T')[0],
  };

  const agentDir   = path.join(targetDir, '.agent');
  const agentsDir  = path.join(agentDir, 'agents');
  const handoffDir = path.join(agentDir, 'handoff');

  ensureDir(agentDir);
  ensureDir(agentsDir);
  ensureDir(handoffDir);

  console.log('\nMembuat file context...');

  // Root files
  for (const file of ['context.md', 'snap.md', 'log.md', 'decisions.md', 'rules.md']) {
    copyTemplate(
      path.join(TEMPLATES_DIR, file),
      path.join(agentDir, file),
      vars
    );
    console.log(`  + .agent/${file}`);
  }

  // Agent files
  const agentFiles = fs.readdirSync(path.join(TEMPLATES_DIR, 'agents'));
  for (const file of agentFiles) {
    copyTemplate(
      path.join(TEMPLATES_DIR, 'agents', file),
      path.join(agentsDir, file),
      vars
    );
    console.log(`  + .agent/agents/${file}`);
  }

  // Handoff stubs
  const handoffs: Array<[string, string]> = [
    ['pm', 'fe'], ['pm', 'be'], ['design', 'fe'], ['fe', 'qa'], ['be', 'qa'],
  ];
  for (const [from, to] of handoffs) {
    const filename = `${from}-to-${to}.md`;
    fs.writeFileSync(
      path.join(handoffDir, filename),
      `# Handoff: ${from.toUpperCase()} -> ${to.toUpperCase()} — ${projectName}\n\n` +
      `**Tanggal:** _belum ada handoff_\n\n` +
      `_File ini akan diisi oleh ${from.toUpperCase()} Agent sebelum menyerahkan pekerjaan ke ${to.toUpperCase()} Agent._\n`,
      'utf-8'
    );
    console.log(`  + .agent/handoff/${filename}`);
  }

  console.log(`\n✓ Selesai! Agent context project "${projectName}" siap di ${agentDir}`);
  console.log('\nLangkah selanjutnya:');
  console.log('  1. Buka .agent/context.md — lengkapi bagian yang masih kosong');
  console.log('  2. Tambahkan .agent/ ke .gitignore jika tidak ingin di-commit');
  console.log('  3. Panggil agent dengan instruksi: "baca .agent/context.md dulu sebelum mulai"\n');
}
