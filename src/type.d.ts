import { type } from 'os';

declare global {
  type MindMapItem = {
    name: string;
    changeMs: number;
    data: any;
  };
  type SubTask = {
    status: boolean;
    content: string;
  };
  type TaskData = {
    id: number;
    title: string;
    description: string;
    urgent: number; // 0:normal,1:important
    dueDate: Date;
    subTask: SubTask[];
  };
}

export {};
