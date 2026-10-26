import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { Cart } from '../model/cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private uriProducts = environment.URL_BASE + '/products';
  private uri = environment.URL_BASE + '/carts';

  private http = inject(HttpClient);

  // Signal reactivo para los artículos en el carrito
  public cartItems = signal<Product[]>([]);

  // Signals computados para el conteo de artículos y monto total
  public totalCount = computed(() =>
    this.cartItems().reduce((acc, item) => acc + (item.quantity || 1), 0)
  );

  public totalAmount = computed(() =>
    this.cartItems().reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0)
  );

  /**
   * Obtiene todos los productos desde la API
   */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.uriProducts);
  }

  /**
   * Envía la información de la compra (carrito) a la API vía POST
   */
  save(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.uri, cart);
  }

  /**
   * Agrega un producto al carrito.
   * Si ya existe, suma la cantidad; de lo contrario, lo añade al arreglo.
   */
  addToCart(product: Product, quantity: number = 1): void {
    if (!product || quantity <= 0) return;

    this.cartItems.update((items) => {
      const existingIndex = items.findIndex((i) => i.id === product.id);

      if (existingIndex > -1) {
        return items.map((item, index) => {
          if (index === existingIndex) {
            return {
              ...item,
              quantity: (item.quantity || 0) + quantity
            };
          }
          return item;
        });
      } else {
        return [...items, { ...product, quantity }];
      }
    });
  }

  /**
   * Incrementa la cantidad de un producto en el carrito en 1
   */
  incrementQuantity(productId?: number): void {
    if (productId === undefined) return;

    this.cartItems.update((items) =>
      items.map((item) =>
        item.id === productId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  }

  /**
   * Disminuye la cantidad de un producto en el carrito en 1 (mínimo 1)
   */
  decrementQuantity(productId?: number): void {
    if (productId === undefined) return;

    this.cartItems.update((items) =>
      items.map((item) => {
        if (item.id === productId) {
          const newQty = (item.quantity || 1) - 1;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  }

  /**
   * Elimina un producto específico del carrito
   */
  removeFromCart(productId?: number): void {
    if (productId === undefined) return;

    this.cartItems.update((items) => items.filter((item) => item.id !== productId));
  }

  /**
   * Limpia todos los productos del carrito (Cancelar Pedido)
   */
  clearCart(): void {
    this.cartItems.set([]);
  }
}
