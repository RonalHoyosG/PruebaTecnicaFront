import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReporFilter, Report } from 'src/app/models/report.model';
import { ReportService } from 'src/app/services/report.service';
import { DatePipe } from '@angular/common';

import { DomSanitizer } from "@angular/platform-browser";

import { PdfMakeWrapper, Txt, Table } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ClientService } from 'src/app/services/client.service';
import { Client } from 'src/app/models/client.model';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit {

  public downloadUrl:any;
  filename = "";
  datePipe = new DatePipe("es-CO");
  currentDate: string | null = '';
  public reports: Report[] = [];
  public clients: Client[]= [];
  @ViewChild('filterStartDate') filterStartDate!: ElementRef;
  @ViewChild('filterEndDate') filterEndDate!: ElementRef;
  @ViewChild('filterClient') filterClient!: ElementRef;
  @ViewChild('spanError') spanError!: ElementRef;

  reportTitle:string='Report';
  reportHeaders=['Fecha','Cliente','Cuenta','Tipo','Estado','Saldo','Movimineto','Saldo Disponible'];
  reportData:any;
  reportFilters='';
  
  constructor(private reportService: ReportService, private clientSrvice: ClientService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.clients = this.clientSrvice.getClients('');
  }

  loadReports() {
    this.spanError.nativeElement.innerHTML ="";
    if(this.filterStartDate.nativeElement.value ==='' ||  this.filterStartDate.nativeElement.value == null ||
      this.filterEndDate.nativeElement.value ==='' || this.filterEndDate.nativeElement.value == null ||
      this.filterClient.nativeElement.value ==='' || this.filterClient.nativeElement.value == null){
      this.spanError.nativeElement.innerHTML ="Debes selecionar un rango de fechas y un cliente";
      return;
    }
    const _startDate = new Date(this.filterStartDate.nativeElement.value).getTime();
    const _endDate = new Date(this.filterEndDate.nativeElement.value).getTime();
    if(_startDate > _endDate){
      this.spanError.nativeElement.innerHTML ="La fecha inicial no puede ser mayor que la fecha final";
      return;
    }
    const startDate = this.datePipe.transform(this.filterStartDate.nativeElement.value, 'dd/MM/yyyy') || '01/01/2023';
    const endDate = this.datePipe.transform(this.filterEndDate.nativeElement.value, 'dd/MM/yyyy') || '12/02/2023' ;
    let filter:ReporFilter = {startDate:startDate,
                              endDate:endDate,
                              clientId:this.filterClient.nativeElement.value}
    this.reports = this.reportService.getReports(filter);
    this.reportFilters = ` \nFiltro: ${this.filterClient.nativeElement.test}\n FechaInicial: ${startDate}\n FechaFinal: ${endDate}`;
    this.extractData();
    this.generateJson();
  }

  generateJson() {
    this.filename = `EstadoCuenta-${this.datePipe.transform(new Date(),'dd-MM-yyyy-h:mm:ss')}`;
    var data = JSON.stringify(this.reports,null,3);
    var url = this.sanitizer.bypassSecurityTrustUrl(
      "data:text/json;charset=UTF-8," + encodeURIComponent(data)
    );
    this.downloadUrl = url;
  }

  extractData() {
    this.reportData = this.reports.map(row => [row.date, row.clientName, row.accountId, row.accountType, row.accountInitialBalance, row.transactionState, row.transactionValue, row.transactionResidue])
  }

}
