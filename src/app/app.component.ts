import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'teepNotificacoes';

  constructor(private router: Router) {}

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
