import { Injectable } from '@angular/core';
import { Account, AccountShow } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public accounts:AccountShow[] = [
    {
      id: 1,
      accountNumber: '100001',
      type: 'Ahorros',
      initialBalance: 100000,
      status: true,
      clientId:1,
      clientName:'Ronal Hoyos G',
      clientIdentification:8888855,
      balance:1010000
    },
    {
      id: 2,
      accountNumber: '100002',
      type: 'Corriente',
      initialBalance: 20000,
      status: true,
      clientId:1,
      clientName:'Ronal Hoyos G',
      clientIdentification:8888855,
      balance:30000
    },
    {
      id: 3,
      accountNumber: '100003',
      type: 'Ahorros',
      initialBalance: 20000,
      status: true,
      clientId:2,
      clientName:'Jose Torres',
      clientIdentification:34554582,
      balance:80000
    }
    

  ]

  constructor() { }

  search(item: AccountShow, filter: string) {
    return (item.clientName.toLowerCase().indexOf(filter.toLowerCase()) > -1
      ||
      item.clientIdentification.toString().toLowerCase().indexOf(filter.toString().toLowerCase()) > -1
      ||
      item.accountNumber.toString().toLowerCase().indexOf(filter.toString().toLowerCase()) > -1
    ) ? true : false;
  }

  getAccounts(filter:string): AccountShow[]{
    if(filter.length>0){
      return this.accounts.filter(item => this.search(item, filter))
    }
    return this.accounts
  }

  /*TODO: se debe cambiar por Account, para el ejemplo local se debe crear AccountShow */
  saveAccount(client:AccountShow){
    this.accounts.push({...client});
  }

  /*TODO: se debe cambiar por Account, para el ejemplo local se debe crear AccountShow */
  updateAccount(accountShow:AccountShow){
    this.accounts = this.accounts.map((item) => {
      return (item.id===accountShow.id)? accountShow:item;
    });
  }
  
  deleteAccount(id:number){
    this.accounts = this.accounts.filter((item) => {
      return item.id!==id;
    });
  }
}
