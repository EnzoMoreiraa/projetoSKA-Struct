import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService, Folder, FileItem } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [SidebarComponent, CommonModule, RouterLink],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.scss'
})
export class TextEditor implements OnDestroy {
  projectId = '';
  fileId = '';
  project?: Folder;
  file?: FileItem;
  content = '';
  savingTimer: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    public auth: AuthService 
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    this.fileId = this.route.snapshot.paramMap.get('fileId') || '';

    if (!this.projectId || !this.fileId) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadFile();
  }

  loadFile() {
    this.project = this.projectService.getProjectById(this.projectId);
    if (!this.project) {
      alert('Project not found');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.file = this.project.files.find(f => f.id === this.fileId);
    if (!this.file) {
      alert('File not found');
      this.router.navigate(['/project/' + this.projectId]);
      return;
    }

    this.content = this.file.content || '';
  }

  onEditorInput(e: Event) {
    const target = e.target as HTMLElement;
    this.content = target.innerHTML;

    if (this.savingTimer) clearTimeout(this.savingTimer);
    this.savingTimer = setTimeout(() => {
      this.saveContent();
    }, 800);
  }

  saveContent() {
    if (!this.projectId || !this.fileId) return;
    this.projectService.updateFileContent(this.projectId, this.fileId, this.content);
  }

  publish() {
    this.saveContent();
    alert('Publicado com sucesso!');
  }

  exportAsJson() {
    const payload = {
      projectId: this.projectId,
      fileId: this.fileId,
      content: this.content,
      name: this.file?.name
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `${this.file?.name || 'export'}.json`;
    a.click();
  }

  ngOnDestroy() {
    if (this.savingTimer) clearTimeout(this.savingTimer);
    this.saveContent();
  }
}