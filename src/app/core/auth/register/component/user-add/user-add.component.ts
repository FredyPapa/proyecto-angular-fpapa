import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../service/user.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-user-add',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.scss'
})
export class UserAddComponent {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  // Estados reactivos mediante Signals
  public submitted = signal<boolean>(false);
  public loading = signal<boolean>(false);

  userForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
  });

  onSubmit(): void {
    this.submitted.set(true);

    if (this.userForm.invalid) {
      return;
    }

    const newUser: User = {
      username: this.pf['username'].value || '',
      email: this.pf['email'].value || '',
      password: this.pf['password'].value || ''
    };

    this.loading.set(true);

    this.userService.create(newUser).subscribe({
      next: (res) => {
        console.log('Usuario registrado con éxito:', res);
        this.loading.set(false);
        this.toastr.success('Usuario registrado con éxito', 'Registro completado');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        this.loading.set(false);
        this.toastr.error('Error al registrar el usuario', 'Error de registro');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  get pf(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }
}
