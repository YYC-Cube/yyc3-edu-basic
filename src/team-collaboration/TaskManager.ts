/**
 * YYC³ 团队协作任务管理系统
 * 提供需求分配与进度跟踪功能
 */

interface TaskAssignee {
  id: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  REVIEW = 'review',
  DONE = 'done',
  BLOCKED = 'blocked'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignee: TaskAssignee | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: number | null;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
  subtasks: Task[];
  tags: string[];
  dependencies: string[];
}

export class TaskManager {
  private projectId: string;
  private tasks: Map<string, Task> = new Map();
  private currentUser: TaskAssignee;

  constructor(projectId: string, currentUser: TaskAssignee) {
    this.projectId = projectId;
    this.currentUser = currentUser;
  }

  // 创建任务
  async createTask(
    title: string,
    description: string,
    priority: TaskPriority = TaskPriority.MEDIUM,
    assigneeId?: string,
    dueDate?: number,
    tags: string[] = []
  ): Promise<Task | null> {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const taskId = this.generateTaskId();
      const task: Task = {
        id: taskId,
        title,
        description,
        projectId: this.projectId,
        assignee: null, // 会在后面设置
        priority,
        status: TaskStatus.TODO,
        dueDate: dueDate || null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        completedAt: null,
        subtasks: [],
        tags,
        dependencies: []
      };
      
      this.tasks.set(taskId, task);
      return task;
    } catch (error) {
      console.error('Failed to create task:', error);
      return null;
    }
  }

  // 获取所有任务
  async getTasks(
    filters: {
      status?: TaskStatus | TaskStatus[];
      priority?: TaskPriority | TaskPriority[];
      assigneeId?: string;
      tags?: string[];
      dueDateBefore?: number;
      dueDateAfter?: number;
    } = {}
  ): Promise<Task[]> {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let result = Array.from(this.tasks.values())
        .filter(task => task.projectId === this.projectId);
      
      // 应用过滤器
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          result = result.filter(task => filters.status?.includes(task.status));
        } else {
          result = result.filter(task => task.status === filters.status);
        }
      }
      
      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          result = result.filter(task => filters.priority?.includes(task.priority));
        } else {
          result = result.filter(task => task.priority === filters.priority);
        }
      }
      
      if (filters.assigneeId) {
        result = result.filter(task => task.assignee?.id === filters.assigneeId);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        result = result.filter(task => 
          filters.tags?.some(tag => task.tags.includes(tag))
        );
      }
      
      if (filters.dueDateBefore !== undefined && filters.dueDateBefore !== null) {
        result = result.filter(task => 
          task.dueDate && task.dueDate <= filters.dueDateBefore
        );
      }
      
      if (filters.dueDateAfter !== undefined && filters.dueDateAfter !== null) {
        result = result.filter(task => 
          task.dueDate && task.dueDate >= filters.dueDateAfter
        );
      }
      
      // 按更新时间降序排序
      result.sort((a, b) => b.updatedAt - a.updatedAt);
      
      return result;
    } catch (error) {
      console.error('Failed to get tasks:', error);
      return [];
    }
  }

  // 获取单个任务
  async getTask(taskId: string): Promise<Task | null> {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const task = this.tasks.get(taskId);
      if (!task || task.projectId !== this.projectId) {
        return null;
      }
      
      return task;
    } catch (error) {
      console.error(`Failed to get task ${taskId}:`, error);
      return null;
    }
  }

  // 更新任务
  async updateTask(
    taskId: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'status' | 'dueDate' | 'tags'>>
  ): Promise<boolean> {
    try {
      const task = this.tasks.get(taskId);
      if (!task || task.projectId !== this.projectId) {
        throw new Error(`Task ${taskId} not found`);
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 应用更新
      Object.assign(task, updates);
      task.updatedAt = Date.now();
      
      // 如果任务状态变为完成，设置完成时间
      if (updates.status === TaskStatus.DONE && task.status !== TaskStatus.DONE) {
        task.completedAt = Date.now();
      }
      
      // 如果任务状态从完成变为其他，清除完成时间
      if (updates.status && updates.status !== TaskStatus.DONE && task.status === TaskStatus.DONE) {
        task.completedAt = null;
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to update task ${taskId}:`, error);
      return false;
    }
  }

  // 分配任务
  async assignTask(taskId: string, assignee: TaskAssignee | null): Promise<boolean> {
    try {
      const task = this.tasks.get(taskId);
      if (!task || task.projectId !== this.projectId) {
        throw new Error(`Task ${taskId} not found`);
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      task.assignee = assignee;
      task.updatedAt = Date.now();
      
      return true;
    } catch (error) {
      console.error(`Failed to assign task ${taskId}:`, error);
      return false;
    }
  }

  // 创建子任务
  async createSubtask(
    parentTaskId: string,
    title: string,
    description: string,
    priority: TaskPriority = TaskPriority.MEDIUM,
    assigneeId?: string,
    dueDate?: number
  ): Promise<Task | null> {
    try {
      const parentTask = this.tasks.get(parentTaskId);
      if (!parentTask || parentTask.projectId !== this.projectId) {
        throw new Error(`Parent task ${parentTaskId} not found`);
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const subtaskId = this.generateTaskId();
      const subtask: Task = {
        id: subtaskId,
        title,
        description,
        projectId: this.projectId,
        assignee: null, // 会在后面设置
        priority,
        status: TaskStatus.TODO,
        dueDate: dueDate || null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        completedAt: null,
        subtasks: [],
        tags: [...parentTask.tags], // 继承父任务的标签
        dependencies: []
      };
      
      // 将子任务添加到父任务
      parentTask.subtasks.push(subtask);
      parentTask.updatedAt = Date.now();
      
      // 也存储在主任务列表中以便快速查找
      this.tasks.set(subtaskId, subtask);
      
      return subtask;
    } catch (error) {
      console.error(`Failed to create subtask for task ${parentTaskId}:`, error);
      return null;
    }
  }

  // 删除任务
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const task = this.tasks.get(taskId);
      if (!task || task.projectId !== this.projectId) {
        throw new Error(`Task ${taskId} not found`);
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 递归删除所有子任务
      this.deleteSubtasksRecursively(task.subtasks);
      
      // 从主任务列表中删除
      this.tasks.delete(taskId);
      
      return true;
    } catch (error) {
      console.error(`Failed to delete task ${taskId}:`, error);
      return false;
    }
  }

  // 递归删除子任务
  private deleteSubtasksRecursively(subtasks: Task[]): void {
    subtasks.forEach(subtask => {
      // 先递归删除下一级子任务
      this.deleteSubtasksRecursively(subtask.subtasks);
      // 从主任务列表中删除
      this.tasks.delete(subtask.id);
    });
  }

  // 添加任务依赖
  async addDependency(taskId: string, dependentTaskId: string): Promise<boolean> {
    try {
      const task = this.tasks.get(taskId);
      const dependentTask = this.tasks.get(dependentTaskId);
      
      if (!task || !dependentTask || task.projectId !== this.projectId || dependentTask.projectId !== this.projectId) {
        throw new Error('One or both tasks not found');
      }
      
      // 检查循环依赖
      if (this.checkCircularDependency(dependentTaskId, taskId)) {
        throw new Error('Adding this dependency would create a circular reference');
      }
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 避免重复添加
      if (!task.dependencies.includes(dependentTaskId)) {
        task.dependencies.push(dependentTaskId);
        task.updatedAt = Date.now();
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to add dependency from ${taskId} to ${dependentTaskId}:`, error);
      return false;
    }
  }

  // 检查循环依赖
  private checkCircularDependency(startTaskId: string, targetTaskId: string): boolean {
    const visited = new Set<string>();
    
    const dfs = (taskId: string): boolean => {
      if (taskId === targetTaskId) {
        return true;
      }
      
      if (visited.has(taskId)) {
        return false;
      }
      
      visited.add(taskId);
      
      const task = this.tasks.get(taskId);
      if (!task) {
        return false;
      }
      
      // 检查所有依赖的任务
      for (const depId of task.dependencies) {
        if (dfs(depId)) {
          return true;
        }
      }
      
      return false;
    };
    
    return dfs(startTaskId);
  }

  // 生成任务ID
  private generateTaskId(): string {
    return 'task-' + Math.random().toString(36).substring(2, 10);
  }
}

export default TaskManager;