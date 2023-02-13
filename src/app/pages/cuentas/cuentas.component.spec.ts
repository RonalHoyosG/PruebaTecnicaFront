import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { Account, AccountShow } from 'src/app/models/account.model';
import { Client } from 'src/app/models/client.model';
import { AccountService } from 'src/app/services/account.service';
import { ClientService } from 'src/app/services/client.service';

import { CuentasComponent } from './cuentas.component';

describe('CuentasComponent', () => {
  let component: CuentasComponent;
  let fixture: ComponentFixture<CuentasComponent>;
  let clientService: ClientService;
  let accountService: AccountService;
  let httpTestingController: HttpTestingController;
  const fb = new FormBuilder();


  const client: Client = {
    id: 1,
    password: '__122343',
    status: true,
    person: {
      id: 1,
      names: 'Ronal Hoyos G',
      gender: 'M',
      age: '40',
      identification: 8888855,
      address: 'Bogotá Colombia',
      phone: '65835241'
    }
  }
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

    const accouns: AccountShow[] = [
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
      }
    ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentasComponent, PdfComponent, ConfirmComponent ],
      imports:[FormsModule, 
        ReactiveFormsModule, 
        HttpClientTestingModule, 
        HttpClientModule],
      providers:[AccountService, ClientService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentasComponent);
    clientService = fixture.debugElement.injector.get(ClientService);
    accountService = fixture.debugElement.injector.get(AccountService);
    httpTestingController = fixture.debugElement.injector.get(HttpTestingController);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe de crear un formulario de cuentas con sus campos:[accountNumber, type, initialBalance, clientId, status]', () => {

    expect(component.miFormulario.contains('accountNumber')).toBeTruthy();
    expect(component.miFormulario.contains('type')).toBeTruthy();
    expect(component.miFormulario.contains('initialBalance')).toBeTruthy();
    expect(component.miFormulario.contains('clientId')).toBeTruthy();
    expect(component.miFormulario.contains('status')).toBeTruthy();

  });

  it('El numero de la cuenta debe ser obligatorio', () => {

    const control = component.miFormulario.get('accountNumber');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  })

  it('El cuenta debe contener como minimo 6 caracteres', () => {

    const control = component.miFormulario.get('accountNumber');
    if (control) {
      control.setValue('23412');
      expect(control.valid).toBeFalsy();
      control.setValue('456322');
      expect(control.valid).toBeTruthy();
    }

  });

  it('El type debe ser obligatorio', () => {

    const control = component.miFormulario.get('type');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  })

  it('El initialBalance debe ser obligatorio', () => {

    const control = component.miFormulario.get('initialBalance');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  })

  it('El clientId debe ser obligatorio', () => {

    const control = component.miFormulario.get('clientId');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  })


  it('El status debe ser obligatorio', () => {

    const control = component.miFormulario.get('status');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  })

  it('Validar método showNew', () => {

    component.showNew();
    expect(component.state).toBe('new');

  });

  it('Validar método showNew', () => {

    component.showNew();
    expect(component.state).toBe('new');

  });

  it('Validar método showEdit', () => {

    component.showEdit(accountShow);
    expect(component.state).toBe('edit');
    expect(component.miFormulario.value.accountNumber).toEqual(accountShow.accountNumber);

  });

  it('Validar método showDelete', () => {

    component.showDelete(accountShow);
    expect(component.selectAccount).toBe(accountShow);

  });

  it('Validar método modalHide', () => {

    component.modalHide();
    expect(component.state).toBe('show')

  });

  it('loadClients: Debe de cargar las cuentas', () => {
    spyOn(accountService, 'getAccounts').and.callFake(() => {
      return accouns;
    });

    component.loadAccounts('');

    expect(component.accounts.length).toBeGreaterThan(0);
    expect(component.accounts).toEqual(accouns);

  });

  it('Debe de llamar al servidor para guardar una cuenta', () => {

    const spy = spyOn(accountService, 'saveAccount').and.callFake(() => {
      return true;
    });

    component.selectClient = client;
    component.miFormulario.reset({
      accountNumber: '100001',
      type: 'Ahorros',
      initialBalance: 100000,
      status: true,
      clientId: 1,
    });
    component.state = 'new';
    component.save();

    expect(spy).toHaveBeenCalled();

  });

  it('Debe de llamar al servidor para actualizar una cuenta', () => {

    const spy = spyOn(accountService, 'updateAccount').and.callFake(accountShow => {
      return true;
    });

    component.selectClient = client;
    component.showEdit(accountShow);
    component.state = 'edit';
    component.save();

    expect(spy).toHaveBeenCalled();

  });

  it('Debe de llamar al servidor para eliminar una cuenta', () => {

    const spy = spyOn(accountService, 'deleteAccount').and.callFake(accountShow => {
      return true;
    });

    component.showDelete(accountShow);
    component.delete();

    expect(spy).toHaveBeenCalled();

  });

});
