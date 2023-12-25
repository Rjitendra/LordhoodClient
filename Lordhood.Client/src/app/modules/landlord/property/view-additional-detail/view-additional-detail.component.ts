import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as XLSX from 'xlsx';

import {
  IUserDetail,
  OauthService,
} from '../../../../oauth/service/oauth.service';
import { DownloadType, IProperty } from '@app/model/property';
import { PropertyService } from '@app/service/property.service';
import { TooltipModule } from 'primeng/tooltip';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-view-additional-detail',
    templateUrl: './view-additional-detail.component.html',
    styleUrls: ['./view-additional-detail.component.css'],
    standalone: true,
    imports: [
        ButtonModule,
        PdfViewerModule,
        TooltipModule,
    ],
})
export class ViewAdditionalDetailComponent implements OnInit {
  @ViewChild('pdfViewer') pdfViewer!: ElementRef;
  userdetail: Partial<IUserDetail> = {};
  property!: IProperty;
  dateFormat = 'mm/dd/yy';
  pdfSrc: any;
  zoom_to = 1.0;
  constructor(
    private router: Router,
    private service: PropertyService,
    private userService: OauthService,
    private sanitizer: DomSanitizer
  ) {
    this.userdetail = this.userService.getUserInfo();
    const res = this.router.getCurrentNavigation()?.extras.state;
    if (!res) {
      this.router.navigate(['landlord/property']);
      return;
    }
    this.property = res['property'];
    this.service
    .downloadPropertyFile(DownloadType.FloorPlan, this.property.id)
    .subscribe((res: any) => {
      let byteCharacters = atob(res);
      let byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      this.pdfSrc = byteArray;

    });
 
  }

  ngOnInit() {}

  zoom_in() {
    this.zoom_to = this.zoom_to + 0.25;
  }

  zoom_out() {
    if (this.zoom_to > 1) {
      this.zoom_to = this.zoom_to - 0.25;
    }
  }
  exportTable(
    propertydetailId: string,
    sheet: string,
    fileName: string = 'Sheet.xlsx'
  ) {
    // get the table element
    const table = document.getElementById(propertydetailId);

    // convert the table to a worksheet
    const worksheet = XLSX.utils.table_to_sheet(table);

    // create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet);

    // save the workbook as a file
    XLSX.writeFile(workbook, fileName, { bookType: 'xlsx', type: 'buffer' });
  }
}
