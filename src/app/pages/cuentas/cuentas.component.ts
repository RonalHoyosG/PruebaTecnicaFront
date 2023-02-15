import { Component, ViewChild, ElementRef } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { PdfMakeWrapper, Txt, Table } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Account, AccountSave, AccountShow } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';
import { HttpErrorResponse } from '@angular/common/http';


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
  public accounts: Account[] = [];
  public selectAccount!: AccountSave;
  public clientNames: string = '';
  public confirmMessage: string = '';
  public saveError: string = '';
  public state: 'show' | 'new' | 'edit' | 'delete' = 'show';
  datePipe = new DatePipe("es-CO");
  currentDate: string | null = '';

  reportTitle: string = 'Cuentas';
  reportHeaders = ['Cuenta', 'Tipo', 'Saldo Incial', 'Saldo Actual', 'Cliente', 'Identificació'];
  reportData: any;
  reportFilters = '';


  @ViewChild('txtFilter') txtFilter!: ElementRef;



  ngOnInit(): void {
    this.loadClients();
    this.loadAccounts('');
  }

  loadClients() {
    this.clientService.getClients('').
      subscribe(resp => {
        this.clients = resp.data;
      });
  }

  loadAccounts(filter: string) {
    this.saveError = '';
    this.miFormulario.reset();
    this.state = 'show';
    this.accountService.getAccounts(filter).
      subscribe(resp => {
        this.accounts = resp.data;
        this.reportFilters = ` \nFiltro: ${filter}\n`;
        this.extractData();
      });
  }


  changeClient() {
    this.selectClient = this.clients.filter(item => item.id == this.miFormulario.value.clientId)[0];
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

  selectAcount(account: Account){
    this.miFormulario.reset({
      type: account.type,
      status: account.status,
      accountNumber: account.accountNumber,
      initialBalance: account.initialBalance,
      clientId: account.client.id,
    })
    this.selectAccount = this.miFormulario.value;
    this.selectAccount.id = account.id;
  }

  showEdit(account: Account) {
   this.selectAcount(account);
    this.state = 'edit';
  }

  showDelete(account: Account) {
    this.selectAcount(account);
    this.state = 'delete';
    this.clientNames = account.accountNumber + ' - ' + account.client.person.names;
    this.confirmMessage = '¿Está seguro de que quiere eliminar la cuenta ' + this.clientNames + '?';
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
      let newAccount = {
        accountNumber: this.miFormulario.value.accountNumber,
        type: this.miFormulario.value.type,
        status: this.miFormulario.value.status,
        initialBalance: this.miFormulario.value.initialBalance,
        clientId: this.miFormulario.value.clientId,
      }
      newAccount = newAccount as AccountSave;
      this.accountService.saveAccount(newAccount)
        .subscribe(resp => {
          this.loadAccounts(this.txtFilter.nativeElement.value);
        }, (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.saveError = error.error.message;
        })
    }
    if (this.state === 'edit') {
      this.selectAccount.accountNumber = this.miFormulario.value.accountNumber,
        this.selectAccount.type = this.miFormulario.value.type,
        this.selectAccount.status = this.miFormulario.value.status,
        this.selectAccount.initialBalance = this.miFormulario.value.initialBalance,
        this.selectAccount.clientId = this.miFormulario.value.clientId,

        this.accountService.updateAccount(this.selectAccount)
          .subscribe(resp => {
            this.loadAccounts(this.txtFilter.nativeElement.value);
          }, (error: HttpErrorResponse) => {
            this.saveError = error.error.message;
          })
    }
  }

  delete() {
    this.accountService.deleteAccount(this.selectAccount.id || 0)
      .subscribe(resp => {
        this.loadAccounts(this.txtFilter.nativeElement.value);
      }, (error: HttpErrorResponse) => {
        this.saveError = error.error.message;
      })
  }

  extractData() {
    this.reportData = this.accounts.map(row => [row.accountNumber, row.type, row.initialBalance, row.currentBalance, row.client.person.names, row.client.person.identification])
  }

}
