import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Company } from '../models/company';
import { DjangoApiService} from '../services/django-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private djangoApi: DjangoApiService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.response != 'ok') {
            alert(res.message);
            return;
          }
          console.log(res);
          console.log(res.token);
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.data.username);
          this.djangoApi.getCompany().subscribe({
            next: (companies: Company[]) => {
              if (companies.length > 0) {
                var company = companies[0];
                console.log(company);
                localStorage.setItem('uid_server', company.uid_server);
                this.router.navigate(['/dashboard']);
              } else {
                this.error = 'Nenhuma empresa encontrada';
              }
            },
            error: () => {
              this.error = 'Erro ao buscar empresa';
            }
          });
        },
        error: () => {
          this.error = 'Usuário ou senha inválidos';
        }
      });
    }
  }
}
