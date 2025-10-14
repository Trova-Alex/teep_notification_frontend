
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StopReason } from '../models/stop-reason';
import { Machine } from '../models/machine';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class DjangoApiService {
  private apiUrl = environment.djangoApiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      // Adicione token de autenticação se necessário
      // 'Authorization': `Bearer ${token}`
    });
  }

  // GET - Listar todos os itens
  getStopReasons(): Observable<StopReason[]> {
    return this.http.get<StopReason[]>(`${this.apiUrl}/stop-reason/`, {
      headers: this.getHeaders()
    });
  }

  // GET - Listar todos os itens
  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(`${this.apiUrl}/resource/`, {
      headers: this.getHeaders()
    });
  }

  getCompany(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/company/`, {
      headers: this.getHeaders()
    });
  }

  // DELETE - Deletar item
  //deleteItem(id: string): Observable<void> {
  //  return this.http.delete<void>(`${this.apiUrl}/items/${id}/`, {
  //    headers: this.getHeaders()
  //  });
  //}
}
