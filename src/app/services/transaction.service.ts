import { Injectable } from '@angular/core';
import { TransactionsFilter, TransactionsShow } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  public transactions:TransactionsShow[] = [
    {
      id: 1,
      date: '01/02/2023',
      type: 'Depósito',
      accountId: 1,
      accountNumber: 100001,
      value: 100000,
      residue: 1100000,
      status: true,
      clientName: 'Ronal Hoyos G',
      clientIdentification: 8888855
    },
    {
      id: 2,
      date: '01/02/2023',
      type: 'Retiro',
      accountId: 1,
      accountNumber: 100001,
      value: -100000,
      residue: 1100000,
      status: true,
      clientName: 'Ronal Hoyos G',
      clientIdentification: 8888855
    },
    {
      id: 3,
      date: '02/02/2023',
      type: 'Depósito',
      accountId: 2,
      accountNumber: 100002,
      value: 200000,
      residue: 230000,
      status: true,
      clientName: 'Ronal Hoyos G',
      clientIdentification: 8888855
    },
    
  ]

  constructor() { }

  search(item: TransactionsShow, filter: TransactionsFilter) {
    return (
      item.date >= filter.startDate &&
      item.date <= filter.endDate && ((filter.filter.length==0)?true:
        (item.clientName.toLowerCase().indexOf(filter.filter.toString().toLowerCase()) > -1
        ||
        item.clientIdentification.toString().indexOf(filter.filter.toString().toLowerCase()) > -1
        ||
        item.accountNumber.toString().indexOf(filter.filter.toString().toLowerCase()) > -1)
      )
    ) ? true : false;
  }

  getTrasactions(filter:TransactionsFilter): TransactionsShow[]{
    return this.transactions.filter(item => this.search(item, filter))
  }

  saveTrasaction(transaction:TransactionsShow){
    this.transactions.push({...transaction});
  }

  /*TODO se debe cambiar la clase transactionsShow cuando se tetenga el back*/
  updateTrasaction(transaction:TransactionsShow){
    this.transactions = this.transactions.map((item) => {
      return (item.id===transaction.id)? transaction:item;
    });
  }
  
  deleteTrasaction(id:number){
    this.transactions = this.transactions.filter((item) => {
      return item.id!==id;
    });
  }
}
