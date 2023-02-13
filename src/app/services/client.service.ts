import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(public http: HttpClient) { }
  //constructor() { }

  public clients:Client[] = [
    {
      id: 1,
      password: '__122343',
      status: true,
      person: {
        id:1,
        names:'Ronal Hoyos G',
        gender:'M',
        age:'40',
        identification:8888855,
        address:'Bogotá Colombia',
        phone:'65835241'
      }
    },
    {
      id: 2,
      password: '__12343rf23',
      status: true,
      person: {
        id:1,
        names:'Jose Torres',
        gender:'M',
        age:'42',
        identification:34554582,
        address:'Bogotá Colombia',
        phone:'65835241'
      }
    }
  ]



  getDemoTest() {
    const url = `${base_url}/clientes/obtener?filtro=`;
    // console.log({url})
    return this.http.get(base_url).pipe(
      map((resp: any) => resp)
    );
  }

  search(item: Client, filter: string) {
    if (item.person.names.toLowerCase().indexOf(filter.toLowerCase()) > -1
      ||
      item.person.phone.toString().toLowerCase().indexOf(filter.toString().toLowerCase()) > -1
      ||
      item.person.identification.toString().toLowerCase().indexOf(filter.toString().toLowerCase()) > -1
    ) { return true; } 
    else { return false };
  }

  getClients(filter:string): Client[]{
    if(filter.length>0){
      return this.clients.filter(item => this.search(item, filter))
    }
    return this.clients
  }

  saveClient(client:Client){
    this.clients.push({...client});
  }

  updateClient(client:Client){
    this.clients = this.clients.map((item) => {
      return (item.id===client.id)? client:item;
    });
  }
  
  deleteClient(id:number){
    this.clients = this.clients.filter((item) => {
      return item.id!==id;
    });
  }

}
