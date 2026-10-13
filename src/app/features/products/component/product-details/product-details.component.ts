import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../service/product.service';
import { Product } from '../../model/product';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  selector: 'app-product-details',
  styleUrl: './product-details.component.css',
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  // Estados reactivos con Signals
  public submitted = signal<boolean>(false);
  public loading = signal<boolean>(false);
  public isEditMode = signal<boolean>(false);
  public categories = signal<string[]>([]);
  public imagePreview = signal<string>('https://placehold.co/600x400.jpg');

  public productId?: number;
  private defaultImage: string[] = ['https://placehold.co/600x400.jpg'];

  productForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    price: [0, [Validators.required, Validators.min(0.01), Validators.max(100000)]],
    description: ['', [Validators.required, Validators.minLength(5)]],
    category: ['', [Validators.required]],
    image: ['https://placehold.co/600x400.jpg']
  });

  ngOnInit(): void {
    this.loadCategories();

    this.activateRoute.params.subscribe({
      next: (params) => {
        if (params['id']) {
          this.productId = Number(params['id']);
          this.isEditMode.set(true);
          this.findById(this.productId);
        } else {
          this.isEditMode.set(false);
        }
      },
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  findById(id: number): void {
    this.loading.set(true);
    this.productService.findById(id).subscribe({
      next: (res) => {
        this.pf['title'].setValue(res.title);
        this.pf['price'].setValue(res.price);
        this.pf['description'].setValue(res.description);
        this.pf['category'].setValue(res.category || '');

        const img = Array.isArray(res.image) ? res.image[0] : (res.image as unknown as string) || 'https://placehold.co/600x400.jpg';
        this.pf['image'].setValue(img);
        this.imagePreview.set(img);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al buscar producto:', err);
        this.toastr.error('Error al cargar datos del producto', 'Error');
        this.loading.set(false);
      }
    });
  }

  onImageChange(): void {
    const imgValue = this.pf['image'].value;
    if (imgValue && imgValue.trim().length > 0) {
      this.imagePreview.set(imgValue);
    } else {
      this.imagePreview.set('https://placehold.co/600x400.jpg');
    }
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.productForm.invalid) {
      this.toastr.warning('Por favor completa todos los campos requeridos', 'Formulario incompleto');
      return;
    }

    const imgVal = this.pf['image'].value || 'https://placehold.co/600x400.jpg';

    const productPayload: Product = {
      id: this.productId,
      title: this.pf['title'].value || '',
      price: Number(this.pf['price'].value) || 0,
      description: this.pf['description'].value || '',
      category: this.pf['category'].value || '',
      image: [imgVal]
    };

    this.loading.set(true);

    if (this.isEditMode() && this.productId) {
      this.productService.update(this.productId, productPayload).subscribe({
        next: (res) => {
          console.log('Producto actualizado:', res);
          this.loading.set(false);
          this.toastr.success('Producto actualizado con éxito', 'Operación exitosa');
          this.router.navigate(['modules/products/products']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.loading.set(false);
          this.toastr.error('Error al actualizar el producto', 'Error');
        }
      });
    } else {
      this.productService.save(productPayload).subscribe({
        next: (res) => {
          console.log('Producto guardado:', res);
          this.loading.set(false);
          this.toastr.success('Producto registrado con éxito', 'Operación exitosa');
          this.router.navigate(['modules/products/products']);
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.loading.set(false);
          this.toastr.error('Error al registrar el producto', 'Error');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['modules/products/products']);
  }

  get pf(): { [key: string]: AbstractControl } {
    return this.productForm.controls;
  }
}
