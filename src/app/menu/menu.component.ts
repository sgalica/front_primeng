import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {AuthService} from '../demo/service/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    isLoggedIn$: Observable<boolean>;                  // {1}

    constructor(private authService: AuthService) { console.log('[menu.component.ts]'); }

    ngOnInit() {
        this.isLoggedIn$ = this.authService.isLoggedIn ; // {2}
    }

    onLogout() {
        this.authService.logout();                      // {3}
    }

}
