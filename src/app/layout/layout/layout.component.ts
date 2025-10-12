import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  year = new Date().getFullYear();
  showLayout = true;

  constructor(private breakpoint: BreakpointObserver, private router: Router) {
    // Listen to route changes
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)) // type guard
      .subscribe((event: NavigationEnd) => {
        // Hide layout for login page
        this.showLayout = event.urlAfterRedirects !== '/login';
      });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeIfOver() {
    if (this.sidenav.mode === 'over') this.sidenav.close();
  }

  ngOnInit() {
    this.breakpoint.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
}
