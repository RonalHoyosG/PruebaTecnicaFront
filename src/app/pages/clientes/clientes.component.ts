import { Component,OnInit,ViewChild, ElementRef} from '@angular/core';
import { Client } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit{
  miFormulario: FormGroup = this.fb.group({
    names: [ , [ Validators.required, Validators.minLength(8) ]   ],
    gender: [ , Validators.required ],
    age: [ , [ Validators.required, Validators.min(18),Validators.max(110)] ],
    identification: [ , [ Validators.required, Validators.minLength(6)] ],
    address: [ , [ Validators.required, Validators.minLength(8)] ],
    phone: [ , [ Validators.required, Validators.minLength(7)] ],
    password: [ , [ Validators.required, Validators.min(0)] ],
    status: [ , [ Validators.required] ]
  })

  constructor( private fb: FormBuilder, private clientSrvice: ClientService ) { }

  public clients: Client[]=[];
  public selectClient!: Client;
  public clientNames: string='';
  public state:'show'|'new'|'edit'|'delete' = 'show';

  @ViewChild('txtFilter') txtFilter!: ElementRef;

  ngOnInit(): void {
    this.loadClients('');
  }

  loadClients(filter:string) {
    this.clients = this.clientSrvice.getClients(filter);
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
    this.selectClient=client;
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

  showDelete(client:Client) {
    console.log('showDelete...');
    this.state = 'delete';
    this.selectClient=client;
    this.clientNames=client.person.names;
    
  }

  modalHide() {
    this.state = 'show';
  }

  hasError( campo: string ) {
    return this.miFormulario.controls[campo].errors 
            && this.miFormulario.controls[campo].touched;
  }

  save(){
    if ( this.miFormulario.invalid )  {
      this.miFormulario.markAllAsTouched();
      return;
    }

    if(this.state === 'new'){
      this.selectClient = {
        id: Math.floor(Math.random() * 999999),
        password: this.miFormulario.value.password,
        status: this.miFormulario.value.status,
        person: {
          id:Math.floor(Math.random() * 999999),
          names:this.miFormulario.value.names,
          gender:this.miFormulario.value.gender,
          age:this.miFormulario.value.age,
          identification:this.miFormulario.value.identification,
          address:this.miFormulario.value.address,
          phone:this.miFormulario.value.phone
        }
      }
      this.clientSrvice.saveClient(this.selectClient);
    }
    if(this.state === 'edit'){
      this.selectClient.password=this.miFormulario.value.password;
      this.selectClient.status=this.miFormulario.value.status;
      this.selectClient.person.names=this.miFormulario.value.names;
      this.selectClient.person.gender=this.miFormulario.value.gender;
      this.selectClient.person.age=this.miFormulario.value.age;
      this.selectClient.person.identification=this.miFormulario.value.identification;
      this.selectClient.person.address=this.miFormulario.value.address;
      this.selectClient.person.phone=this.miFormulario.value.phone;
      this.clientSrvice.updateClient(this.selectClient);
    }
    this.miFormulario.reset();
    this.state = 'show';
    this.loadClients(this.txtFilter.nativeElement.value);
  }

  delete(){
    this.clientSrvice.deleteClient( this.selectClient.id);
    this.state = 'show';
    this.loadClients(this.txtFilter.nativeElement.value);
  }
  
}
