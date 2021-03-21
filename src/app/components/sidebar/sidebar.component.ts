import { GeneralService } from './../../services/general.service';
import { AuthGuard } from './../../services/auth/auth.guard';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const TOKEN_KEY = 'myNollyApp-Admin-Token';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private auth: AuthGuard, private router: Router, public general: GeneralService) { }

  ngOnInit(): void {
  }

  logout() {
    Storage.remove({key: TOKEN_KEY}).then(() => {
      this.auth.authenticated = false;
    });
    this.router.navigateByUrl('login')
  }
}
