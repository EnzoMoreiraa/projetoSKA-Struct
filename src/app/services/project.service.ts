import { Injectable } from '@angular/core';
import { AuthService, User } from './auth.service';

export interface FileItem {
  id: string;
  name: string;
  type: string;
  content?: string;
}

export interface Folder {
  id: string;
  name: string;
  files: FileItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private auth: AuthService) {}

  getProjects(): Folder[] {
    const user = this.auth.getCurrentUser();
    return user?.projects || [];
  }

  getProjectById(projectId: string): Folder | undefined {
    const user = this.auth.getCurrentUser();
    return user?.projects.find((p: Folder) => p.id === projectId);
  }

  createProject(name: string) {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    const newProject: Folder = {
      id: crypto.randomUUID(),
      name,
      files: [],
    };

    user.projects.push(newProject);
    this.updateUser(user);
  }

  addFile(projectId: string, file: FileItem) {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    const project = user.projects.find((p: Folder) => p.id === projectId);
    if (!project) return;

    project.files.push(file);
    this.updateUser(user);
  }

  deleteFile(projectId: string, fileId: string) {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    const project = user.projects.find((p: Folder) => p.id === projectId);
    if (!project) return;

    project.files = project.files.filter((f: FileItem) => f.id !== fileId);
    this.updateUser(user);
  }

  renameFile(projectId: string, fileId: string, newName: string) {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    const project = user.projects.find((p: Folder) => p.id === projectId);
    if (!project) return;

    const file = project.files.find((f: FileItem) => f.id === fileId);
    if (!file) return;

    file.name = newName;
    this.updateUser(user);
  }

  renameProject(projectId: string, newName: string) {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    const project = user.projects.find((p: Folder) => p.id === projectId);
    if (!project) return;

    project.name = newName;
    this.updateUser(user);
  }

  deleteProject(projectId: string) {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    user.projects = user.projects.filter((p: Folder) => p.id !== projectId);
    this.updateUser(user);
  }

  private updateUser(user: User) {
    let users: User[] = JSON.parse(localStorage.getItem('struct_users') || '[]');

    const index = users.findIndex((u: User) => u.id === user.id);

    if (index === -1) {
      users.push(user);
    } else {
      users[index] = user;
    }

    localStorage.setItem('struct_users', JSON.stringify(users));
    localStorage.setItem('struct_current_user', JSON.stringify(user));
  }

  updateFileContent(projectId: string, fileId: string, content: string) {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    const project = user.projects.find((p: Folder) => p.id === projectId);
    if (!project) return;

    const file = project.files.find((f: FileItem) => f.id === fileId);
    if (!file) return;

    file.content = content;
    this.updateUser(user);
  }
}
