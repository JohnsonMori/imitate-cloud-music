import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { WyUiModule } from './wy-ui/wy-ui.module';



@NgModule({
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    WyUiModule
  ],
  exports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    WyUiModule
  ]
})
export class ShareModule { }
