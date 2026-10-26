import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../model/product';
import { quantityValidator } from '../../validators/quantity.validator';

@Component({
  selector: 'app-cart-product-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart-product-item.component.html',
  styleUrl: './cart-product-item.component.css'
})
export class CartProductItemComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Output() add = new EventEmitter<{ product: Product; quantity: number }>();

  public addedFeedback = signal<boolean>(false);

  // Control reactivo con el validador personalizado (por defecto 1, no vacío, entero >= 1)
  public quantityControl = new FormControl<number | string>(1, [quantityValidator(1)]);

  ngOnInit(): void {
    // Si el producto viene con una cantidad previa especificada, la toma
    if (this.product && this.product.quantity && this.product.quantity > 0) {
      this.quantityControl.setValue(this.product.quantity);
    }
  }

  get imageSrc(): string {
    if (!this.product?.image) return './img/logo.png';
    if (Array.isArray(this.product.image)) {
      return this.product.image[0] || './img/logo.png';
    }
    return this.product.image;
  }

  increment(): void {
    const current = Number(this.quantityControl.value) || 0;
    this.quantityControl.setValue(current + 1);
    this.quantityControl.markAsTouched();
  }

  decrement(): void {
    const current = Number(this.quantityControl.value) || 1;
    if (current > 1) {
      this.quantityControl.setValue(current - 1);
      this.quantityControl.markAsTouched();
    }
  }

  onAddToCart(): void {
    this.quantityControl.markAsTouched();

    if (this.quantityControl.invalid) {
      return;
    }

    const qty = Number(this.quantityControl.value);
    this.add.emit({
      product: this.product,
      quantity: qty
    });

    // Pequeño feedback visual temporal en el botón
    this.addedFeedback.set(true);
    setTimeout(() => {
      this.addedFeedback.set(false);
      this.quantityControl.setValue(1);
      this.quantityControl.markAsUntouched();
    }, 1200);
  }

  get errorMessage(): string | null {
    if (!this.quantityControl.touched && !this.quantityControl.dirty) {
      return null;
    }
    const errors = this.quantityControl.errors;
    if (!errors) return null;

    if (errors['requiredQuantity']) {
      return errors['requiredQuantity'];
    }
    if (errors['minQuantity']) {
      return errors['minQuantity'].message || 'La cantidad mínima es 1';
    }
    if (errors['integerQuantity']) {
      return errors['integerQuantity'];
    }
    if (errors['invalidQuantity']) {
      return errors['invalidQuantity'];
    }
    return 'Cantidad no válida';
  }
}
