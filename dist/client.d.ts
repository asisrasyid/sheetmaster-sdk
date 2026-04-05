import { Board, BoardDetail, Column, Task, SubTask, Label, SheetMasterConfig, CreateTaskOptions, UpdateTaskFields, UpdateSubTaskFields } from './types';
export declare class SheetMasterClient {
    private readonly apiKey;
    private readonly baseUrl;
    constructor(config: SheetMasterConfig);
    private request;
    /** Ambil semua board yang dimiliki atau diikuti user */
    getBoards(): Promise<Board[]>;
    /** Ambil detail board: columns, tasks, members, labels */
    getBoard(boardId: string): Promise<BoardDetail>;
    /** Buat board baru */
    createBoard(name: string, description?: string): Promise<Board>;
    /** Hapus board (hanya owner) */
    deleteBoard(boardId: string): Promise<void>;
    /** Buat kolom baru di board */
    createColumn(boardId: string, name: string, color?: string): Promise<Column>;
    /** Hapus kolom (harus kosong dari task) */
    deleteColumn(columnId: string): Promise<void>;
    /** Hapus semua kolom default bawaan (To Do, In Progress, Review, Done) dari board baru */
    clearDefaultColumns(boardId: string): Promise<void>;
    /** Buat task baru di board dan kolom tertentu */
    createTask(boardId: string, columnId: string, title: string, options?: CreateTaskOptions): Promise<Task>;
    /** Update field task. Hanya sertakan field yang ingin diubah */
    updateTask(taskId: string, fields: UpdateTaskFields): Promise<void>;
    /** Pindahkan task ke kolom lain */
    moveTask(taskId: string, toColumnId: string, position?: number): Promise<void>;
    /** Hapus task */
    deleteTask(taskId: string): Promise<void>;
    /** Tambah subtask/checklist ke task */
    createSubTask(taskId: string, title: string): Promise<SubTask>;
    /** Tambah banyak subtask sekaligus */
    createSubTasks(taskId: string, titles: string[]): Promise<SubTask[]>;
    /** Update subtask: ubah judul atau tandai selesai */
    updateSubTask(subTaskId: string, fields: UpdateSubTaskFields): Promise<void>;
    /** Hapus subtask */
    deleteSubTask(subTaskId: string): Promise<void>;
    /** Buat label baru di board */
    createLabel(boardId: string, name: string, color: string): Promise<Label>;
    /** Tambahkan label ke task */
    addTaskLabel(taskId: string, labelId: string): Promise<void>;
    /** Hapus label dari task */
    removeTaskLabel(taskId: string, labelId: string): Promise<void>;
    /** Tambahkan assignee ke task */
    addAssignee(taskId: string, userId: string): Promise<void>;
    /** Hapus assignee dari task */
    removeAssignee(taskId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=client.d.ts.map