import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '@app/service/payment.service';

@Component({
    selector: 'app-return',
    templateUrl: './return.component.html',
    styleUrls: ['./return.component.css'],
    standalone: true,
    imports: [RouterLink],
})
export class ReturnComponent implements OnInit {
  isSuccess = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.paymentService.getAccountIdStatus().subscribe((res) => {
      this.isSuccess = res;
      if (!this.isSuccess) {
        this.router.navigate(['landlord/reauth']);
        return;
      }
    });
  }

  ngOnInit() {}
}
