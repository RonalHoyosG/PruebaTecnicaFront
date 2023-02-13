import { Component, ViewChild, ElementRef } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { PdfMakeWrapper, Txt, Table } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { AccountShow } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';


@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html'
})
export class CuentasComponent {

  miFormulario: FormGroup = this.fb.group({
    accountNumber: [, [Validators.required, Validators.minLength(6)]],
    type: [, Validators.required],
    initialBalance: [, [Validators.required, Validators.min(100)]],
    clientId: [, Validators.required],
    status: [, [Validators.required]]
  })

  constructor(private fb: FormBuilder, private clientService: ClientService, private accountService: AccountService) { }

  public clients: Client[] = [];
  public selectClient!: Client;
  public accounts: AccountShow[] = [];
  public selectAccount!: AccountShow;
  public clientNames: string = '';
  public confirmMessage: string = '';
  public state: 'show' | 'new' | 'edit' | 'delete' = 'show';
  datePipe = new DatePipe("es-CO");
  currentDate: string | null = '';

  reportTitle:string='Cuentas';
  reportHeaders=['Cuenta', 'Tipo', 'Saldo Incial', 'Saldo Actual', 'Cliente', 'Identificació'];
  reportData:any;
  reportFilters='';
  

  @ViewChild('txtFilter') txtFilter!: ElementRef;

  ngOnInit(): void {
    this.clients = this.clientService.getClients('');
    this.loadAccounts('');
  }

  loadAccounts(filter: string) {
    this.accounts = this.accountService.getAccounts(filter);
    this.reportFilters = ` \nFiltro: ${filter}\n`;
    this.extractData();
  }


  changeClient(){
    this.selectClient= this.clients.filter(item => item.id == this.miFormulario.value.clientId)[0];
  }

  showNew() {
    this.state = 'new';
    this.miFormulario.reset({
      accountNumber: '',
      type: '',
      age: '',
      initialBalance: '',
      clientId: '',
      status: false,
    })
  }

  showEdit(account: AccountShow) {
    this.selectAccount = account;
    this.miFormulario.reset({
      id: account.id,
      type: account.type,
      status: account.status,
      accountNumber: account.accountNumber,
      initialBalance: account.initialBalance,
      balance: account.balance,
      clientId: account.clientId,
      clientName: account,
      clientIdentification: account
    })
    this.state = 'edit';
  }

  showDelete(account: AccountShow) {
    this.state = 'delete';
    this.selectAccount = account;
    this.clientNames = account.accountNumber + ' - ' + account.clientName;
    this.confirmMessage='¿Está seguro de que quiere eliminar la cuenta '+this.clientNames+'?';
  }

  modalHide() {
    this.state = 'show';
  }

  hasError(campo: string) {
    return this.miFormulario.controls[campo].errors
      && this.miFormulario.controls[campo].touched;
  }

  save() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    if (this.state === 'new') {
      this.selectAccount = {
        id: Math.floor(Math.random() * 999999),
        accountNumber: this.miFormulario.value.accountNumber,
        type: this.miFormulario.value.type,
        status: this.miFormulario.value.status,
        initialBalance: this.miFormulario.value.initialBalance,
        balance: this.miFormulario.value.initialBalance,
        clientId: this.miFormulario.value.clientId,
        clientName: this.selectClient.person.names,
        clientIdentification: this.selectClient.person.identification
      }
      this.accountService.saveAccount(this.selectAccount);
    }
    if (this.state === 'edit') {
      this.selectAccount.accountNumber= this.miFormulario.value.accountNumber,
      this.selectAccount.type= this.miFormulario.value.type,
      this.selectAccount.status= this.miFormulario.value.status,
      this.selectAccount.initialBalance= this.miFormulario.value.initialBalance,
      this.selectAccount.balance= this.miFormulario.value.initialBalance,
      this.selectAccount.clientId= this.miFormulario.value.clientId,
      this.selectAccount.clientName= this.selectClient.person.names,
      this.selectAccount.clientIdentification= this.selectClient.person.identification
      
      this.accountService.updateAccount(this.selectAccount);
    }
    this.miFormulario.reset();
    this.state = 'show';
    this.loadAccounts(this.txtFilter.nativeElement.value);
  }

  delete() {
    this.accountService.deleteAccount(this.selectAccount.id);
    this.state = 'show';
    this.loadAccounts(this.txtFilter.nativeElement.value);
  }

  extractData() {
    this.reportData = this.accounts.map(row => [row.accountNumber, row.type, row.initialBalance, row.balance, row.clientName, row.clientIdentification])
  }

}
