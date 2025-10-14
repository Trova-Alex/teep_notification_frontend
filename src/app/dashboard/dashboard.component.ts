import { Component, OnInit } from '@angular/core';
import { FirestoreService} from '../services/firestore.service';
import { DecimalPipe } from '@angular/common';
import { CompanyFirebase } from '../models/company_firebase';
import { format } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user = localStorage.getItem('username') || '--';
  licencaMensagens = { total: 0, utilizado: 0, restante: 0 };
  licencaUsuarios = { total: 0, utilizado: 0, restante: 0 };

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    var company_uid = localStorage.getItem('uid_server');
    const mesAtual = format(new Date(), 'yyyy-MM');
    this.firestoreService.getCompany(company_uid!).subscribe((company: CompanyFirebase) => {
      this.licencaMensagens.total = company.notification_per_month || 0;

      // Buscar o documento do mês atual na subcoleção
      this.firestoreService.getMonthSystemUse(company_uid!, mesAtual).subscribe((doc: any) => {
        this.licencaMensagens.utilizado = doc?.notification_count || 0;
        this.licencaMensagens.restante = this.licencaMensagens.total - this.licencaMensagens.utilizado;
      });

      this.licencaUsuarios.utilizado = company.users.length || 0;
      this.licencaUsuarios.total = company.total_users_available || 0;
      this.licencaUsuarios.restante = this.licencaUsuarios.total - this.licencaUsuarios.utilizado;
    });
  }

  getPorcentagemUsoMensagens(): number {
    if (this.licencaMensagens.total === 0) return 0;
    return Math.min(100, Math.round((this.licencaMensagens.utilizado / this.licencaMensagens.total) * 100));
  }

  getPorcentagemUsoUsuarios(): number {
    if (this.licencaUsuarios.total === 0) return 0;
    return Math.min(100, Math.round((this.licencaUsuarios.utilizado / this.licencaUsuarios.total) * 100));
  }

  logout() {
    localStorage.removeItem('token');
    // redirecionar para login
  }
}
