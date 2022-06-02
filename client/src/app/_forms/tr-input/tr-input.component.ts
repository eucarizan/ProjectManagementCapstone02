import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-tr-input',
  templateUrl: './tr-input.component.html',
  styleUrls: ['./tr-input.component.css']
})
export class TrInputComponent implements ControlValueAccessor {
  @Input() name: string;
  @Input() status: string;
  @Input() idx: number;

  constructor() {
    
   }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
}
