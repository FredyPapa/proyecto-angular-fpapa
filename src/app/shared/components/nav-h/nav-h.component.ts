import { Component, inject } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-h',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './nav-h.component.html',
  styleUrl: './nav-h.component.scss'
})
export class NavHComponent {
  private menuService = inject(MenuService);
  private authService = inject(AuthService);

  public user = this.authService.currentUser;

  isShoMenu() {
    this.menuService.toggleMenu();
  }

  logout() {
    this.authService.logout();
  }
}
