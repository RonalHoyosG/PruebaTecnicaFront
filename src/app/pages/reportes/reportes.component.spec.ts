import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { PdfComponent } from 'src/app/components/pdf/pdf.component';
import { Report, ResponseGetReport } from 'src/app/models/report.model';
import { ClientService } from 'src/app/services/client.service';
import { ReportService } from 'src/app/services/report.service';

import { ReportesComponent } from './reportes.component';

const reports: Report[] = [
  {
    createdAt: '01/02/2023',
    clientName: 'Ronal Hoyos G',
    accountNumber: '100001',
    accountType: 'AHORROS',
    accountInitialBalance: 1000000,
    transactionState: true,
    transactionValue: 10000,
    transactionResidue: 1010000,
  },
  {
    createdAt: '01/02/2023',
    clientName: 'Ronal Hoyos G',
    accountNumber: '100001',
    accountType: 'AHORROS',
    accountInitialBalance: 1000000,
    transactionState: true,
    transactionValue: 50000,
    transactionResidue: 1060000,
  }
]

describe('ReportesComponent', () => {
  let component: ReportesComponent;
  let fixture: ComponentFixture<ReportesComponent>;
  let clientService: ClientService;
  let reportService: ReportService;
  let httpTestingController: HttpTestingController;
  const fb = new FormBuilder();



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportesComponent, PdfComponent],
      imports: [FormsModule,
                ReactiveFormsModule,
                HttpClientTestingModule],
      providers: [ClientService, ReportService, DomSanitizer]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReportesComponent);
    reportService = fixture.debugElement.injector.get(ReportService);
    clientService = fixture.debugElement.injector.get(ClientService);
    // httpTestingController = fixture.debugElement.injector.get(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadReports: Debe de cargar los reportes', () => {

    let filters = { clientId: 1, startDate: '2023-02-01', endDate: '2023-02-20' }
    const spy = spyOn(reportService, 'getReports').and.callFake(() => {
      const resp: ResponseGetReport = {
        "statusCode": 200, "message": 'Todo bien', "data": reports
      }
      return new Observable(observer => {
        observer.next(resp);
        observer.complete();
      })
    });


    component.filterStartDate.nativeElement.value = '01/02/2023';
    component.filterEndDate.nativeElement.value = '01/03/2023';
    component.filterClient.nativeElement.value = 1;
    component.loadReports();

    expect(component.reports.length).toBeGreaterThan(0);
    expect(component.reports).toEqual(reports);
    // expect(spy).toHaveBeenCalled();

  });
});
