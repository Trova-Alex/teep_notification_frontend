import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { DjangoApiService } from '../services/django-api.service';
import { FirestoreService} from '../services/firestore.service';
import { RegraNotificacao } from '../models/notification_rule';
import { StopReason } from '../models/stop-reason';
import { Machine } from '../models/machine';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-notification-rule-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-rule-form.component.html',
  styleUrl: './notification-rule-form.component.scss'
})
export class NotificationRuleFormComponent implements OnInit {
  @Input() regra: RegraNotificacao = {
    id: '',
    identification: '',
    activ: true,
    init: true,
    end: true,
    notify_after: 0,
    notify_every: 0,
    type: 'stop',
    priority: 'high',
    reason__codes: [],
    users: [],
  };
  stopReasons: StopReason[] = [];
  machines: Machine[] = [];
  users: any[] = [];

  selectedStopReason: string = '';
  selectedMachine: string = '';
  usuariosSelecionados: string[] = [];
  paresStopResource: { stopReasonCode: string, stopReasonDescription: string, machineCode: string, machineDescription: string }[] = [];

  mensagemErro: string = '';

  constructor(
    private djangoApi: DjangoApiService,
    private firestoreService: FirestoreService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.djangoApi.getStopReasons().subscribe((data: StopReason[]) => {
      this.stopReasons = [{ code: '', description: 'Sem motivo' }, ...data];

      this.djangoApi.getMachines().subscribe((data: Machine[]) => {
        this.machines = data;

        const companyUid = localStorage.getItem('uid_server');
        this.firestoreService.getCompany(companyUid!).subscribe((data: { users: any[] }) => {
          this.firestoreService.carregarUsuariosComDados(data.users).then(usuarios => {
            this.users = usuarios;
            this.cdr.markForCheck();

            // Só aqui pega a regra recebida
            const regraRecebida = history.state.regra;
            if (regraRecebida) {
              this.regra = regraRecebida;
              this.usuariosSelecionados = regraRecebida.users || [];
              this.users.forEach(usuario => {
                usuario.selecionado = this.usuariosSelecionados.includes(usuario.id);
              });
              // Preenche paresStopResource a partir de reason__codes
              this.paresStopResource = (regraRecebida.reason__codes || []).map((item: string) => {
                const [machineCode, stopReasonCode] = item.split('--');
                const machine = this.machines.find(m => m.code === machineCode);
                const reason = this.stopReasons.find(r => r.code === stopReasonCode);
                return {
                  machineCode,
                  stopReasonCode,
                  machineDescription: machine?.description || '',
                  stopReasonDescription: reason?.description || ''
                };
              });
            } else {
              this.regra = {
                id: '',
                identification: '',
                activ: true,
                init: true,
                end: true,
                notify_after: 0,
                notify_every: 0,
                type: 'stop',
                priority: 'high',
                reason__codes: [],
                users: [],
              };
            }
          });
        });
      });
    });
  }

  adicionarPar() {
    const reason = this.stopReasons.find(r => r.code === this.selectedStopReason);
    const machine = this.machines.find(m => m.code === this.selectedMachine);

    if (!reason || !machine) {
      this.mensagemErro = 'Razão de parada ou máquina inválida.';
      return;
    }

    const existe = this.paresStopResource.some(
      p => p.stopReasonCode === reason.code && p.machineCode === machine.code
    );

    if (existe) {
      this.mensagemErro = 'Esta combinação já foi adicionada.';
      return;
    }

    this.paresStopResource.push({
      stopReasonCode: reason.code,
      stopReasonDescription: reason.description,
      machineCode: machine.code,
      machineDescription: machine.description
    });
    this.mensagemErro = '';
    this.cdr.markForCheck();
  }

  removerPar(par: any) {
    this.paresStopResource = this.paresStopResource.filter(p => p !== par);
  }

  atualizarUsuariosSelecionados(usuario: any) {
    if (usuario.selecionado) {
      this.usuariosSelecionados.push(usuario.id);
    } else {
      this.usuariosSelecionados = this.usuariosSelecionados.filter(id => id !== usuario.id);
    }
  }

  salvarRegra(goBakk: boolean = false) {
    this.regra.reason__codes = this.paresStopResource.map(
      p => `${p.machineCode}--${p.stopReasonCode}`
    );
    this.regra.users = this.usuariosSelecionados;

    const companyUid = localStorage.getItem('uid_server');
    if (this.regra.id) {
      // Atualiza a regra existente
      this.firestoreService.updateNotificationRule(companyUid!, this.regra.id, this.regra)
        .then(() => {
          console.log('Regra atualizada com sucesso!');
          if (goBakk) {
            window.history.back();
          }
        })
        .catch(error => {
          console.error('Erro ao atualizar a regra:', error);
        });
    } else {
      // Cria uma nova regra
      this.firestoreService.createNotificationRule(companyUid!, this.regra)
        .then(document => {
          console.log(document);
          console.log('Regra salva com sucesso!');
          if (goBakk) {
            window.history.back();
          }
        })
        .catch(error => {
          console.error('Erro ao salvar a regra:', error);
        });
    }
  }
}
