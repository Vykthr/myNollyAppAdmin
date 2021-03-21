import { NewComponent } from './pages/new/new.component';
import { Page404Component } from './pages/page404/page404.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { AuthGuard } from './services/auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'new', component: NewComponent, canActivate: [AuthGuard]},
  { path: 'movies', component: MoviesComponent, canActivate: [AuthGuard]},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: '**', component: Page404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
