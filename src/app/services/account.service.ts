import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account, AccountSave, AccountShow, ResponseGetAccount } from '../models/account.model';
import { Response } from '../models/response.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(public http: HttpClient) { }

  getAccounts(filter: string): Observable<ResponseGetAccount> {
    const url = `${base_url}/cuentas/obtener?filtro=${filter}`;
    return this.http.get<ResponseGetAccount>(url);
  }

  saveAccount(account: AccountSave): Observable<Response> {
    const url = `${base_url}/cuentas/crear`;
    return this.http.post<Response>(url, account);
  }

  updateAccount(account: AccountSave): Observable<Response> {
    const url = `${base_url}/cuentas/actualizar`;
    return this.http.put<Response>(url, account);
  }

  deleteAccount(id?: number): Observable<Response> {
    const url = `${base_url}/cuentas/eliminar/${id}`;
    return this.http.delete<Response>(url);
  }
}
