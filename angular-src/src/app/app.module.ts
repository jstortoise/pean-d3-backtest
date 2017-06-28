import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router'

// Components Import
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UploadComponent } from './components/upload/upload.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { BacktestComponent } from './components/backtest/backtest.component';
import { RegisterComponent } from './components/register/register.component';

// Services Import
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { ChartComponent } from './components/chart/chart.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path:'home', component: HomeComponent },
  { path:'register', component: RegisterComponent },
  { path:'login', component: LoginComponent },
  { path:'upload', component: UploadComponent, canActivate: [AuthGuard]},
  { path:'backtest', component: BacktestComponent, canActivate: [AuthGuard]},
  { path:'chart/:id', component: ChartComponent, canActivate: [AuthGuard]},
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UploadComponent,
    HomeComponent,
    LoginComponent,
    BacktestComponent,
    RegisterComponent,
    FileSelectDirective,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [ValidateService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
