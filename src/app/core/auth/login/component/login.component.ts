import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from '../model/login.request';
import { LoginService } from '../service/login.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  
  loginForm = this.formBuilder.group({
    username:['mor_2314',[Validators.required]],
    password:['83r5^_',[Validators.required]]
  });

  submitted:boolean = false;

  onSubmit(){
    this.submitted = true;

    if(this.loginForm.invalid){
      return;
    }

    const loginRequest:LoginRequest = {
      username: this.pf['username'].value || '',
      password: this.pf['password'].value || ''
    };

    this.loginService.login(loginRequest).subscribe({
      next: (res) =>{
        console.log(res);
        sessionStorage.setItem('token',res.token);
        this.authService.loadUserFromToken(res.token, loginRequest.username);
        this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');
        this.router.navigate(['modules']);
      },
      error: (err) =>{
        console.error('Error al iniciar sesión:', err);
        this.toastr.error('Usuario o contraseña incorrectos', 'Error de inicio de sesión');
      }
    });
  }

  get pf():{[key:string]: AbstractControl}{
    return this.loginForm.controls;
  }
}
