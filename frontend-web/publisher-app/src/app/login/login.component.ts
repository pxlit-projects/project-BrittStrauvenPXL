import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  role: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(form: any) {
    if (form.valid) {
      this.authService.saveUser(this.username, this.role);
      this.router.navigate(['/posts']);
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
