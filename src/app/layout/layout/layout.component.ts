import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
@ViewChild('sidenav') sidenav!: MatSidenav;
 year = new Date().getFullYear();
  toggleSidenav() {
    this.sidenav.toggle();
  }
constructor(private breakpoint: BreakpointObserver) {}

  // Helper to close sidenav on navigation (mobile)
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
