import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styles: [
  ]
})
export class ConfirmComponent {
  @Input() visible:boolean = false;
  @Input() title:String = 'Confirmación';
  @Input() message:String = 'Está seguro ';
  @Output() accept: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  acceptHandler(){
    this.accept.emit();
  }
  cancelHandler(){
    this.cancel.emit();
  }
}
