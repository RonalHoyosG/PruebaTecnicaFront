import { Injectable } from '@angular/core';
import { Client, ResponseGetClient } from '../models/client.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Response } from '../models/response.model';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(public http: HttpClient) { }

  getClients(filter: string): Observable<ResponseGetClient> {
    const url = `${base_url}/clientes/obtener?filtro=${filter}`;
    return this.http.get<ResponseGetClient>(url);
  }

  saveClient(client: Client): Observable<Response> {
    const url = `${base_url}/clientes/crear`;
    return this.http.post<Response>(url, client);
  }

  updateClient(client: Client): Observable<Response> {
    const url = `${base_url}/clientes/actualizar`;
    return this.http.put<Response>(url, client);
  }

  deleteClient(id?: number): Observable<Response> {
    const url = `${base_url}/clientes/eliminar/${id}`;
    return this.http.delete<Response>(url);
  }

}