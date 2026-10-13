import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private menuService = inject(MenuService);
  private authService = inject(AuthService);

  public user = this.authService.currentUser;

  isShoMenu() {
    this.menuService.toggleMenu();
  }
}
