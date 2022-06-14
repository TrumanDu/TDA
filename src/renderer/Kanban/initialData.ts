const initialData = {
  tasks: {},
  columns: {
    todo: {
      id: 'todo',
      title: 'TODO',
      taskIds: [],
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
