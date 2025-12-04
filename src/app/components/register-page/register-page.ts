import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss'
})
export class RegisterPage {

  username = '';
  email = '';
  password = '';
  rememberMe = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();

    const ok = this.auth.register(this.username, this.email, this.password);

    if (!ok) {
      alert('Usuário ou email já cadastrados!');
      return;
    }

    this.router.navigate(['/dashboard']);
  }
}
