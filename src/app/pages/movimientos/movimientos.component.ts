import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Account } from 'src/app/models/account.model';
import { Transaction, TransactionsFilter, TransactionsSave } from 'src/app/models/transaction.model';
import { AccountService } from 'src/app/services/account.service';
import { TransactionService } from 'src/app/services/transaction.service';

import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html'
})
export class MovimientosComponent implements OnInit, AfterViewInit {

  miFormulario: FormGroup = this.fb.group({
    accountId: [, Validators.required],
    type: [, Validators.required],
    value: [, Validators.required],
    status: [, [Validators.required]]
  })

  constructor(private fb: FormBuilder, private accountService: AccountService, private transationService: TransactionService) { }

  public accounts: Account[] = [];
  public selectAccount!: Account;
  public transactions: Transaction[] = [];
  public selectTransaction!: TransactionsSave;
  public transactiontDetail: string = '';
  public confirmMessage: string = '';
  public saveError: string = '';
  public state: 'show' | 'new' | 'edit' | 'delete' = 'show';
  datePipe = new DatePipe("es-CO");
  currentDate: string | null = '';
  today: number = Date.now();

  reportTitle: string = 'Movimientos';
  reportHeaders = ['Fecha', 'Tipo', 'Cuenta', 'Valor', 'Saldo', 'Cliente', 'Identificación', 'Estado'];
  reportData: any;
  reportFilters = '';

  @ViewChild('filterStartDate') filterStartDate!: ElementRef;
  @ViewChild('filterEndDate') filterEndDate!: ElementRef;
  @ViewChild('txtFilter') txtFilter!: ElementRef;
  @ViewChild('spanError') spanError!: ElementRef;



  ngOnInit(): void {
    this.accountService.getAccounts('').
      subscribe(resp => {
        this.accounts = resp.data;
      });
  }

  ngAfterViewInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    const _startDate = new Date(this.filterStartDate.nativeElement.value);
    const _endDate = new Date(this.filterEndDate.nativeElement.value);
    this.spanError.nativeElement.innerHTML = "";
    if (_startDate > _endDate) {
      this.spanError.nativeElement.innerHTML = "La fecha inicial no puede ser mayor que la fecha final";
      return;
    }

    const startDate = this.filterStartDate.nativeElement.value || '2023/01/01';
    const endDate = this.filterEndDate.nativeElement.value || '2023/12/01';
    const filters: TransactionsFilter = { filter: this.txtFilter.nativeElement.value, startDate, endDate }

    this.saveError = '';
    this.miFormulario.reset();
    this.state = 'show';
    this.transationService.getTrasactions(filters).
      subscribe(resp => {
        this.transactions = resp.data;
        this.reportFilters = ` \nFiltro: ${this.txtFilter.nativeElement.value}\n FechaInicial: ${startDate}\n FechaFinal: ${endDate}`;
        this.extractData();
      });

  }


  changeAccount() {
    this.selectAccount = this.accounts.filter(item => item.id == this.miFormulario.value.accountId)[0];
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

  selectItem(transaction: Transaction) {
    this.miFormulario.reset({
      type: transaction.type,
      accountId: transaction.account.id,
      value: transaction.value,
      status: transaction.status
    })
    this.selectTransaction = this.miFormulario.value;
    this.selectTransaction.id = transaction.id;
  }

  showEdit(transaction: Transaction) {
    this.selectItem(transaction);
    this.state = 'edit';
  }

  showDelete(transaction: Transaction) {
    this.selectItem(transaction);
    this.selectTransaction.id = transaction.id,

      this.transactiontDetail = transaction.created_at + ' - ' + transaction.type + ' - (' + transaction.value + ') - ' + transaction.account.accountNumber + ' - ' + transaction.account.client.person.names;
    this.state = 'delete';
    this.confirmMessage = '¿Está seguro de que quiere eliminar el movimiento ' + this.transactiontDetail + '?';
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

    let transactionValue = (this.miFormulario.value.type == 'RETIRO' && this.miFormulario.value.value > 0) ? this.miFormulario.value.value * -1 : this.miFormulario.value.value;
    if (this.state === 'new') {
      let newTransaction = this.selectTransaction = {
        type: this.miFormulario.value.type,
        accountId: this.selectAccount.id || 0,
        value: transactionValue,
        status: this.miFormulario.value.status
      }
      newTransaction = newTransaction as TransactionsSave;

      this.transationService.saveTrasaction(newTransaction)
        .subscribe(resp => {
          this.loadTransactions();
        }, (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.saveError = error.error.message;
        })
    }

    if (this.state === 'edit') {
      this.selectTransaction.type = this.miFormulario.value.type,
        this.selectTransaction.accountId = this.selectAccount.id || 0;
      this.selectTransaction.value = transactionValue;
      this.selectTransaction.status = this.miFormulario.value.status;

      this.transationService.updateTrasaction(this.selectTransaction)
        .subscribe(resp => {
          this.loadTransactions();
        }, (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.saveError = error.error.message;
        })
    }
  }

  delete() {
    this.transationService.deleteTrasaction(this.selectTransaction.id || 0)
      .subscribe(resp => {
        this.loadTransactions();
      }, (error: HttpErrorResponse) => {
        console.log(error.error.message);
        this.saveError = error.error.message;
      });
  }

  extractData() {
    this.reportData = this.transactions.map(row => [row.created_at, row.type, row.account.accountNumber, row.value, row.balance, row.account.client.person.names, row.account.client.person.identification, row.status])
  }

}
