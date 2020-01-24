import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { InstructorComponent } from './instructor';
import { LoginComponent } from './login';
import { AuthGuard } from './helper';
import { Role } from './model';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: InstructorComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Instructor] }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'detail/:id',
    component: DetailComponent
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const AppRoutingModule = RouterModule.forRoot(routes);