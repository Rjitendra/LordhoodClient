import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '@app/core/primeng/services/loader.service';
import { OauthService } from '@app/oauth/service/oauth.service';

@Component({
  selector: 'app-tenant-outlet',
  templateUrl: './tenant-outlet.component.html',
  styleUrls: ['./tenant-outlet.component.css'],
})
export class TenantOutletComponent implements OnInit {
  @ViewChild('navbarToggler') navbarToggler!: ElementRef;
  loading!: boolean;
  constructor(
    private authService: OauthService,
    private router: Router,
    private spinnerService: LoaderService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.spinnerService.loading.asObservable().subscribe((x) =>
      setTimeout(() => {
        this.loading = x;
      }, 0)
    );
  }

  ngAfterViewInit(): void {
    const dropdownLinks = document.querySelectorAll('.navbar-nav li a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.navbarToggler.nativeElement.offsetParent !== null) {
          this.navbarToggler.nativeElement.click();
        }
      });
    });
  }
  
  public async onLogout(): Promise<void> {
    try {
      this.authService.logout();
    } catch (err) {}
  }
  
  newIssue() {
    this.router.navigate(['user/ticket-create']);
  }
}
