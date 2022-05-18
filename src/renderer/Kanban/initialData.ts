const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: '吃饭' },
    'task-2': { id: 'task-2', content: '睡觉' },
    'task-3': { id: 'task-3', content: '打豆豆' },
    'task-4': { id: 'task-4', content: 'coding' },
  },
  columns: {
    todo: {
      id: 'todo',
      title: 'TODO',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      taskIds: [],
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: [],
    },
  },

  columnOrder: ['todo', 'inProgress', 'done'],
};

export default initialData;
