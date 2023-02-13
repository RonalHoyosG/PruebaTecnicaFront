import { Injectable } from '@angular/core';
import { ReporFilter, Report } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  public reports:Report[] = [
    {
      date:'01/02/2023',
      clientId:'1', 
      clientName:'Ronal Hoyos G', 
      accountId:'100001', 
      accountType:'Ahorros', 
      accountInitialBalance:1000000, 
      transactionState:true, 
      transactionValue:10000, 
      transactionResidue:1010000, 
    },
    {
      date:'01/02/2023',
      clientId:'1', 
      clientName:'Ronal Hoyos G', 
      accountId:'100002', 
      accountType:'Corriente', 
      accountInitialBalance:200000, 
      transactionState:true, 
      transactionValue:10000, 
      transactionResidue:210000, 
    },
    {
      date:'02/02/2023',
      clientId:'1', 
      clientName:'Ronal Hoyos G', 
      accountId:'100001', 
      accountType:'Ahorros', 
      accountInitialBalance:1000000, 
      transactionState:true, 
      transactionValue:20000, 
      transactionResidue:1030000, 
    },
    {
      date:'03/02/2023',
      clientId:'1', 
      clientName:'Ronal Hoyos G', 
      accountId:'100001', 
      accountType:'Ahorros', 
      accountInitialBalance:1000000, 
      transactionState:true, 
      transactionValue:-20000, 
      transactionResidue:1010000, 
    },
    {
      date:'01/02/2023',
      clientId:'2', 
      clientName:'Jose Torres', 
      accountId:'100002', 
      accountType:'Ahorros', 
      accountInitialBalance:20000, 
      transactionState:true, 
      transactionValue:10000, 
      transactionResidue:30000, 
    },
    {
      date:'03/02/2023',
      clientId:'2', 
      clientName:'Jose Torres', 
      accountId:'100002', 
      accountType:'Ahorros', 
      accountInitialBalance:20000, 
      transactionState:true, 
      transactionValue:50000, 
      transactionResidue:80000, 
    },
  ]

  constructor() { }

  search(item: Report, filter: ReporFilter) {
    return (item.date>=filter.startDate && 
            item.date<=filter.endDate && 
            String(item.clientId)==filter.clientId)? true : false
  }

  getReports(filter:ReporFilter): Report[]{
    return this.reports.filter(item => this.search(item, filter))
  }
}
