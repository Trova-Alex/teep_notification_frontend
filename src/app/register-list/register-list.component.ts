import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface CadastroItem {
  nome: string;
  descricao: string;
  icone: string;
  link: string;
}

@Component({
  selector: 'app-register-list',
  imports: [
    CommonModule
  ],
  standalone: true,
  templateUrl: './register-list.component.html',
  styleUrl: './register-list.component.scss'
})
export class RegisterListComponent {

  constructor(private router: Router) {}

  cadastros: CadastroItem[] = [
    {
      nome: 'Cadastro de Usuários',
      descricao: 'Gerencie os usuários do sistema.',
      icone: 'person',
      link: '/user-list'
    },
    {
      nome: 'Cadastros de Regras de Notificação',
      descricao: 'Configure regras para notificações automáticas.',
      icone: 'notifications',
      link: '/notification-rules-list'
    }
  ];

  abrirCadastro(link: string) {
    console.log(link);
    this.router.navigate([link]);
  }

}
