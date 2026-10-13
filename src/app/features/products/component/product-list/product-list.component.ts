import { Component, computed, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { Product } from '../../model/product';
import { ProductService } from '../../service/product.service';
import { GLOBAL } from '../../../../shared/constants/global';

@Component({
  imports: [
    CommonModule,
    PaginationModule,
    ModalModule
  ],
  providers: [
    BsModalService
  ],
  selector: 'app-product-list',
  styleUrl: './product-list.component.css',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  public modalRef?: BsModalRef;
  public productSelected?: Product;

  public products = signal<Product[]>([]);
  public loading = signal<boolean>(false);
  public itemsPerPage: number = GLOBAL.ITEMS_BY_PAGE;
  private startItem = signal<number>(0);
  private endtItem = signal<number>(GLOBAL.ITEMS_BY_PAGE);

  private productService = inject(ProductService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private modalService = inject(BsModalService);

  ngOnInit(): void {
    this.getAll();
  }

  new(): void {
    this.router.navigate(['modules/products/products/details']);
  }

  edit(product: Product): void {
    if (!product.id) return;
    this.router.navigate(['modules/products/products/details', product.id]);
  }

  view(product: Product, template: TemplateRef<void>): void {
    this.productSelected = product;
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  delete(product: Product): void {
    if (!product.id) return;

    Swal.fire({
      title: '¿Confirmar eliminación?',
      text: `Se eliminará el producto: "${product.title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(product.id!).subscribe({
          next: () => {
            this.products.update((prev) => prev.filter((p) => p.id !== product.id));
            this.toastr.success('Producto eliminado con éxito', 'Operación exitosa');
          },
          error: (err) => {
            console.error('Error al eliminar producto:', err);
            this.toastr.error('Error al eliminar el producto', 'Error');
          }
        });
      }
    });
  }

  getAll(): void {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products.set(res);
        this.startItem.set(0);
        this.endtItem.set(this.itemsPerPage);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.toastr.error('Error al cargar la lista de productos', 'Error');
        this.loading.set(false);
      }
    });
  }

  public productsItems = computed(() => {
    const content = this.products();
    const start = this.startItem();
    const end = this.endtItem();
    return content.slice(start, end);
  });

  pageChanged(event: PageChangedEvent): void {
    this.startItem.set((event.page - 1) * this.itemsPerPage);
    this.endtItem.set(event.page * this.itemsPerPage);
  }
}
