import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterComponent } from './register';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [
  {
    path: 'schedule/:classname/:studentid', //Making schedule w/ this route can automatically schedule class title
    component: SchedulerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'schedule/:studentid', //this route compare self user and targeted user's schedule
    component: SchedulerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'schedule', //this route only manage user's own schedule
    component: SchedulerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'class/:id',
    component: DetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'student/:id',
    component: StudentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [AuthGuard],
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
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: '',
    component: HomePageComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
