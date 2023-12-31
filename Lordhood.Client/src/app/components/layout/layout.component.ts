import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OauthService } from 'src/app/oauth/service/oauth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
})
export class LayoutComponent implements OnInit {
  @ViewChild('navbarToggler') navbarToggler!: ElementRef;

  messages: string[] = [];

  currentUser: any;
  env: any;
  constructor(
    private authService: OauthService,
    private el: ElementRef,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.env = environment;
  }
  ngAfterViewInit(): void {
    const dropdownLinks = document.querySelectorAll('.navbar-nav li a');
    dropdownLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (this.navbarToggler.nativeElement.offsetParent !== null) {
          this.navbarToggler.nativeElement.click();
        }
      });
    });
  }

  highlightSection(sectionId: string) {
    const sectionEl = this.el.nativeElement.querySelector(`#${sectionId}`);

    const options: ScrollToOptions = {
      behavior: 'smooth',
      // @ts-ignore
      block: 'start',
      inline: 'nearest',
    };
    sectionEl.scrollIntoView(options);
    sectionEl.classList.add('highlight');
  }

  public login = () => {
    this.authService.login();
  };

  onLordSignUp = () => {
    this.document.location.href =
      environment.stsBaseUrl + '/Account/Registration';
  };
}
