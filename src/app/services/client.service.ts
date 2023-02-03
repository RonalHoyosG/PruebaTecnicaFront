import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  public clients:Client[] = [
    {
      id: 1,
      password: '__1223',
      status: true,
      person: {
        id:1,
        names:'Ronal Hoyos G',
        gender:'M',
        age:'40',
        identification:'8888855',
        address:'Bogotá',
        phone:'65835241'
      }
    }
  ]

  constructor() { }

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
