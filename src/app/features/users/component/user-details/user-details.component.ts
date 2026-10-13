import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  selector: 'app-user-details',
  styleUrl: './user-details.component.css',
  templateUrl: './user-details.component.html',
})
export class UserDetailsComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private activateRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  // Estados reactivos con Signals
  public submitted = signal<boolean>(false);
  public loading = signal<boolean>(false);
  public isEditMode = signal<boolean>(false);

  public userId?: number;

  userForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
  });

  ngOnInit(): void {
    this.activateRoute.params.subscribe({
      next: (params) => {
        if (params['id']) {
          this.userId = Number(params['id']);
          this.isEditMode.set(true);
          this.findById(this.userId);
        } else {
          this.isEditMode.set(false);
        }
      },
    });
  }

  findById(id: number): void {
    this.loading.set(true);
    this.userService.findById(id).subscribe({
      next: (res) => {
        this.pf['username'].setValue(res.username);
        this.pf['email'].setValue(res.email);
        this.pf['password'].setValue(res.password || '');
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al buscar usuario:', err);
        this.toastr.error('Error al cargar datos del usuario', 'Error');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.userForm.invalid) {
      this.toastr.warning('Por favor completa todos los campos requeridos', 'Formulario incompleto');
      return;
    }

    const userPayload: User = {
      id: this.userId,
      username: this.pf['username'].value || '',
      email: this.pf['email'].value || '',
      password: this.pf['password'].value || ''
    };

    this.loading.set(true);

    if (this.isEditMode() && this.userId) {
      this.userService.update(this.userId, userPayload).subscribe({
        next: (res) => {
          console.log('Usuario actualizado:', res);
          this.loading.set(false);
          this.toastr.success('Usuario actualizado con éxito', 'Operación exitosa');
          this.router.navigate(['modules/users/users']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.loading.set(false);
          this.toastr.error('Error al actualizar el usuario', 'Error');
        }
      });
    } else {
      this.userService.save(userPayload).subscribe({
        next: (res) => {
          console.log('Usuario guardado:', res);
          this.loading.set(false);
          this.toastr.success('Usuario registrado con éxito', 'Operación exitosa');
          this.router.navigate(['modules/users/users']);
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.loading.set(false);
          this.toastr.error('Error al registrar el usuario', 'Error');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['modules/users/users']);
  }

  get pf(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }
}
