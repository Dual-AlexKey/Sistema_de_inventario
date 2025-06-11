import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  correo = '';
  contrasena = '';
  error = '';

  errorMsg: string = '';  // <- Aquí agregas la propiedad errorMsg

  constructor(private authService: AuthService, private router: Router) {}
login(form: NgForm) {
  if (form.invalid) {
    this.error = 'Por favor, completa todos los campos correctamente.';
    return;
  }

  this.error = ''; // limpia error previo
  console.log('Intentando hacer login con:', this.correo, this.contrasena);  // Log para verificar los datos enviados
  this.authService.login(this.correo, this.contrasena).subscribe({
    next: (res) => {
      this.router.navigate(['/intro']); // redirige al dashboard o principal
      form.resetForm(); // opcional: limpia el formulario
    },
    error: (err) => {
      console.log('Error al hacer login:', err);  // Log de error
      this.error = err.error?.error || err.error?.message || 'Credenciales inválidas';
    }
  });
}



  onSubmit() {
    this.errorMsg = '';
    this.authService.login(this.correo, this.contrasena).subscribe({
      next: () => this.router.navigate(['/intro']),
      error: (err) => (this.errorMsg = err.error?.error || 'Error al iniciar sesión'),
    });
  }
  navigateRegister(event: Event) {
  event.preventDefault();
  this.router.navigate(['/register']);
}
}
