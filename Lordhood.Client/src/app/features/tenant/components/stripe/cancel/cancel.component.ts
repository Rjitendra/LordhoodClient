import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
    selector: 'app-cancel',
    templateUrl: './cancel.component.html',
    styleUrls: ['./cancel.component.css'],
    standalone: true,
    imports: [RouterLink]
})
export class CancelComponent implements OnInit {

  amount!: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.amount = params['amount'];
    });
  }

}
