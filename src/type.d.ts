import { type } from 'os';

declare global {
  type MindMapItem = {
    name: string;
    changeMs: number;
    data: any;
  };
  type SubTask = {
    status: number;
    content: string;
  };
  type TaskData = {
    id: number;
    content: string;
    description: string;
    level: number; // 0:normal,1:,2:
    dueDate: Date;
    subTask: SubTask[];
  };
}

export {};
