import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { AccountShow } from 'src/app/models/account.model';
import { TransactionsShow } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';

import { MovimientosComponent } from './movimientos.component';
import localeEs from '@angular/common/locales/es-CO';
import { DatePipe, registerLocaleData } from '@angular/common';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
registerLocaleData(localeEs);

const transaction:TransactionsShow =
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
  }
const transactions:TransactionsShow[] = [
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

const accountShow: AccountShow = {
  id: 1,
  accountNumber: '100001',
  type: 'Ahorros',
  initialBalance: 100000,
  status: true,
  clientId:1,
  clientName:'Ronal Hoyos G',
  clientIdentification:8888855,
  balance:1010000
}

describe('MovimientosComponent', () => {
  let component: MovimientosComponent;
  let fixture: ComponentFixture<MovimientosComponent>;
  let transactionService: TransactionService;
  let httpTestingController: HttpTestingController;
  const fb = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimientosComponent, PdfComponent, ConfirmComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers:[TransactionService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MovimientosComponent);
    transactionService = fixture.debugElement.injector.get(TransactionService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe de crear un formulario de moviminetos con sus campos:[accountId, type, value, status]', () => {

    expect(component.miFormulario.contains('accountId')).toBeTruthy();
    expect(component.miFormulario.contains('type')).toBeTruthy();
    expect(component.miFormulario.contains('value')).toBeTruthy();
    expect(component.miFormulario.contains('status')).toBeTruthy();

  });

  it('El accountId debe de ser obligatorio', () => {

    const control = component.miFormulario.get('accountId');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  });

  it('El type debe de ser obligatorio', () => {

    const control = component.miFormulario.get('type');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  });

  it('El value debe de ser obligatorio', () => {

    const control = component.miFormulario.get('value');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  });

  it('El status debe de ser obligatorio', () => {

    const control = component.miFormulario.get('status');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  });

  it('Validar método showNew', () => {

    component.showNew();
    expect(component.state).toBe('new');

  });

  it('Validar método showNew', () => {

    component.showNew();
    expect(component.state).toBe('new');

  });

  it('Validar método showEdit', () => {

    component.showEdit(transaction); 
    expect(component.state).toBe('edit');
    expect(component.miFormulario.value.value).toEqual(transaction.value);

  });

  it('Validar método showDelete', () => {

    component.showDelete(transaction);
    expect(component.selectTransaction).toBe(transaction);

  });

  it('Validar método modalHide', () => {

    component.modalHide();
    expect(component.state).toBe('show')

  });

  it('loadTransactions: Debe de cargar las transacciones', () => {
    let filters = {filter:'',startDate:'01/02/2023',endDate:'01/03/2023'}
    spyOn(transactionService, 'getTrasactions').and.callFake((filters) => {
      return transactions;
    });
    
    component.filterStartDate.nativeElement.value='01/02/2023';
    component.filterEndDate.nativeElement.value='01/03/2023';
    component.txtFilter.nativeElement.value='';
    component.loadTransactions();

    expect(component.transactions.length).toBeGreaterThan(0);
    expect(component.transactions).toEqual(transactions);

  });

  it('Debe de llamar al servidor para guardar un movimiento', () => {

    component.datePipe = new DatePipe("es-CO");
    const spy = spyOn(transactionService, 'saveTrasaction').and.callFake(() => {
      return true;
    });

    component.selectAccount = accountShow;
    component.miFormulario.reset({
      type: 'Depósito',
      value: 100000,
      status: true,
      accountId:1,
    });
    component.state = 'new';
    component.save();

    expect(spy).toHaveBeenCalled();

  });

  it('Debe de llamar al servidor para actualizar un movimineto', () => {

    const spy = spyOn(transactionService, 'updateTrasaction').and.callFake(transaction => {
      return true;
    });

    component.showEdit(transaction);
    component.state = 'edit';
    component.save();

    expect(spy).toHaveBeenCalled();

  });

  it('Debe de llamar al servidor para eliminar un Movimiento', () => {

    const spy = spyOn(transactionService, 'deleteTrasaction').and.callFake(transaction => {
      return true;
    });

    component.showDelete(transaction);
    component.delete();

    expect(spy).toHaveBeenCalled();

  });

});