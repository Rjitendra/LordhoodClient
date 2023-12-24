import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccordionModule } from 'primeng/accordion';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ToasterComponent } from './primeng/components/toaster/toaster.component';

const PrimeNgModules = [
 BreadcrumbModule,
  ProgressSpinnerModule,
  ToastModule,
  TableModule,
  PaginatorModule,
  ConfirmDialogModule,
  DynamicDialogModule,
  AutoCompleteModule,
  MultiSelectModule,
  CalendarModule,
  ChipsModule,
  CheckboxModule,
  InputSwitchModule,
  AccordionModule,
  DataViewModule,
  PanelModule,
  InputTextModule,
  FileUploadModule,
  InputTextareaModule,
  DropdownModule,
  RadioButtonModule,
  ConfirmPopupModule,
  DialogModule,
  PdfViewerModule,
  ToasterComponent,
  OverlayPanelModule
];

@NgModule({
  imports: [
    BreadcrumbModule,
    ProgressSpinnerModule,
    ToastModule,
    TableModule,
    PaginatorModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    AutoCompleteModule,
    MultiSelectModule,
    CalendarModule,
    ChipsModule,
    CheckboxModule,
    InputSwitchModule,
    AccordionModule,
    DataViewModule,
    PanelModule,
    InputTextModule,
    FileUploadModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    ConfirmPopupModule,
    DialogModule,
    PdfViewerModule,
    OverlayPanelModule,
  ],
  declarations: [ToasterComponent],
  providers: [DynamicDialogRef, ConfirmationService, MessageService],
  exports: PrimeNgModules,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrimeNgModule {}
