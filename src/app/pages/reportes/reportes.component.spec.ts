import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { Report } from 'src/app/models/report.model';
import { ClientService } from 'src/app/services/client.service';
import { ReportService } from 'src/app/services/report.service';

import { ReportesComponent } from './reportes.component';

const reports:Report[] = [
  {
    date:'01/02/2023',
    clientId:'1', 
    clientName:'Ronal Hoyos G', 
    accountId:'100001', 
    accountType:'Ahorros', 
    accountInitialBalance:1000000, 
    transactionState:true, 
    transactionValue:10000, 
    transactionResidue:1010000, 
  },
  {
    date:'01/02/2023',
    clientId:'1', 
    clientName:'Ronal Hoyos G', 
    accountId:'100002', 
    accountType:'Corriente', 
    accountInitialBalance:200000, 
    transactionState:true, 
    transactionValue:10000, 
    transactionResidue:210000, 
  },
  {
    date:'02/02/2023',
    clientId:'1', 
    clientName:'Ronal Hoyos G', 
    accountId:'100001', 
    accountType:'Ahorros', 
    accountInitialBalance:1000000, 
    transactionState:true, 
    transactionValue:20000, 
    transactionResidue:1030000, 
  },
  {
    date:'03/02/2023',
    clientId:'1', 
    clientName:'Ronal Hoyos G', 
    accountId:'100001', 
    accountType:'Ahorros', 
    accountInitialBalance:1000000, 
    transactionState:true, 
    transactionValue:-20000, 
    transactionResidue:1010000, 
  },
  {
    date:'01/02/2023',
    clientId:'2', 
    clientName:'Jose Torres', 
    accountId:'100002', 
    accountType:'Ahorros', 
    accountInitialBalance:20000, 
    transactionState:true, 
    transactionValue:10000, 
    transactionResidue:30000, 
  },
  {
    date:'03/02/2023',
    clientId:'2', 
    clientName:'Jose Torres', 
    accountId:'100002', 
    accountType:'Ahorros', 
    accountInitialBalance:20000, 
    transactionState:true, 
    transactionValue:50000, 
    transactionResidue:80000, 
  },
]

describe('ReportesComponent', () => {
  let component: ReportesComponent;
  let fixture: ComponentFixture<ReportesComponent>;
  let clientService: ClientService;
  let reportService: ReportService;
  const fb = new FormBuilder();

  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesComponent, PdfComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers:[ClientService, ReportService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesComponent);
    reportService = fixture.debugElement.injector.get(ReportService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadReports: Debe de cargar los reportes', () => {

    component.filterStartDate.nativeElement.value='2023-02-01';
    component.filterEndDate.nativeElement.value='2023-02-12';
    component.filterClient.nativeElement.value='1';
    let filters = {clientId:1,startDate:'01/02/2023',endDate:'12/02/2023'}
    spyOn(reportService, 'getReports').and.callFake((filters) => {
      return reports;
    });

    
    component.loadReports();

    expect(component.reports.length).toBeGreaterThan(0);
    expect(component.reports).toEqual(reports);

  });
});
