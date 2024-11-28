import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  onLogout() {
    this.authService.clearUser();
    this.router.navigate(['/login']);
  }

}
