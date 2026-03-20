export type UID = string;
export type ISODateTime = string;
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed' | 'archived';
export type ProjectStatus =
  | 'not_started'
  | 'planned'
  | 'in_progress'
  | 'waiting'
  | 'done'
  | 'cancelled';
export type RecurrenceType =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

export interface Area {
  id: number;
  uid: string;
  name: string;
  description: string | null;
}

export interface InboxItem {
  id: number;
  uid: string;
  content: string;
  title: string | null;
  status: string;
  source: string;
  user_id: number;
  suggested_type: string | null;
  suggested_reason: string | null;
  parsed_tags: unknown;
  parsed_projects: unknown;
  cleaned_content: string | null;
  created_at: string;
  updated_at: string;
}

export interface InboxPaginatedResponse {
  items: InboxItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface NoteTag {
  uid: string;
  name: string;
}

export interface NoteProject {
  uid: string;
  name: string;
}

export interface Note {
  id: number;
  uid: string;
  title: string | null;
  content: string | null;
  color: string | null;
  user_id: number;
  project_id: number | null;
  created_at: string;
  updated_at: string;
  Tags: NoteTag[];
  Project: NoteProject | null;
}

export interface ProjectTag {
  id: number;
  uid: string;
  name: string;
}

export interface ProjectArea {
  id: number;
  uid: string;
  name: string;
}

export interface ProjectTaskStatus {
  total: number;
  done: number;
  in_progress: number;
  not_started: number;
}

export interface Project {
  id: number;
  uid: string;
  name: string;
  description: string | null;
  pin_to_sidebar: boolean;
  priority: number | null;
  due_date_at: string | null;
  user_id: number;
  area_id: number | null;
  image_url: string | null;
  task_show_completed: boolean;
  task_sort_order: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  tags: ProjectTag[];
  task_status: ProjectTaskStatus;
  completion_percentage: number;
  share_count: number;
  is_shared: boolean;
  is_stalled: boolean;
  Area?: ProjectArea | null;
}

export interface Tag {
  uid: string;
  name: string;
}

export interface TaskTag {
  id: number;
  uid: string;
  name: string;
}

export interface TaskProjectRef {
  id: number;
  uid: string;
  name: string;
  image_url?: string | null;
}

export interface Subtask {
  id: number;
  uid: string;
  name: string;
  due_date: string | null;
  defer_until: string | null;
  completed_at: string | null;
  tags: TaskTag[];
}

export interface Task {
  id: number;
  uid: string;
  name: string;
  original_name?: string;
  recurring_parent_uid: string | null;
  due_date: string | null;
  defer_until: string | null;
  completed_at: string | null;
  today_move_count: number;
  tags: TaskTag[];
  Project: TaskProjectRef | null;
  subtasks: Subtask[];
}

export interface TasksListResponse {
  tasks: Task[];
  groupedTasks?: Record<string, Task[]>;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface TasksMetrics {
  total_open_tasks: number;
  tasks_pending_over_month: number;
  tasks_in_progress_count: number;
  tasks_due_today_count: number;
  today_plan_tasks_count: number;
  suggested_tasks_count: number;
  tasks_completed_today_count: number;
  weekly_completions: Array<{
    date: string;
    count: number;
    dayName: string;
  }>;
  dashboard_lists: {
    tasks_in_progress: Task[];
    tasks_today_plan: Task[];
    tasks_due_today: Task[];
    tasks_overdue: Task[];
    suggested_tasks: Task[];
    tasks_completed_today: Task[];
  };
}

export interface Profile {
  uid: string;
  email: string;
  name: string | null;
  surname: string | null;
  appearance: string;
  language: string;
  timezone: string;
  first_day_of_week: number;
  avatar_image: string | null;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  task_summary_enabled: boolean;
  task_summary_frequency: string;
  task_intelligence_enabled: boolean;
  pomodoro_enabled: boolean;
}
