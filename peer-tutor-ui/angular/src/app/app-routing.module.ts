import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { DetailsComponent } from './details/details.component';
import { PostsComponent } from './posts/posts.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterComponent } from './register';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'class/:id',
    component: DetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts',
    component: PostsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'logout',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
