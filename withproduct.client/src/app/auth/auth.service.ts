import { HttpClient } from "@angular/common/http";
import { LoginRequest } from "./login-request";
import { Observable, tap, BehaviorSubject } from "rxjs";
import { Injectable } from '@angular/core';
import { LoginResult } from "./login-result";
import { environment } from "../../environments/environment.development";
import { RegisterRequest } from "../register/register-request";
import { RegisterResult } from "../register/register-result";


@Injectable({
  providedIn: 'root' 
})

export class AuthService {
  constructor(
    protected http: HttpClient) {
  }
  private tokenKey: string = "token";
  private _authStatus = new BehaviorSubject<boolean>(false);
  public authStatus = this._authStatus.asObservable();

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  init(): void {
    if (this.isAuthenticated())
      this.setAuthStatus(true);
  }

  login(item: LoginRequest): Observable<LoginResult> {
    var url = environment.baseUrl + "api/account/login";
    return this.http.post<LoginResult>(url, item)
      .pipe(tap(loginResult => {
        if (loginResult.success && loginResult.token) {
          localStorage.setItem(this.tokenKey, loginResult.token);
          this.setAuthStatus(true);
        }
      }));
  }
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.setAuthStatus(false);
  }

   setAuthStatus(isAuthenticated: boolean): void {
    this._authStatus.next(isAuthenticated);
  }
  register(data: RegisterRequest): Observable<RegisterResult> {
    var url = environment.baseUrl + "api/account/register";
    return this.http.post<RegisterResult>(url, data)

  }

}
