import { Routes } from '@angular/router';
import { RegisterPage } from './pages/register/register.page';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
  loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  canActivate: [authGuard]
  },
  {
    path: 'add-contact',
    loadComponent: () => import('./pages/add-contact.page').then(m => m.AddContactPage),
    canActivate: [authGuard]
  },

];
