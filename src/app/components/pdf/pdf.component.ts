import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { PdfMakeWrapper, Txt, Table } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styles: [
  ]
})
export class PdfComponent {

  datePipe = new DatePipe("es-CO");
  today=new Date();

  @Input() title:string='filePDF';
  @Input() headers=['Header1', 'Header2'];
  @Input() filters='   Filtro: Ronal\nFecha Inicial: 01/02/2023\nFecha Final: 01/02/2023';
  @Input() data=[
    ['Ronal Hoyos','100'],
    ['Jose Torres','500']
  ];



  exportPDF() {
    console.log(JSON.stringify(this.headers,null,3));
    console.log(JSON.stringify(this.data,null,3));
    PdfMakeWrapper.setFonts(pdfFonts);

    const pdf = new PdfMakeWrapper();

    let title = new Txt([
      new Txt(`${this.title} \n`).alignment('center').bold().fontSize(20).end,
    ]).end;
    let date = new Txt([
      new Txt('\nReporte generado: ').bold().fontSize(12).absolutePosition(0, 50).end,
      new Txt(`${this.datePipe.transform(this.today, 'fullDate')} \n\n`).fontSize(10).end,
    ]).end;
    let filter = new Txt([
      new Txt('\nFiltros: ').bold().fontSize(12).absolutePosition(0, 50).end,
      new Txt(`${this.filters} \n\n`).fontSize(10).end,
    ]).end;
    let table = new Table([
      this.headers,
      ...this.data
    ]).
      alignment('center').
      layout({
        fillColor: (rowIndex) => {
          if (rowIndex === 0) {
            return '#f2d915';
          }

          if (rowIndex && rowIndex % 2 === 0) {
            return '#dfdfdf';
          }

          return '#ffffff';
        }
      }).end;

    pdf.add(title);
    pdf.add(date);
    pdf.add(filter);
    pdf.add(table);

    pdf.create().download(`${this.title}-${this.datePipe.transform(this.today, 'dd-MM-yyyy-h:mm:ss')}`);
  }


}
