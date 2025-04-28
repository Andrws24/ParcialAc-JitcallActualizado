import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule],
  selector: 'app-register',
  templateUrl: './register.page.html',
})
export class RegisterPage {
  form = this.fb.group({
    name: ['', Validators.required],
    lastName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  async submit() {
    if (this.form.invalid) return;

    const { name, lastName, phone, email, password } = this.form.value;
    try {
      await this.auth.register(email!, password!, name!, lastName!, phone!);
      alert('✅ Registro exitoso');
      this.router.navigateByUrl('/login');
    } catch (error) {
      alert('❌ Error en registro');
      console.error(error);
    }
  }
}
