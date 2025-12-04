import { Injectable } from '@angular/core';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  projects: any[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private LS_KEY = 'struct_users';
  private LS_CURRENT = 'struct_current_user';

  constructor() {}

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.LS_KEY) || '[]');
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(this.LS_KEY, JSON.stringify(users));
  }

  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem(this.LS_CURRENT) || 'null');
  }

  private setCurrentUser(user: User) {
    localStorage.setItem(this.LS_CURRENT, JSON.stringify(user));
  }

  register(username: string, email: string, password: string): boolean {
    const users = this.getUsers();

    const exists = users.some(
      (u) => u.email === email || u.username === username
    );

    if (exists) return false;

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      password,
      projects: [],
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    return true;
  }

  login(login: string, password: string): boolean {
    const users = this.getUsers();

    const user = users.find(
      (u) =>
        (u.email === login || u.username === login) &&
        u.password === password
    );

    if (!user) return false;

    this.setCurrentUser(user);
    return true;
  }

  logout() {
    localStorage.removeItem(this.LS_CURRENT);
  }
}
