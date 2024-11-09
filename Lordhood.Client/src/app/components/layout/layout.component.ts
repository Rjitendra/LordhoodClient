/**
 * This file contains the implementation of the LayoutComponent class.
 * The LayoutComponent class is responsible for managing the layout of the application.
 * It handles the navigation bar, user authentication, and scrolling to sections.
 */
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

  /**
   * Initializes the component.
   * Sets the environment variable.
   */
  ngOnInit(): void {
    this.env = environment;
  }

  /**
   * Executed after the view is initialized.
   * Adds event listeners to dropdown links in the navigation bar.
   */
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

  /**
   * Highlights the specified section by scrolling to it and adding a CSS class.
   * @param sectionId - The ID of the section to highlight.
   */
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

  /**
   * Performs user login.
   */
  public login = () => {
    this.authService.login();
  };

  /**
   * Redirects to the account registration page.
   */
  onLordSignUp = () => {
    this.document.location.href =
      environment.stsBaseUrl + '/Account/Registration';
  };
}