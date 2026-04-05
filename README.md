# sheetmaster-sdk

TypeScript SDK for [SheetMaster](https://github.com/asisrasyid/SheetMaster) — a task management app backed by Google Apps Script.

## Install

```bash
# From GitHub
npm install github:asisrasyid/sheetmaster-sdk

# From local (development)
npm install file:../sheetmaster-sdk
```

## Quick Start

```typescript
import { SheetMasterClient } from 'sheetmaster-sdk';

const sm = new SheetMasterClient({
  apiKey: 'sm_your_api_key_here',
  baseUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
});

// Get all boards
const boards = await sm.getBoards();

// Get board detail (columns + tasks)
const detail = await sm.getBoard('board_id');

// Create a task
const task = await sm.createTask('board_id', 'column_id', 'My Task', {
  priority: 'high',
  description: 'Task description here',
});

// Add subtasks in bulk
await sm.createSubTasks(task.id, [
  'Step 1: do this',
  'Step 2: do that',
  'Step 3: done',
]);

// Move task to another column
await sm.moveTask(task.id, 'done_column_id');
```

## API Reference

### Boards
| Method | Description |
|--------|-------------|
| `getBoards()` | Get all boards |
| `getBoard(boardId)` | Get board with columns, tasks, members, labels |
| `createBoard(name, description?)` | Create a new board |
| `deleteBoard(boardId)` | Delete a board (owner only) |

### Columns
| Method | Description |
|--------|-------------|
| `createColumn(boardId, name, color?)` | Create a new column |
| `deleteColumn(columnId)` | Delete a column |
| `clearDefaultColumns(boardId)` | Remove all default columns from a new board |

### Tasks
| Method | Description |
|--------|-------------|
| `createTask(boardId, columnId, title, options?)` | Create a task |
| `updateTask(taskId, fields)` | Update task fields |
| `moveTask(taskId, toColumnId, position?)` | Move task to another column |
| `deleteTask(taskId)` | Delete a task |

### Subtasks
| Method | Description |
|--------|-------------|
| `createSubTask(taskId, title)` | Add a subtask |
| `createSubTasks(taskId, titles[])` | Add multiple subtasks at once |
| `updateSubTask(subTaskId, fields)` | Update title or completion status |
| `deleteSubTask(subTaskId)` | Delete a subtask |

### Labels
| Method | Description |
|--------|-------------|
| `createLabel(boardId, name, color)` | Create a label |
| `addTaskLabel(taskId, labelId)` | Attach label to task |
| `removeTaskLabel(taskId, labelId)` | Remove label from task |

### Assignees
| Method | Description |
|--------|-------------|
| `addAssignee(taskId, userId)` | Add assignee to task |
| `removeAssignee(taskId, userId)` | Remove assignee from task |

## Priority Values
`'low'` | `'medium'` | `'high'` | `'urgent'`

## Generate API Key
Open SheetMaster → Profile → API Keys → Generate

## License
MIT
