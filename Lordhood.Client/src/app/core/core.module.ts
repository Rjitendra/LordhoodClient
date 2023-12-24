import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyMaskModule } from "ng2-currency-mask";

@NgModule({
  imports: [CommonModule,CurrencyMaskModule],
  exports: [CurrencyMaskModule],
  declarations: [],
  providers: [],
})
export class CoreModule {}
