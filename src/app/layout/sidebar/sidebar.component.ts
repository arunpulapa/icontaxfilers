import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

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
export class SidebarComponent implements OnInit {
  userName = '';     // 👈 Add this
roleLabel = '';     // optional
  @Output() navigate = new EventEmitter<void>();

  menu: MenuItem[] = [];
  expanded = new Set<string>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const role = this.authService.getRole(); // 'admin' | 'team' | 'client'
    const user = this.authService.getUser();
  if (user) {
    this.userName = `${user.firstName} ${user.lastName}`;
  }
   this.roleLabel =
    role === 'admin' ? 'Admin Console' :
    role === 'team'  ? 'Team Console'  :
                       'Client Portal';

    if (role === 'admin') {
      this.menu = this.adminMenu();
    } else if (role === 'team') {
      this.menu = this.teamMenu();
    } else {
      // default → client (User)
      this.menu = this.clientMenu();
    }
  }

  // ---- CLIENT MENU (User) ----
  private clientMenu(): MenuItem[] {
    return [
      { title: 'Dashboard', icon: 'dashboard', path: '/client/dashboard' },
      { title: 'Documents', icon: 'description', path: '/client/documents' }, 
      { title: 'Profile', icon: 'person', path: '/client/profile' },
      { title: 'Settings', icon: 'settings', path: '/client/settings' },
      // add more client routes later
    ];
  }

  // ---- ADMIN MENU ----
private adminMenu(): MenuItem[] {
  return [
    { title: 'Dashboard',      icon: 'dashboard',      path: '/admin/dashboard' },
    { title: 'New Client',     icon: 'person_add',     path: '/admin/clients/clientform' },
    { title: 'Existing Clients',icon: 'groups',        path: '/admin/clients/clientlist' },
    { title: 'All Clients',    icon: 'groups',         path: '/admin/clients/all' },
    { title: 'Search Clients', icon: 'search',         path: '/admin/clients/searchclient' },
    { title: 'Documents',      icon: 'description',    path: '/admin/documents' },
    { title: 'Payments',       icon: 'payments',       path: '/admin/payments' },
    { title: 'Invoices',       icon: 'receipt_long',   path: '/admin/invoices' },
    { title: 'Leads',          icon: 'feed',           path: '/admin/leads' },
    { title: 'Manage Teams',   icon: 'groups',         path: '/admin/teams' },
    { title: 'Manage Users',   icon: 'groups',         path: '/admin/users' },
    { title: 'Referrals',      icon: 'share',          path: '/admin/referrals' },
    { title: 'Settings',       icon: 'settings',       path: '/admin/settings' }
  ];
}


  // ---- TEAM MENU ----
  private teamMenu(): MenuItem[] {
    return [
      { title: 'Dashboard', icon: 'dashboard', path: '/teams/dashboard' },
      { title: 'Assigned Clients', icon: 'groups', path: '/teams/clients' },
      { title: 'My Clients', icon: 'group', path: '/teams/myclients' },
      { title: 'Task Managment', icon: 'task', path: '/teams/taskmangment' },
      { title: 'Documents', icon: 'description', path: '/teams/documents' },
      { title: 'Profile', icon: 'person', path: '/teams/profile' },
      { title: 'Settings', icon: 'settings', path: '/teams/settings' },

      // add more team routes later
    ];
  }

  // ---- existing logic ----

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
    const role = this.authService.getRole();
    if (role === 'admin') {
      this.router.navigateByUrl('/admin/dashboard');
    } else if (role === 'team') {
      this.router.navigateByUrl('/teams/dashboard');
    } else {
      this.router.navigateByUrl('/client/dashboard');
    }
    this.navigate.emit();
  }
}
