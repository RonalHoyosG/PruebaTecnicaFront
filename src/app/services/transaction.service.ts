import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../models/response.model';
import { ResponseGetTransactions, TransactionsFilter, TransactionsSave } from '../models/transaction.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(public http: HttpClient) { }

  getTrasactions(filter: TransactionsFilter): Observable<ResponseGetTransactions> {
    const url = `${base_url}/movimientos/obtener?fechaInicio=${filter.startDate}&fechaFin=${filter.endDate}&filtro=${filter.filter}`;
    return this.http.get<ResponseGetTransactions>(url);
  }

  saveTrasaction(transaction: TransactionsSave): Observable<Response> {
    const url = `${base_url}/movimientos/crear`;
    return this.http.post<Response>(url, transaction);
  }

  updateTrasaction(transaction: TransactionsSave): Observable<Response> {
    const url = `${base_url}/movimientos/actualizar`;
    return this.http.put<Response>(url, transaction);
  }

  deleteTrasaction(id: number) {
    const url = `${base_url}/movimientos/eliminar/${id}`;
    return this.http.delete<Response>(url);
  }
}
