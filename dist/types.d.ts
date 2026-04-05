export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Role = 'owner' | 'approver' | 'contributor' | 'viewer';
export interface Board {
    id: string;
    name: string;
    description: string;
    createdBy: string;
    createdAt: string;
    isArchived: boolean;
    myRole: Role;
}
export interface Column {
    id: string;
    boardId: string;
    name: string;
    position: number;
    color: string;
    requiresApproval: boolean;
}
export interface Assignee {
    id: string;
    name: string;
    avatarColor: string;
}
export interface Label {
    id: string;
    boardId: string;
    name: string;
    color: string;
}
export interface SubTask {
    id: string;
    taskId: string;
    title: string;
    isCompleted: boolean;
}
export interface Task {
    id: string;
    boardId: string;
    columnId: string;
    title: string;
    description?: string;
    priority: Priority;
    deadline?: string;
    position: number;
    assignees?: Assignee[];
    labels?: Label[];
    subtasks?: SubTask[];
}
export interface Member {
    id: string;
    name: string;
    role: Role;
}
export interface BoardDetail {
    board: Board;
    columns: Column[];
    tasks: Task[];
    members: Member[];
    labels: Label[];
}
export interface SheetMasterConfig {
    apiKey: string;
    baseUrl: string;
}
export interface CreateTaskOptions {
    priority?: Priority;
    description?: string;
}
export interface UpdateTaskFields {
    title?: string;
    description?: string;
    priority?: Priority;
    deadline?: string;
}
export interface UpdateSubTaskFields {
    title?: string;
    isCompleted?: boolean;
}
//# sourceMappingURL=types.d.ts.map