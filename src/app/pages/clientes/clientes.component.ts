import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Response } from 'src/app/models/response.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {
  miFormulario: FormGroup = this.fb.group({
    names: [, [Validators.required, Validators.minLength(8)]],
    gender: [, Validators.required],
    age: [, [Validators.required, Validators.min(18), Validators.max(110)]],
    identification: [, [Validators.required, Validators.minLength(6)]],
    address: [, [Validators.required, Validators.minLength(8)]],
    phone: [, [Validators.required, Validators.minLength(7)]],
    password: [, [Validators.required, Validators.minLength(6)]],
    status: [, [Validators.required]]
  })

  constructor(private fb: FormBuilder, private clientService: ClientService) { }

  public clients: Client[] = [];
  public selectClient!: Client;
  public clientNames: string = '';
  public confirmMessage: string = '';
  public saveError: string = '';

  public state: 'show' | 'new' | 'edit' | 'delete' = 'show';
  datePipe = new DatePipe("es-CO");
  currentDate: string | null = '';

  reportTitle: string = 'Clientes';
  reportHeaders = ['Nombres', 'Identificación', 'Dirección', 'Phone', 'Edad', 'Estatus'];
  reportData: any;
  reportFilters = '';

  @ViewChild('txtFilter') txtFilter!: ElementRef;

  ngOnInit(): void {
    this.loadClients('');
  }

  loadClients(filter: string) {
    this.saveError = '';
    this.miFormulario.reset();
    this.state = 'show';
    this.clientService.getClients(filter).
      subscribe(resp => {
        this.clients = resp.data;
        this.reportFilters = ` \nFiltro: ${filter}\n`;
        this.extractData();
      });
  }

  showNew() {
    this.state = 'new';
    this.miFormulario.reset({
      names: '',
      gender: '',
      age: '',
      identification: '',
      address: '',
      phone: '',
      password: '',
      status: false,
    })
  }

  showEdit(client: Client) {
    this.selectClient = client;
    this.miFormulario.reset({
      names: client.person.names,
      gender: client.person.gender,
      age: client.person.age,
      identification: client.person.identification,
      address: client.person.address,
      phone: client.person.phone,
      password: client.password,
      status: client.status,
    })
    this.state = 'edit';
  }

  showDelete(client: Client) {
    this.state = 'delete';
    this.selectClient = client;
    this.clientNames = client.person.names;
    this.confirmMessage = '¿Está seguro de que quiere eliminar el cliente ' + this.clientNames + '?';
  }

  modalHide() {
    this.state = 'show';
  }

  hasError(campo: string) {
    return this.miFormulario.controls[campo].errors
      && this.miFormulario.controls[campo].touched;
  }

  public save() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    if (this.state === 'new') {
      let newClient = {
        password: this.miFormulario.value.password,
        status: this.miFormulario.value.status,
        person: {
          names: this.miFormulario.value.names,
          gender: this.miFormulario.value.gender,
          age: this.miFormulario.value.age,
          identification: this.miFormulario.value.identification,
          address: this.miFormulario.value.address,
          phone: this.miFormulario.value.phone
        }
      }
      newClient = newClient as Client;
      this.clientService.saveClient(newClient)
        .subscribe(resp => {
          this.loadClients(this.txtFilter.nativeElement.value);
        }, (error: HttpErrorResponse) => {
          console.log(error.error.message);
          this.saveError = error.error.message;
        })
    }
    if (this.state === 'edit') {
      this.selectClient.password = this.miFormulario.value.password;
      this.selectClient.status = this.miFormulario.value.status;
      this.selectClient.person.names = this.miFormulario.value.names;
      this.selectClient.person.gender = this.miFormulario.value.gender;
      this.selectClient.person.age = this.miFormulario.value.age;
      this.selectClient.person.identification = this.miFormulario.value.identification;
      this.selectClient.person.address = this.miFormulario.value.address;
      this.selectClient.person.phone = this.miFormulario.value.phone;

      this.clientService.updateClient(this.selectClient)
        .subscribe(resp => {
          this.loadClients(this.txtFilter.nativeElement.value);
        }, (error: HttpErrorResponse) => {
          this.saveError = error.error.message;
        })
    }

  }

  delete() {
    this.clientService.deleteClient(this.selectClient.id || 0)
      .subscribe(resp => {
        this.loadClients(this.txtFilter.nativeElement.value);
      }, (error: HttpErrorResponse) => {
        this.saveError = error.error.message;
      })
  }

  extractData() {
    this.reportData = this.clients.map(row => [row.person.names, row.person.identification, row.person.address, row.person.phone, row.person.age, row.status])
  }

}
