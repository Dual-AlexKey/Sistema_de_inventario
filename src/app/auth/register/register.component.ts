import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  nombre = '';
  correo = '';
  contrasena = '';
  cargos_id = 2; // Valor por defecto para nuevo usuario, por ejemplo usuario normal
  error = '';
confirmContrasena = '';

  cargos = [
    { id: 1, nombre: 'Admin' },
    { id: 2, nombre: 'Usuario' },
    { id: 3, nombre: 'Supervisor' },
  ]; // Podrías traerlos desde backend si quieres

  onSubmit() {
    this.authService.register(this.nombre, this.correo, this.contrasena, this.cargos_id).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.error = err.error?.error || 'Error en el registro',
    });
  }
  navigateLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
