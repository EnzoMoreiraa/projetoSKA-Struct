import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopHeaderComponent } from '../top-header/top-header';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, TopHeaderComponent, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

  projects: any[] = [];
  openedMenu: string | null = null;

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.projects = this.projectService.getProjects();
  }

  createProject() {
    const name = prompt('Nome do Projeto:');
    if (!name) return;

    this.projectService.createProject(name);
    this.projects = this.projectService.getProjects();
  }

  toggleMenu(projectId: string) {
    this.openedMenu = this.openedMenu === projectId ? null : projectId;
  }

  openProject(projectId: string) {
    this.router.navigate(['/project', projectId]);
  }

  renameProject(projectId: string) {
    const newName = prompt("Novo nome do projeto:");
    if (!newName) return;

    this.projectService.renameProject(projectId, newName);
    this.projects = this.projectService.getProjects();
  }

  deleteProject(projectId: string) {
    if (!confirm("Deletar este projeto?")) return;

    this.projectService.deleteProject(projectId);
    this.projects = this.projectService.getProjects();
  }
}