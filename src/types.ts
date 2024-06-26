import { TaskStatus } from "./enum";

export interface Task {
  id: number;
  parent_id:number;
  project_id:number;
  assignee_id:number;
  name: string;
  description: string;
  due_date: string;
  status: TaskStatus;
  created_at: string;
  updated_at:string;
}

export interface UpdateTaskPayload {
  name: string;
  description: string;
  due_date: string;
  status: TaskStatus;
}

export interface User {
  id: number;
  key: string;
  name: string;
  email: string;
  role: string;
  is_active: number;
  created_at: string;
}


export interface UserProfile {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  profile: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}
export interface ProjectUser {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  users: ProjectUser[];
  is_active: number;
  created_at: string;
}

export interface Comment {
  id: number;
  parent_id: number;
  content: string;
}