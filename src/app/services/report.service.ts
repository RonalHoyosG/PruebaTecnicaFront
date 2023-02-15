import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReporFilter, Report, ResponseGetReport } from '../models/report.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(public http: HttpClient) { }

  getReports(filter: ReporFilter): Observable<ResponseGetReport> {
    const url = `${base_url}/reportes/obtener?fechaInicio=${filter.startDate}&fechaFin=${filter.endDate}&clientId=${filter.clientId}`;
    return this.http.get<ResponseGetReport>(url);
  }
}
