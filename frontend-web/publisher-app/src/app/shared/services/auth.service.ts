import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'authData';

  constructor() { }

  saveUser(username: string, role: string) {
    localStorage.setItem(this.storageKey, JSON.stringify({username, role}));
  }

  getUser() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  clearUser() {
    localStorage.removeItem(this.storageKey);
  }
}
