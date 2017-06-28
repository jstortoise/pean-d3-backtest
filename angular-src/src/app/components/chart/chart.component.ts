import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// import 'chartdrawer.js';

declare var showChart: any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(
  		private authService: AuthService,
  		private router: Router,
  		private route: ActivatedRoute
  ) {}

  ngOnInit() {
  	this.route.params.subscribe(params => {
       console.log(+params['id']);
       this.authService.getBacktest(+params['id']).subscribe(backtest => {
		      // console.log(backtest);
		      // chartObject.setChartData('aaaaa');
		      showChart(backtest);
		      // chartObject.showData();
		    }, err => {
		      console.log(err);
		      return false;
		    });
     });
  }

}
