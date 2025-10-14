import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {CompanyFirebase} from '../models/company_firebase';

interface Usuario {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {

  usuarios: Usuario[] = [];
  licencaUsuarios = { total: 0, utilizado: 0, restante: 0 };

  constructor(private firestoreService: FirestoreService,
              private cdr: ChangeDetectorRef,
              private router: Router) {}

  async ngOnInit() {
    const companyUid = localStorage.getItem('uid_server');
    this.firestoreService.getCompany(companyUid!).subscribe((company: CompanyFirebase) => {
      this.licencaUsuarios.utilizado = company.users.length || 0;
      this.licencaUsuarios.total = company.total_users_available || 0;
      this.licencaUsuarios.restante = this.licencaUsuarios.total - this.licencaUsuarios.utilizado;
      this.firestoreService.carregarUsuariosComDados(company.users).then(usuarios => {
        this.usuarios = usuarios;
        this.cdr.markForCheck();
      });
    });
  }

  editarUsuario(user: Usuario) {
    this.router.navigate(['user-form'], { state: { user } });
  }

  excluirUsuario(user: Usuario) {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      // Lógica para excluir usuário
      const companyUid = localStorage.getItem('uid_server');
      this.firestoreService.deleteUser(companyUid!, user.id!).then(() =>
      {
        this.usuarios = this.usuarios.filter(u => u.id !== user.id);
        this.cdr.markForCheck();

        alert(`Usuário ${user.name} excluído com sucesso!`);
      });
    }
  }

  adicionarUsuario() {
    this.router.navigate(['user-form']);
  }

}
