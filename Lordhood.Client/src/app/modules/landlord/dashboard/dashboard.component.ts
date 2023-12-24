import { Component, OnInit } from '@angular/core';
import { IBoard } from '@app/model/property';
import { IUserDetail, OauthService } from '@app/oauth/service/oauth.service';
import { PropertyService } from '@app/service/property.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userdetail: Partial<IUserDetail> = {};
  board: IBoard[] = [];

  constructor(
    private service: PropertyService,
    private userService: OauthService
  ) {
    this.userdetail = this.userService.getUserInfo();
    this.getBoard();
  }

  ngOnInit(): void {}

  getBoard() {
    this.service.getBoard(this.userdetail.userId!).subscribe((res) => {
      this.board = res;
    });
  }
  rentStatus(board: IBoard): string {
    if (board.rentAmount == null) {
      return 'Rent Not Yet Generated';
    } else if (board.rentAmount != null && board.rentDue <= 0) {
      return 'Paid';
    }
    return 'Rent Due';
  }
}
