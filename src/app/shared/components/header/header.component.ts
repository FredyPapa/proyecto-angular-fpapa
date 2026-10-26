import { Component, inject, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../../features/carts/service/cart.service';
import { Cart } from '../../../features/carts/model/cart';

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
  public isPurchasing = signal<boolean>(false);

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

  purchase(): void {
    const items = this.cartService.cartItems();
    if (!items || items.length === 0) {
      this.toastr.warning('No hay productos en el carrito para procesar la compra', 'Carrito Vacío');
      return;
    }

    this.isPurchasing.set(true);

    // Obtener el ID del usuario de la sesión actual o fallback a 1
    const rawUserId = this.user()?.id;
    const userId = rawUserId ? Number(rawUserId) : 1;

    const cartPayload: Cart = {
      id: 0,
      userId: userId,
      products: items
    };

    this.cartService.save(cartPayload).subscribe({
      next: (response) => {
        console.log('Compra realizada con éxito:', response);
        this.isPurchasing.set(false);
        this.cartService.clearCart();
        this.modalRef?.hide();

        Swal.fire({
          title: '¡Compra Exitosa!',
          text: 'Su compra ha sido registrada y procesada correctamente.',
          icon: 'success',
          confirmButtonColor: '#198754',
          confirmButtonText: 'Aceptar'
        });

        this.toastr.success('La compra se realizó con éxito', '¡Éxito!');
      },
      error: (err) => {
        console.error('Error al procesar la compra:', err);
        this.isPurchasing.set(false);

        Swal.fire({
          title: 'Error en la compra',
          text: 'Ocurrió un error al procesar el pedido. Por favor intente nuevamente.',
          icon: 'error',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Cerrar'
        });

        this.toastr.error('No se pudo procesar la compra', 'Error');
      }
    });
  }
}
