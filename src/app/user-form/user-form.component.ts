import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';

export interface Usuario {
  id: string;
  email: string;
  senha: string;
  ativo: boolean;
  name: string;
  token: string;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  @Input() user?: Usuario;
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private firestoreService: FirestoreService) {
    this.userForm = this.fb.group({
      id: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      activ: [true],
      name: ['', Validators.required],
      token: ['']
    });
  }

  ngOnInit() {
    const userRecebido = history.state.user;
    if (userRecebido) {
      this.userForm.patchValue(userRecebido);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      var companyUid = localStorage.getItem('uid_server') || '';
      this.firestoreService.upsertUserToCompany(companyUid, this.userForm.value).then(() => {
        alert('Usuário salvo com sucesso!');
        window.history.back();
      });
    }
  }
}
