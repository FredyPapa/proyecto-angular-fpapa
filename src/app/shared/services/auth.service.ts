import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UserSession {
  id?: number;
  name: string;
  email: string;
  username: string;
  avatarLetter: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private userUri = `${environment.URL_BASE}/users`;

  private currentUserSignal = signal<UserSession | null>(null);
  public currentUser = computed(() => this.currentUserSignal());

  constructor() {
    this.initUserFromSession();
  }

  public initUserFromSession(): void {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        this.currentUserSignal.set(parsed);
        return;
      } catch (e) {
        console.error('Error al analizar usuario de sessionStorage:', e);
      }
    }

    const token = sessionStorage.getItem('token');
    if (token) {
      this.loadUserFromToken(token);
    }
  }

  public loadUserFromToken(token: string, fallbackUsername?: string): void {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        const userId = payload.sub;
        const username = payload.user || fallbackUsername || 'Usuario';

        const displayName = this.formatName(username);
        const initialUser: UserSession = {
          id: userId,
          name: displayName,
          email: `${username}@email.com`,
          username: username,
          avatarLetter: (displayName.charAt(0) || 'U').toUpperCase()
        };

        this.currentUserSignal.set(initialUser);
        sessionStorage.setItem('currentUser', JSON.stringify(initialUser));

        if (userId) {
          this.http.get<any>(`${this.userUri}/${userId}`).subscribe({
            next: (apiUser) => {
              let fullName = '';
              if (apiUser.name && (apiUser.name.firstname || apiUser.name.lastname)) {
                const first = this.capitalize(apiUser.name.firstname || '');
                const last = this.capitalize(apiUser.name.lastname || '');
                fullName = `${first} ${last}`.trim();
              } else if (apiUser.username) {
                fullName = this.formatName(apiUser.username);
              }

              const fullUser: UserSession = {
                id: apiUser.id || userId,
                name: fullName || initialUser.name,
                email: apiUser.email || initialUser.email,
                username: apiUser.username || username,
                avatarLetter: (fullName || username || 'U').charAt(0).toUpperCase()
              };

              this.currentUserSignal.set(fullUser);
              sessionStorage.setItem('currentUser', JSON.stringify(fullUser));
            },
            error: (err) => {
              console.warn('No se pudo obtener información detallada del usuario desde la API:', err);
            }
          });
        }
      }
    } catch (e) {
      console.error('Error al decodificar token de autenticación:', e);
    }
  }

  public setUser(user: UserSession): void {
    this.currentUserSignal.set(user);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  public logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
  }

  private capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  private formatName(username: string): string {
    if (!username) return 'Usuario';
    return username
      .split(/[._-]/)
      .map((part) => this.capitalize(part))
      .join(' ');
  }
}
