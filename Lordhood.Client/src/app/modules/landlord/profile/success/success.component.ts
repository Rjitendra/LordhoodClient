import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  amount!: number;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {this.route.queryParams.subscribe(params => {
    this.amount = params['amount'];
  });
  }

}
