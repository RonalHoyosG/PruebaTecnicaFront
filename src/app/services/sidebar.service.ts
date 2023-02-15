import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    { title: 'Clientes', path: '/clientes' },
    { title: 'Cuentas', path: '/cuentas' },
    { title: 'Moviemientos', path: '/movimientos' },
    { title: 'Reportes', path: '/reportes' },
  ]

  constructor() { }
}
