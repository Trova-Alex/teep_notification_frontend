import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DjangoApiService } from '../../services/django-api.service';
import { FirestoreService } from '../../services/firestore.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Gerenciamento de Itens</h2>

      <div class="source-selector">
        <button
          [class.active]="dataSource === 'django'"
          (click)="setDataSource('django')">
          Django API
        </button>
        <button
          [class.active]="dataSource === 'firestore'"
          (click)="setDataSource('firestore')">
          Firebase Firestore
        </button>
      </div>

      <div class="actions">
        <button (click)="showCreateForm()" class="btn-primary">+ Novo Item</button>
      </div>

      <div *ngIf="loading" class="loading">Carregando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <table *ngIf="!loading && items.length > 0">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td>{{ item.nome }}</td>
            <td>{{ item.descricao }}</td>
            <td>{{ item.preco | currency:'BRL' }}</td>
            <td>{{ item.categoria }}</td>
            <td>
              <button (click)="editItem(item)" class="btn-edit">Editar</button>
              <button (click)="deleteItemConfirm(item)" class="btn-delete">Deletar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && items.length === 0" class="empty-state">
        Nenhum item encontrado
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .source-selector { margin: 20px 0; }
    .source-selector button {
      padding: 10px 20px;
      margin-right: 10px;
      border: 2px solid #007bff;
      background: white;
      cursor: pointer;
    }
    .source-selector button.active {
      background: #007bff;
      color: white;
    }
    .actions { margin: 20px 0; }
    .btn-primary {
      padding: 10px 20px;
      background: #28a745;
      color: white;
      border: none;
      cursor: pointer;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: bold; }
    .btn-edit {
      padding: 5px 10px;
      background: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      margin-right: 5px;
    }
    .btn-delete {
      padding: 5px 10px;
      background: #dc3545;
      color: white;
      border: none;
      cursor: pointer;
    }
    .loading, .error, .empty-state {
      padding: 20px;
      text-align: center;
    }
    .error { color: #dc3545; }
  `]
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];
  loading = false;
  error = '';
  dataSource: 'django' | 'firestore' = 'django';

  constructor(
    private djangoService: DjangoApiService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  setDataSource(source: 'django' | 'firestore') {
    this.dataSource = source;
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.error = '';

    if (this.dataSource === 'django') {
      //this.djangoService.getItems().subscribe({
      //  next: (data) => {
      //    this.items = data;
      //    this.loading = false;
      //  },
      //  error: (err) => {
      //    this.error = 'Erro ao carregar itens do Django: ' + err.message;
      //    this.loading = false;
      //  }
      //});
    } else {
      this.firestoreService.getItems().subscribe({
        next: (data) => {
          this.items = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar itens do Firestore: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  showCreateForm() {
    // Implementar navegação para formulário ou modal
    console.log('Abrir formulário de criação');
  }

  editItem(item: Item) {
    // Implementar navegação para formulário de edição
    console.log('Editar item:', item);
  }

  deleteItemConfirm(item: Item) {
    if (confirm(`Deseja realmente deletar "${item.nome}"?`)) {
      this.deleteItem(item);
    }
  }

  deleteItem(item: Item) {
    if (!item.id) return;

    if (this.dataSource === 'django') {
      //this.djangoService.deleteItem(item.id).subscribe({
      //  next: () => {
      //    this.loadItems();
      //  },
      //  error: (err) => {
      //    this.error = 'Erro ao deletar item: ' + err.message;
      //  }
      //});
    } else {
      //this.firestoreService.deleteItem(item.id).then(() => {
      //  this.loadItems();
      //}).catch(err => {
      //  this.error = 'Erro ao deletar item: ' + err.message;
      //});
    }
  }
}
