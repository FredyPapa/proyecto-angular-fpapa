import { Component, computed, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { User } from '../../model/user';
import { UserService } from '../../service/user.service';
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
  selector: 'app-user-list',
  styleUrl: './user-list.component.css',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  public modalRef?: BsModalRef;
  public userSelected?: User;

  public users = signal<User[]>([]);
  public loading = signal<boolean>(false);
  public itemsPerPage: number = GLOBAL.ITEMS_BY_PAGE;
  private startItem = signal<number>(0);
  private endtItem = signal<number>(GLOBAL.ITEMS_BY_PAGE);

  private userService = inject(UserService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private modalService = inject(BsModalService);

  ngOnInit(): void {
    this.getAll();
  }

  new(): void {
    this.router.navigate(['modules/users/users/details']);
  }

  edit(user: User): void {
    if (!user.id) return;
    this.router.navigate(['modules/users/users/details', user.id]);
  }

  view(user: User, template: TemplateRef<void>): void {
    this.userSelected = user;
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  delete(user: User): void {
    if (!user.id) return;

    Swal.fire({
      title: '¿Confirmar eliminación?',
      text: `Se eliminará el usuario: "${user.username}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(user.id!).subscribe({
          next: () => {
            this.users.update((prev) => prev.filter((u) => u.id !== user.id));
            this.toastr.success('Usuario eliminado con éxito', 'Operación exitosa');
          },
          error: (err) => {
            console.error('Error al eliminar usuario:', err);
            this.toastr.error('Error al eliminar el usuario', 'Error');
          }
        });
      }
    });
  }

  getAll(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users.set(res);
        this.startItem.set(0);
        this.endtItem.set(this.itemsPerPage);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.toastr.error('Error al cargar la lista de usuarios', 'Error');
        this.loading.set(false);
      }
    });
  }

  public usersItems = computed(() => {
    const content = this.users();
    const start = this.startItem();
    const end = this.endtItem();
    return content.slice(start, end);
  });

  pageChanged(event: PageChangedEvent): void {
    this.startItem.set((event.page - 1) * this.itemsPerPage);
    this.endtItem.set(event.page * this.itemsPerPage);
  }
}
