import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

interface MenuItem {
  title: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
 @Output() navigate = new EventEmitter<void>();

menu: MenuItem[] = [
  { title: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { title: 'New Client', icon: 'person_add', path: '/clients/clientform' },
  { title: 'Existing Clients', icon: 'groups', path: '/clients/clientlist' },
  { title: 'All Clients', icon: 'groups', path: '/clients/all' },
  { title: 'Inactive Clients', icon: 'person_off', path: '/clients/inactive' },
  { title: 'Search Clients', icon: 'search', path: '/clients/search' },
  { title: 'Payments', icon: 'payments', path: '/payments' },
  { title: 'Invoices', icon: 'receipt_long', path: '/invoices' },
  { title: 'Leads', icon: 'feed', path: '/leads' },
  { title: 'Referrals', icon: 'share', path: '/referrals' },
  { title: 'Manage Teams', icon: 'groups', path: '/teams' },
];


  expanded = new Set<string>();

  constructor(private router: Router) {}

  toggle(item: MenuItem) {
    if (item.children) {
      if (this.expanded.has(item.title)) this.expanded.delete(item.title);
      else this.expanded.add(item.title);
    } else if (item.path) {
      this.router.navigateByUrl(item.path);
      this.navigate.emit();
    }
  }

  isExpanded(item: MenuItem) {
    return !!item.children && this.expanded.has(item.title);
  }

  goHome() {
  this.router.navigateByUrl('/dashboard');
  this.navigate.emit();
}

}
