import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { LoginPage } from './components/login-page/login-page';
import { RegisterPage } from './components/register-page/register-page';
import { Dashboard } from './components/dashboard/dashboard';
import { ProjectView } from './components/project-view/project-view';
import { TextEditor } from './components/text-editor/text-editor';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },   
  { path: 'dashboard', component: Dashboard },
  {path: 'project/:id', component: ProjectView },
  { path: 'editor/:projectId/:fileId', component: TextEditor },

];
