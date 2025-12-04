import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService, Folder } from '../../services/project.service';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopHeaderComponent } from '../top-header/top-header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [SidebarComponent, TopHeaderComponent, CommonModule],
  templateUrl: './project-view.html',
  styleUrl: './project-view.scss'
})
export class ProjectView {

  project: Folder | undefined;
  projectId: string = '';
  openedMenu: string | null = null;

  showFilePopup = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id')!;
    this.loadProject();
  }

  loadProject() {
    this.project = this.projectService.getProjectById(this.projectId);
  }

  openPopup() {
    this.showFilePopup = true;
  }

  closePopup() {
    this.showFilePopup = false;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  importFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.projectService.addFile(this.projectId, {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.name.split('.').pop() || '',
        content: reader.result as string
      });

      this.loadProject();
      this.closePopup();
    };

    reader.readAsText(file);
  }

  createNewFile() {
    const name = prompt('Nome do arquivo:');
    if (!name) return;

    this.projectService.addFile(this.projectId, {
      id: crypto.randomUUID(),
      name,
      type: name.split('.').pop() || '',
      content: ''
    });

    this.loadProject();
    this.closePopup();
  }

  toggleMenu(event: MouseEvent, fileId: string) {
    event.stopPropagation();
    this.openedMenu = this.openedMenu === fileId ? null : fileId;
  }

  openFile(fileId: string) {
    this.router.navigate([`/editor/${this.projectId}/${fileId}`]);
  }

  renameFile(fileId: string) {
    const newName = prompt('Novo nome do arquivo:');
    if (!newName) return;

    this.projectService.renameFile(this.projectId, fileId, newName);
    this.loadProject();
  }

  deleteFile(fileId: string) {
    if (!confirm('Deletar esse arquivo?')) return;

    this.projectService.deleteFile(this.projectId, fileId);
    this.loadProject();
  }

  createFile() {
    this.openPopup();
  }
}