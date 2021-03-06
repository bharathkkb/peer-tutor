import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatIconModule, MatSelectModule, MatTableModule, MatListModule, MatSortModule, MatProgressSpinnerModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { DetailsComponent } from './details/details.component';

import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { fakeBackendProvider, JwtInterceptorProvider } from './_helpers';
import { AuthGuard } from './_guards';
import { HomePageComponent } from './home-page/home-page.component';
import { NavbarComponent } from './navbar/navbar.component';

//Scheduler thingy
import { SchedulerComponent } from './scheduler/scheduler.component';
import { DayViewSchedulerComponent } from './scheduler/day-view-scheduler.component';
import { CalendarModule, DateAdapter } from 'angular-calendar'
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AddScheduleModalComponent } from './scheduler/add-schedule-modal/add-schedule-modal.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PopupMsgComponent } from './popup-msg/popup-msg.component';
import { StudentComponent } from './student/student.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';


@NgModule({
  declarations: [
    AppComponent,
    DetailsComponent,
    LoginComponent,
    RegisterComponent,
    HomePageComponent,
    NavbarComponent,
    
    SchedulerComponent,
    DayViewSchedulerComponent,
    AddScheduleModalComponent,
    AboutComponent,
    ContactComponent,
    PopupMsgComponent,
    StudentComponent,
    ForgetPasswordComponent,
  ],
  entryComponents: [
    AddScheduleModalComponent,
    PopupMsgComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatSortModule,
    //Material Auto Complete mess
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,  //Angular Calendar or Angular Material???!!!
      useFactory: adapterFactory
    }),
    MatDialogModule,
  ],
  providers: [
    JwtInterceptorProvider,
    fakeBackendProvider,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
