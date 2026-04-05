"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffold = scaffold;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const TEMPLATES_DIR = path_1.default.join(__dirname, '..', 'templates');
function ask(rl, question) {
    return new Promise(resolve => rl.question(question, resolve));
}
function ensureDir(dir) {
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
}
function copyTemplate(src, dest, vars) {
    if (!fs_1.default.existsSync(src))
        return;
    let content = fs_1.default.readFileSync(src, 'utf-8');
    for (const [key, value] of Object.entries(vars)) {
        content = content.split(`{{${key}}}`).join(value);
    }
    fs_1.default.writeFileSync(dest, content, 'utf-8');
}
async function scaffold(targetDir) {
    const rl = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
    console.log('\n=== SheetMaster SDK — Agent Context Setup ===\n');
    const projectName = await ask(rl, 'Nama project: ');
    const projectDesc = await ask(rl, 'Deskripsi singkat: ');
    const techStack = await ask(rl, 'Tech stack (contoh: Next.js, Python, PostgreSQL): ');
    const boardId = await ask(rl, 'SheetMaster Board ID (kosongkan jika belum ada): ');
    rl.close();
    const vars = {
        PROJECT_NAME: projectName,
        PROJECT_DESC: projectDesc,
        TECH_STACK: techStack,
        BOARD_ID: boardId || 'belum-dikonfigurasi',
        DATE: new Date().toISOString().split('T')[0],
    };
    const agentDir = path_1.default.join(targetDir, '.agent');
    const agentsDir = path_1.default.join(agentDir, 'agents');
    const handoffDir = path_1.default.join(agentDir, 'handoff');
    ensureDir(agentDir);
    ensureDir(agentsDir);
    ensureDir(handoffDir);
    console.log('\nMembuat file context...');
    // Root files
    for (const file of ['context.md', 'snap.md', 'log.md', 'decisions.md', 'rules.md']) {
        copyTemplate(path_1.default.join(TEMPLATES_DIR, file), path_1.default.join(agentDir, file), vars);
        console.log(`  + .agent/${file}`);
    }
    // Agent files
    const agentFiles = fs_1.default.readdirSync(path_1.default.join(TEMPLATES_DIR, 'agents'));
    for (const file of agentFiles) {
        copyTemplate(path_1.default.join(TEMPLATES_DIR, 'agents', file), path_1.default.join(agentsDir, file), vars);
        console.log(`  + .agent/agents/${file}`);
    }
    // Handoff stubs
    const handoffs = [
        ['pm', 'fe'], ['pm', 'be'], ['design', 'fe'], ['fe', 'qa'], ['be', 'qa'],
    ];
    for (const [from, to] of handoffs) {
        const filename = `${from}-to-${to}.md`;
        fs_1.default.writeFileSync(path_1.default.join(handoffDir, filename), `# Handoff: ${from.toUpperCase()} -> ${to.toUpperCase()} — ${projectName}\n\n` +
            `**Tanggal:** _belum ada handoff_\n\n` +
            `_File ini akan diisi oleh ${from.toUpperCase()} Agent sebelum menyerahkan pekerjaan ke ${to.toUpperCase()} Agent._\n`, 'utf-8');
        console.log(`  + .agent/handoff/${filename}`);
    }
    console.log(`\n✓ Selesai! Agent context project "${projectName}" siap di ${agentDir}`);
    console.log('\nLangkah selanjutnya:');
    console.log('  1. Buka .agent/context.md — lengkapi bagian yang masih kosong');
    console.log('  2. Tambahkan .agent/ ke .gitignore jika tidak ingin di-commit');
    console.log('  3. Panggil agent dengan instruksi: "baca .agent/context.md dulu sebelum mulai"\n');
}
//# sourceMappingURL=scaffold.js.map