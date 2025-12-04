import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {

  loginValue = '';
  passwordValue = '';
  rememberMe = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();

    const ok = this.auth.login(this.loginValue, this.passwordValue);

    if (!ok) {
      alert('Login ou senha incorretos.');
      return;
    }

    this.router.navigate(['/dashboard']);
  }
}
