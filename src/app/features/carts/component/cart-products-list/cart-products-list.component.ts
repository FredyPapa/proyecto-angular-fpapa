import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../model/product';
import { CartService } from '../../service/cart.service';
import { CartProductItemComponent } from '../cart-product-item/cart-product-item.component';

@Component({
  selector: 'app-cart-products-list',
  standalone: true,
  imports: [CommonModule, CartProductItemComponent],
  templateUrl: './cart-products-list.component.html',
  styleUrl: './cart-products-list.component.css'
})
export class CartProductsListComponent implements OnInit {
  public products = signal<Product[]>([]);
  public loading = signal<boolean>(false);

  public cartService = inject(CartService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.loading.set(true);
    this.cartService.getAll().subscribe({
      next: (res) => {
        this.products.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.toastr.error('Error al cargar el catálogo de productos', 'Error');
        this.loading.set(false);
      }
    });
  }

  onAddProduct(event: { product: Product; quantity: number }): void {
    this.cartService.addToCart(event.product, event.quantity);
    this.toastr.success(
      `Se agregó ${event.quantity} unidad(es) de "${event.product.title}" al carrito`,
      '¡Producto agregado!'
    );
  }
}
