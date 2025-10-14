import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { OnInit } from '@angular/core';
import {RegraNotificacao} from '../models/notification_rule';

@Component({
  selector: 'app-notification-rules',
  imports: [
    CommonModule
  ],
  templateUrl: './notification-rules.component.html',
  styleUrl: './notification-rules.component.scss'
})
export class NotificationRulesComponent implements OnInit {

  constructor(private router: Router,
              private firestoreService: FirestoreService) {}

  regras: RegraNotificacao[] = [];

  ngOnInit() {
    const companyUid = localStorage.getItem('uid_server');
    console.log(companyUid);
    if (companyUid) {
      this.firestoreService.getNotificationRules(companyUid).subscribe({
        next: (regras: RegraNotificacao[]) => {
          this.regras = regras;
        },
        error: () => {
          alert('Erro ao carregar regras de notificação');
        }
      });
    }
  }

  editarRegra(regra: RegraNotificacao) {
    this.router.navigate(['notification-rule-form'], { state: { regra } });
  }

  excluirRegra(regra: RegraNotificacao) {
    this.firestoreService.deleteItem(
      localStorage.getItem('uid_server')!,
      regra.id
    ).then(
      () => {
        this.regras = this.regras.filter(r => r.id !== regra.id);
        console.log('Regra excluída com sucesso');
      },
      (error) => {
        alert('Erro ao excluir regra:' + error);
      }
    )
  }

  duplicateRegra(regra: RegraNotificacao) {
    regra.id = '';
    this.router.navigate(['notification-rule-form'], { state: { regra } });
  }

  adicionarRegra() {
    this.router.navigate(['notification-rule-form']);
  }

}
