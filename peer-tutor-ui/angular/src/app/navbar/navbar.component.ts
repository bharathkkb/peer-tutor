import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router/';
import { ActivatedRoute } from '@angular/router/';
import { filter } from 'rxjs/internal/operators/';
import { NavigationStart } from '@angular/router/';
import { NavigationEnd } from '@angular/router/';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isVisible = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private authenticationService: AuthenticationService
  ) { }
  

  /**
   * On init, determine if navbar component is visible or not.
   * 
   * Not visible if login/register, else visible.
   */
  ngOnInit() {
    this.router.events.pipe( //capture the WHOLE list of events,
      filter(event=>event instanceof NavigationEnd) //then filter for only NavigationEnd Event
    )
    .subscribe((x:NavigationEnd)=>{
      if (x.url.match(/\/login|\/register|\/logout/)) {this.isVisible = false;}
      else {this.isVisible = true;}
    });
  }
  logout() {
     // logout
     this.authenticationService.logout();
     this.router.navigate(['/', 'login']);
  }

}