import { Component, inject, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../../features/carts/service/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ModalModule],
  providers: [BsModalService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private menuService = inject(MenuService);
  private authService = inject(AuthService);
  public cartService = inject(CartService);
  private modalService = inject(BsModalService);
  private toastr = inject(ToastrService);

  public user = this.authService.currentUser;
  public modalRef?: BsModalRef;

  isShoMenu(): void {
    this.menuService.toggleMenu();
  }

  openCartModal(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg'
    });
  }

  increment(productId?: number): void {
    this.cartService.incrementQuantity(productId);
  }

  decrement(productId?: number): void {
    this.cartService.decrementQuantity(productId);
  }

  remove(productId?: number): void {
    this.cartService.removeFromCart(productId);
    this.toastr.info('Producto removido del carrito', 'Carrito');
  }

  cancelOrder(): void {
    this.cartService.clearCart();
    this.toastr.warning('El pedido ha sido cancelado y el carrito está vacío', 'Pedido Cancelado');
    this.modalRef?.hide();
  }
}
