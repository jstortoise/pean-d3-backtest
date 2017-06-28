import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-backtest',
  templateUrl: './backtest.component.html',
  styleUrls: ['./backtest.component.css']
})
export class BacktestComponent implements OnInit {
  backtests: Array<Object>;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getBacktests().subscribe(backtests => {
      // this.backtests = backtests.backtests;
      console.log(backtests);
      this.backtests = backtests;
    }, err => {
      console.log(err);
      return false;
    });
  }

}
