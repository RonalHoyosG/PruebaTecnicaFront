import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Client, ResponseGetClient } from 'src/app/models/client.model';

import { Observable, EMPTY } from 'rxjs';


import { ClientesComponent } from './clientes.component';
import { ClientService } from 'src/app/services/client.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { Response } from 'src/app/models/response.model';

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let clientService: ClientService;
  let httpTestingController: HttpTestingController;
  const fb = new FormBuilder();



  const responseObservableResponse = new Observable(observer => {
    const resp: Response = {
      "statusCode": 200, "message": 'Todo bien'
    }
    observer.next(resp);
    observer.complete();
  })



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

  const clients: Client[] = [
    {
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
    },
    {
      id: 2,
      password: '__12343rf23',
      status: true,
      person: {
        id: 1,
        names: 'Jose Torres',
        gender: 'M',
        age: '42',
        identification: 34554582,
        address: 'Bogotá Colombia',
        phone: '65835241'
      }
    }
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientesComponent, PdfComponent, ConfirmComponent],
      imports: [FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientTestingModule],
      providers: [ClientService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClientesComponent);
    clientService = fixture.debugElement.injector.get(ClientService);
    httpTestingController = fixture.debugElement.injector.get(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Debe de crear un formulario de cliente con sus campos:[names, gender, age, identification, address, phone, password, status]', () => {

    expect(component.miFormulario.contains('names')).toBeTruthy();
    expect(component.miFormulario.contains('gender')).toBeTruthy();
    expect(component.miFormulario.contains('age')).toBeTruthy();
    expect(component.miFormulario.contains('identification')).toBeTruthy();
    expect(component.miFormulario.contains('address')).toBeTruthy();
    expect(component.miFormulario.contains('phone')).toBeTruthy();
    expect(component.miFormulario.contains('password')).toBeTruthy();
    expect(component.miFormulario.contains('status')).toBeTruthy();

  });

  it('El nombre debe de ser obligatorio', () => {

    const control = component.miFormulario.get('names');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  });

  it('El names debe contener como minimo 8 caracteres', () => {

    const control = component.miFormulario.get('names');
    if (control) {
      control.setValue('Ronal');
      expect(control.valid).toBeFalsy();
      control.setValue('Ronal Hoyos');
      expect(control.valid).toBeTruthy();
    }

  });

  it('El genero debe de ser obligatorio', () => {

    const control = component.miFormulario.get('gender');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
    }

  });

  it('La edad es requerida minimo 18 y maximo 110 años', () => {

    const control = component.miFormulario.get('age');
    if (control) {
      control.setValue(10);
      expect(control.valid).toBeFalsy();
      control.setValue(18);
      expect(control.valid).toBeTruthy();
      control.setValue(111);
      expect(control.valid).toBeFalsy();
    }

  });

  it('La Identificación es requerida y debe ser como minimo 6 caracteres', () => {

    const control = component.miFormulario.get('identification');
    if (control) {
      control.setValue('8609');
      expect(control.valid).toBeFalsy();
      control.setValue('8607234');
      expect(control.valid).toBeTruthy();
    }

  });

  it('La dirección es requerida y debe ser como minimo 8 caracteres', () => {

    const control = component.miFormulario.get('address');
    if (control) {
      control.setValue('Bogotá');
      expect(control.valid).toBeFalsy();
      control.setValue('Bogotá localidad Engativa');
      expect(control.valid).toBeTruthy();
    }

  });

  it('El teléfono es requerido y debe ser como minimo 7 caracteres', () => {

    const control = component.miFormulario.get('phone');
    if (control) {
      control.setValue('6583');
      expect(control.valid).toBeFalsy();
      control.setValue('6583500');
      expect(control.valid).toBeTruthy();
    }

  });

  it('El password es requerido y debe ser como minimo 6 caracteres', () => {

    const control = component.miFormulario.get('password');
    if (control) {
      control.setValue('33re4');
      expect(control.valid).toBeFalsy();
      control.setValue('3r33r3r');
      expect(control.valid).toBeTruthy();
    }

  });

  it('El status es requerido y debe ser false o true', () => {

    const control = component.miFormulario.get('status');
    if (control) {
      control.setValue('');
      expect(control.valid).toBeFalsy();
      control.setValue(true);
      expect(control.valid).toBeTruthy();
      control.setValue(false);
      expect(control.valid).toBeTruthy();
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

    component.showEdit(client);
    expect(component.state).toBe('edit');
    expect(component.miFormulario.value.names).toEqual(client.person.names);

  });


  it('Validar método showDelete', () => {

    component.showDelete(client);
    expect(component.selectClient).toBe(client);
    expect(component.clientNames).toBe(client.person.names);

  });

  it('Validar método modalHide', () => {

    component.modalHide();
    expect(component.state).toBe('show')

  });

  it('loadClients: Debe de cargar los clientes', () => {
    const resp: ResponseGetClient = {
      "statusCode": 200, "message": 'Todo bien', "data": clients
    }
    component = new ClientesComponent(fb, clientService);
    spyOn(clientService, 'getClients').and.callFake(() => {
      return new Observable(observer => {
        observer.next(resp);
        observer.complete();
      })
    });

    component.loadClients('');

    expect(component.clients.length).toBeGreaterThan(0);
    expect(component.clients).toEqual(clients);

  });


  it('Debe de llamar al servidor para guardar un cliente', () => {

    const spy = spyOn(clientService, 'saveClient').and.callFake((client: Client) => {
      return new Observable(observer => {
        const resp: Response = {
          "statusCode": 200, "message": 'Todo bien'
        }
        observer.next(resp);
        observer.complete();
      });
    });

    component.miFormulario.reset({
      names: 'Marvin Hoyos',
      gender: 'M',
      age: '40',
      identification: '1018888855',
      address: 'Bogotá Colombia',
      phone: '65835241',
      password: 'wdefrg',
      status: true,
    });
    component.state = 'new';
    component.save();

    expect(spy).toHaveBeenCalled();

  });

  it('Debe de llamar al servidor para actualizar un cliente', () => {

    const spy = spyOn(clientService, 'updateClient').and.callFake(client => {
      return new Observable(observer => {
        const resp: Response = {
          "statusCode": 200, "message": 'Todo bien'
        }
        observer.next(resp);
        observer.complete();
      });
    });

    component.showEdit(client);
    component.state = 'edit';
    component.save();

    expect(spy).toHaveBeenCalled();

  });

  it('Debe de llamar al servidor para eliminar un cliente', () => {

    const spy = spyOn(clientService, 'deleteClient').and.callFake(client => {
      return new Observable(observer => {
        const resp: Response = {
          "statusCode": 200, "message": 'Todo bien'
        }
        observer.next(resp);
        observer.complete();
      });
    });

    component.showDelete(client);
    component.delete();

    expect(spy).toHaveBeenCalled();

  });

});
