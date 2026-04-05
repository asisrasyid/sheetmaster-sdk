"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetMasterClient = void 0;
class SheetMasterClient {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl;
    }
    async request(action, params = {}) {
        const body = JSON.stringify({ apiKey: this.apiKey, action, ...params });
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 60000);
        try {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body,
                redirect: 'follow',
                signal: controller.signal,
            });
            const data = await res.json();
            if (!data.success)
                throw new Error(data.error ?? 'SheetMaster API error');
            return data.data;
        }
        catch (err) {
            if (err.name === 'AbortError')
                throw new Error('SheetMaster API timeout (>60s)');
            throw err;
        }
        finally {
            clearTimeout(timeout);
        }
    }
    // ── Boards ────────────────────────────────────────────────────
    /** Ambil semua board yang dimiliki atau diikuti user */
    getBoards() {
        return this.request('getBoards');
    }
    /** Ambil detail board: columns, tasks, members, labels */
    getBoard(boardId) {
        return this.request('getBoard', { boardId });
    }
    /** Buat board baru */
    createBoard(name, description) {
        return this.request('createBoard', { name, description });
    }
    /** Hapus board (hanya owner) */
    deleteBoard(boardId) {
        return this.request('deleteBoard', { boardId });
    }
    // ── Columns ───────────────────────────────────────────────────
    /** Buat kolom baru di board */
    createColumn(boardId, name, color = '#64748b') {
        return this.request('createColumn', { boardId, name, color });
    }
    /** Hapus kolom (harus kosong dari task) */
    deleteColumn(columnId) {
        return this.request('deleteColumn', { columnId });
    }
    /** Hapus semua kolom default bawaan (To Do, In Progress, Review, Done) dari board baru */
    async clearDefaultColumns(boardId) {
        const { columns } = await this.getBoard(boardId);
        await Promise.all(columns.map(col => this.deleteColumn(col.id)));
    }
    // ── Tasks ─────────────────────────────────────────────────────
    /** Buat task baru di board dan kolom tertentu */
    createTask(boardId, columnId, title, options = {}) {
        return this.request('createTask', {
            boardId,
            columnId,
            title,
            priority: options.priority ?? 'medium',
            ...(options.description ? { description: options.description } : {}),
            ...(options.deadline ? { deadline: options.deadline } : {}),
        });
    }
    /** Update field task. Hanya sertakan field yang ingin diubah */
    updateTask(taskId, fields) {
        return this.request('updateTask', { taskId, ...fields });
    }
    /** Pindahkan task ke kolom lain */
    moveTask(taskId, toColumnId, position = 0) {
        return this.request('moveTask', { taskId, toColumnId, position });
    }
    /** Hapus task */
    deleteTask(taskId) {
        return this.request('deleteTask', { taskId });
    }
    // ── Subtasks ──────────────────────────────────────────────────
    /** Tambah subtask/checklist ke task */
    createSubTask(taskId, title) {
        return this.request('createSubTask', { taskId, title });
    }
    /** Tambah banyak subtask sekaligus */
    async createSubTasks(taskId, titles) {
        const results = [];
        for (const title of titles) {
            results.push(await this.createSubTask(taskId, title));
        }
        return results;
    }
    /** Update subtask: ubah judul atau tandai selesai */
    updateSubTask(subTaskId, fields) {
        return this.request('updateSubTask', { subTaskId, ...fields });
    }
    /** Hapus subtask */
    deleteSubTask(subTaskId) {
        return this.request('deleteSubTask', { subTaskId });
    }
    // ── Labels ────────────────────────────────────────────────────
    /** Buat label baru di board */
    createLabel(boardId, name, color) {
        return this.request('createLabel', { boardId, name, color });
    }
    /** Tambahkan label ke task */
    addTaskLabel(taskId, labelId) {
        return this.request('addTaskLabel', { taskId, labelId });
    }
    /** Hapus label dari task */
    removeTaskLabel(taskId, labelId) {
        return this.request('removeTaskLabel', { taskId, labelId });
    }
    // ── Assignees ─────────────────────────────────────────────────
    /** Tambahkan assignee ke task */
    addAssignee(taskId, userId) {
        return this.request('addAssignee', { taskId, userId });
    }
    /** Hapus assignee dari task */
    removeAssignee(taskId, userId) {
        return this.request('removeAssignee', { taskId, userId });
    }
}
exports.SheetMasterClient = SheetMasterClient;
//# sourceMappingURL=client.js.map