import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { Account } from 'src/app/models/account.model';
import { ResponseGetTransactions, Transaction, TransactionsSave } from 'src/app/models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';

import { MovimientosComponent } from './movimientos.component';
import localeEs from '@angular/common/locales/es-CO';
import { DatePipe, registerLocaleData } from '@angular/common';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { Observable } from 'rxjs';
import { Response } from 'src/app/models/response.model';
import { ClientService } from 'src/app/services/client.service';
registerLocaleData(localeEs);

const transaction: Transaction = {
  "created_at":'2020-02-01',
  "id": 3,
  "type": "RETIRO",
  "value": -100000.00,
  "status": true,
  "account": {
      "id": 3,
      "accountNumber": "325464",
      "type": "AHORROS",
      "currentBalance": 100000.00,
      "initialBalance": 200000.00,
      "status": true,
      "client": {
          "id": 4,
          "password": "3242esdfsdf",
          "status": true,
          "person": {
              "id": 4,
              "names": "Ronal David Hoyos",
              "gender": "M",
              "age": "43",
              "identification": 34252354,
              "address": "Cll 70 No 97-75",
              "phone": "65787878"
          }
      }
  }
}

const transactionSave: TransactionsSave = {
  "accountId":3,
  "type": "RETIRO",
  "value": -100000.00,
  "status": true,
  "id": 3,
}

const transactions: Transaction[] = [
  {
    "created_at":'2020-02-01',
    "id": 3,
    "type": "RETIRO",
    "value": -100000.00,
    "status": true,
    "account": {
        "id": 3,
        "accountNumber": "325464",
        "type": "AHORROS",
        "currentBalance": 100000.00,
        "initialBalance": 200000.00,
        "status": true,
        "client": {
            "id": 4,
            "password": "3242esdfsdf",
            "status": true,
            "person": {
                "id": 4,
                "names": "Ronal David Hoyos",
                "gender": "M",
                "age": "43",
                "identification": 34252354,
                "address": "Cll 70 No 97-75",
                "phone": "65787878"
            }
        }
    }
},
{
    "created_at":'2020-02-01',
    "id": 1,
    "type": "RETIRO",
    "value": -135000.00,
    "status": true,
    "account": {
        "id": 1,
        "accountNumber": "1234156",
        "type": "CORRIENTE",
        "currentBalance": 3000000.00,
        "initialBalance": 2200000.00,
        "status": true,
        "client": {
            "id": 1,
            "password": "supersecreta",
            "status": true,
            "person": {
                "id": 1,
                "names": "Jose Miguel Arango",
                "gender": "M",
                "age": "35",
                "identification": 21421615,
                "address": "Bucaramanga",
                "phone": "98763515"
            }
        }
    }
}
]

const account: Account = {
    "id": 3,
    "accountNumber": "325464",
    "type": "AHORROS",
    "currentBalance": 100000.00,
    "initialBalance": 200000.00,
    "status": true,
    "client": {
        "id": 4,
        "password": "3242esdfsdf",
        "status": true,
        "person": {
            "id": 4,
            "names": "Ronal David Hoyos",
            "gender": "M",
            "age": "43",
            "identification": 34252354,
            "address": "Cll 70 No 97-75",
            "phone": "65787878"
        }
    }
}

const accounts: Account[] = [
  {
  "id": 3,
    "accountNumber": "325464",
    "type": "AHORROS",
    "currentBalance": 100000.00,
    "initialBalance": 200000.00,
    "status": true,
    "client": {
        "id": 4,
        "password": "3242esdfsdf",
        "status": true,
        "person": {
            "id": 4,
            "names": "Ronal David Hoyos",
            "gender": "M",
            "age": "43",
            "identification": 34252354,
            "address": "Cll 70 No 97-75",
            "phone": "65787878"
        }
    }
  }
]

describe('MovimientosComponent', () => {
  let component: MovimientosComponent;
  let fixture: ComponentFixture<MovimientosComponent>;
  let transactionService: TransactionService;
  let clientService: ClientService;
  let httpTestingController: HttpTestingController;
  const fb = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovimientosComponent, PdfComponent, ConfirmComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [TransactionService, ClientService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MovimientosComponent);
    transactionService = fixture.debugElement.injector.get(TransactionService);
    clientService = fixture.debugElement.injector.get(ClientService);
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
    expect(component.selectTransaction).toEqual(transactionSave);

  });

  it('Validar método modalHide', () => {

    component.modalHide();
    expect(component.state).toBe('show')

  });

  it('loadTransactions: Debe de cargar las transacciones', () => {
    let filters = { filter: '', startDate: '01/02/2023', endDate: '01/03/2023' }
    spyOn(transactionService, 'getTrasactions').and.callFake((filters) => {
      const resp: ResponseGetTransactions = {
        "statusCode": 200, "message": 'Todo bien', "data": transactions
      }
      return new Observable(observer => {
        observer.next(resp);
        observer.complete();
      })
    });

    component.filterStartDate.nativeElement.value = '01/02/2023';
    component.filterEndDate.nativeElement.value = '01/03/2023';
    component.txtFilter.nativeElement.value = '';
    component.loadTransactions();

    expect(component.transactions.length).toBeGreaterThan(0);
    expect(component.transactions).toEqual(transactions);

  });

  it('Debe de llamar al servidor para guardar un movimiento', () => {

    component.datePipe = new DatePipe("es-CO");
    const spy = spyOn(transactionService, 'saveTrasaction').and.callFake(() => {
      return new Observable(observer => {
        const resp: Response = {
          "statusCode": 200, "message": 'Todo bien'
        }
        observer.next(resp);
        observer.complete();
      });
    });

    component.miFormulario.reset({
      type: 'DEPOSITO',
      value: 100000,
      status: true,
      accountId: 3,
    });
    component.accounts=accounts;
    component.state = 'new';
    component.save();

    expect(spy).toHaveBeenCalled();

  });

  it('Debe de llamar al servidor para actualizar un movimineto', () => {

    const spy = spyOn(transactionService, 'updateTrasaction').and.callFake(transaction => {
      return new Observable(observer => {
        const resp: Response = {
          "statusCode": 200, "message": 'Todo bien'
        }
        observer.next(resp);
        observer.complete();
      });
    });
    
    component.accounts=accounts;
    component.showEdit(transaction);
    component.state = 'edit';
    component.save();

    expect(spy).toHaveBeenCalled();

  });

  it('Debe de llamar al servidor para eliminar un Movimiento', () => {

    const spy = spyOn(transactionService, 'deleteTrasaction').and.callFake(transaction => {
      return new Observable(observer => {
        const resps: Response = {
          "statusCode": 200, "message": 'Todo bien'
        }
        observer.next(resps);
        observer.complete();
      });
    });

    component.showDelete(transaction);
    component.delete();

    expect(spy).toHaveBeenCalled();

  });

});