import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AccountShow } from 'src/app/models/account.model';
import { TransactionsFilter, TransactionsShow } from 'src/app/models/transaction.model';
import { AccountService } from 'src/app/services/account.service';
import { TransactionService } from 'src/app/services/transaction.service';

import { PdfMakeWrapper, Txt, Table } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html'
})
export class MovimientosComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    accountId: [, Validators.required],
    type: [, Validators.required],
    value: [, Validators.required],
    status: [, [Validators.required]]
  })

  constructor(private fb: FormBuilder, private accountService: AccountService, private transationService: TransactionService) { }

  public accounts: AccountShow[] = [];
  public selectAccount!: AccountShow;
  public transactions: TransactionsShow[] = [];
  public selectTransaction!: TransactionsShow;
  public transactiontDetail: string = '';
  public confirmMessage: string = '';
  public state: 'show' | 'new' | 'edit' | 'delete' = 'show';
  datePipe = new DatePipe("es-CO");
  currentDate: string | null = '';
  today: number = Date.now();

  reportTitle:string='Movimientos';
  reportHeaders=['Fecha','Tipo','Cuenta','Valor','Saldo','Cliente','Identificación','Estado'];
  reportData:any;
  reportFilters='';

  @ViewChild('filterStartDate') filterStartDate!: ElementRef;
  @ViewChild('filterEndDate') filterEndDate!: ElementRef;
  @ViewChild('txtFilter') txtFilter!: ElementRef;
  @ViewChild('spanError') spanError!: ElementRef;



  ngOnInit(): void {
    this.accounts = this.accountService.getAccounts('');
  }

  loadTransactions() {
    const _startDate = new Date(this.filterStartDate.nativeElement.value);
    const _endDate = new Date(this.filterEndDate.nativeElement.value);
    this.spanError.nativeElement.innerHTML ="";
    if(_startDate > _endDate){
      this.spanError.nativeElement.innerHTML ="La fecha inicial no puede ser mayor que la fecha final";
      return;
    }
    
    const startDate = this.datePipe.transform(this.filterStartDate.nativeElement.value, 'dd/MM/yyyy') || '01/01/2023';
    const endDate = this.datePipe.transform(this.filterEndDate.nativeElement.value, 'dd/MM/yyyy') || '01/01/2023' ;
    const filters: TransactionsFilter={filter:this.txtFilter.nativeElement.value,startDate, endDate}
    this.transactions = this.transationService.getTrasactions(filters);
    this.reportFilters = ` \nFiltro: ${this.txtFilter.nativeElement.value}\n FechaInicial: ${startDate}\n FechaFinal: ${endDate}`;
    this.extractData();
  }


  changeAccount(){
    this.selectAccount= this.accounts.filter(item => item.id == this.miFormulario.value.accountId)[0];
  }

  showNew() {
    this.state = 'new';
    this.miFormulario.reset({
      accountId: '',
      type: '',
      value: '',
      status: false,
    })
  }

  showEdit(transaction: TransactionsShow) {
    this.selectTransaction = transaction;
    this.miFormulario.reset({
      id: transaction.id,
      date: transaction.date,
      type: transaction.type,
      accountId: transaction.accountId,
      accountNumber: transaction.accountNumber,
      value: transaction.value,
      residue: transaction.residue,
      status: transaction.status,
      clientName: transaction.clientName,
      clientIdentification: transaction.clientIdentification
    })
    this.state = 'edit';
  }

  showDelete(transaction: TransactionsShow) {
    this.state = 'delete';
    this.selectTransaction = transaction;
    this.transactiontDetail = transaction.date +' - '+ transaction.type+' - ('+ transaction.value +') - '+transaction.accountNumber + ' - ' + transaction.clientName;
    this.confirmMessage='¿Está seguro de que quiere eliminar el movimiento '+this.transactiontDetail+'?';
  }

  modalHide() {
    this.state = 'show';
  }

  hasError(field: string) {
    return this.miFormulario.controls[field].errors
      && this.miFormulario.controls[field].touched;
  }

  save() {
    this.changeAccount();
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }
   
    let transactionValue = (this.miFormulario.value.type=='Retiro' && this.miFormulario.value.value>0) ? this.miFormulario.value.value*-1 : this.miFormulario.value.value;
    if (this.state === 'new') {
      this.selectTransaction = {
        id: Math.floor(Math.random() * 999999),
        date:this.datePipe.transform(new Date(), 'dd/MM/yyyy') || '01/01/2023',
        type:this.miFormulario.value.type,
        accountId:this.selectAccount.id,
        accountNumber: parseInt(this.selectAccount.accountNumber),
        value: transactionValue,
        residue: this.selectAccount.balance + transactionValue ,
        status:this.miFormulario.value.status,
        clientName: this.selectAccount.clientName,
        clientIdentification: this.selectAccount.clientIdentification
      }
      this.transationService.saveTrasaction(this.selectTransaction);
    }

    if (this.state === 'edit') {
      this.selectTransaction.type =this.miFormulario.value.type,
      this.selectTransaction.accountId = this.selectAccount.id;
      this.selectTransaction.accountNumber = parseInt(this.selectAccount.accountNumber);
      this.selectTransaction.value = transactionValue;
      this.selectTransaction.residue = this.selectAccount.balance + transactionValue;
      this.selectTransaction.status = this.miFormulario.value.status;
      this.selectTransaction.clientName = this.selectAccount.clientName;
      this.selectTransaction.clientIdentification = this.selectAccount.clientIdentification;
      this.transationService.updateTrasaction(this.selectTransaction);
    }
    this.miFormulario.reset();
    this.state = 'show';
    this.loadTransactions();
  }

  delete() {
    this.transationService.deleteTrasaction(this.selectTransaction.id);
    this.state = 'show';
    this.loadTransactions();
  }

  extractData() {
    this.reportData = this.transactions.map(row => [row.date,row.type,row.accountNumber,row.value,row.residue,row.clientName,row.clientIdentification,row.status])
  }

}
