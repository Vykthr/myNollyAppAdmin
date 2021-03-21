import { GeneralService } from './../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(public general: GeneralService, private router: Router) { }

  ngOnInit(): void {
    this.general.currentPage = this.router.url
  }
}
