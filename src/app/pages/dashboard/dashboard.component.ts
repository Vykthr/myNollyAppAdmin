import { GeneralService } from './../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public general: GeneralService, private router: Router) { }

  ngOnInit(): void {
    this.general.currentPage = this.router.url
  }

}
