import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-reauth',
    templateUrl: './reauth.component.html',
    styleUrls: ['./reauth.component.css'],
    standalone: true,
    imports: [RouterLink]
})
export class ReauthComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
