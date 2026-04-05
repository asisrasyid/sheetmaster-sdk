import {
  Board, BoardDetail, Column, Task, SubTask, Label,
  SheetMasterConfig, Priority, CreateTaskOptions,
  UpdateTaskFields, UpdateSubTaskFields,
} from './types';

export class SheetMasterClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: SheetMasterConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  private async request<T>(action: string, params: Record<string, unknown> = {}): Promise<T> {
    const body = JSON.stringify({ apiKey: this.apiKey, action, ...params });

    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
      redirect: 'follow',
    });

    const data = await res.json() as { success: boolean; data: T; error?: string };
    if (!data.success) throw new Error(data.error ?? 'SheetMaster API error');
    return data.data;
  }

  // ── Boards ────────────────────────────────────────────────────

  /** Ambil semua board yang dimiliki atau diikuti user */
  getBoards(): Promise<Board[]> {
    return this.request<Board[]>('getBoards');
  }

  /** Ambil detail board: columns, tasks, members, labels */
  getBoard(boardId: string): Promise<BoardDetail> {
    return this.request<BoardDetail>('getBoard', { boardId });
  }

  /** Buat board baru */
  createBoard(name: string, description?: string): Promise<Board> {
    return this.request<Board>('createBoard', { name, description });
  }

  /** Hapus board (hanya owner) */
  deleteBoard(boardId: string): Promise<void> {
    return this.request<void>('deleteBoard', { boardId });
  }

  // ── Columns ───────────────────────────────────────────────────

  /** Buat kolom baru di board */
  createColumn(boardId: string, name: string, color = '#64748b'): Promise<Column> {
    return this.request<Column>('createColumn', { boardId, name, color });
  }

  /** Hapus kolom (harus kosong dari task) */
  deleteColumn(columnId: string): Promise<void> {
    return this.request<void>('deleteColumn', { columnId });
  }

  /** Hapus semua kolom default bawaan (To Do, In Progress, Review, Done) dari board baru */
  async clearDefaultColumns(boardId: string): Promise<void> {
    const { columns } = await this.getBoard(boardId);
    await Promise.all(columns.map(col => this.deleteColumn(col.id)));
  }

  // ── Tasks ─────────────────────────────────────────────────────

  /** Buat task baru di board dan kolom tertentu */
  createTask(
    boardId: string,
    columnId: string,
    title: string,
    options: CreateTaskOptions = {}
  ): Promise<Task> {
    return this.request<Task>('createTask', {
      boardId,
      columnId,
      title,
      priority: options.priority ?? 'medium',
      ...(options.description ? { description: options.description } : {}),
    });
  }

  /** Update field task. Hanya sertakan field yang ingin diubah */
  updateTask(taskId: string, fields: UpdateTaskFields): Promise<void> {
    return this.request<void>('updateTask', { taskId, ...fields });
  }

  /** Pindahkan task ke kolom lain */
  moveTask(taskId: string, toColumnId: string, position = 0): Promise<void> {
    return this.request<void>('moveTask', { taskId, toColumnId, position });
  }

  /** Hapus task */
  deleteTask(taskId: string): Promise<void> {
    return this.request<void>('deleteTask', { taskId });
  }

  // ── Subtasks ──────────────────────────────────────────────────

  /** Tambah subtask/checklist ke task */
  createSubTask(taskId: string, title: string): Promise<SubTask> {
    return this.request<SubTask>('createSubTask', { taskId, title });
  }

  /** Tambah banyak subtask sekaligus */
  async createSubTasks(taskId: string, titles: string[]): Promise<SubTask[]> {
    const results: SubTask[] = [];
    for (const title of titles) {
      results.push(await this.createSubTask(taskId, title));
    }
    return results;
  }

  /** Update subtask: ubah judul atau tandai selesai */
  updateSubTask(subTaskId: string, fields: UpdateSubTaskFields): Promise<void> {
    return this.request<void>('updateSubTask', { subTaskId, ...fields });
  }

  /** Hapus subtask */
  deleteSubTask(subTaskId: string): Promise<void> {
    return this.request<void>('deleteSubTask', { subTaskId });
  }

  // ── Labels ────────────────────────────────────────────────────

  /** Buat label baru di board */
  createLabel(boardId: string, name: string, color: string): Promise<Label> {
    return this.request<Label>('createLabel', { boardId, name, color });
  }

  /** Tambahkan label ke task */
  addTaskLabel(taskId: string, labelId: string): Promise<void> {
    return this.request<void>('addTaskLabel', { taskId, labelId });
  }

  /** Hapus label dari task */
  removeTaskLabel(taskId: string, labelId: string): Promise<void> {
    return this.request<void>('removeTaskLabel', { taskId, labelId });
  }

  // ── Assignees ─────────────────────────────────────────────────

  /** Tambahkan assignee ke task */
  addAssignee(taskId: string, userId: string): Promise<void> {
    return this.request<void>('addAssignee', { taskId, userId });
  }

  /** Hapus assignee dari task */
  removeAssignee(taskId: string, userId: string): Promise<void> {
    return this.request<void>('removeAssignee', { taskId, userId });
  }
}
