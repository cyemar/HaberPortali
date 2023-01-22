import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminmessageComponent } from './component/adminmessage/adminmessage.component';
import { EditComponent } from './component/edit/edit.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { MessageComponent } from './component/message/message.component';
import { SignupComponent } from './component/signup/signup.component';
import { SiyasetComponent } from './component/siyaset/siyaset.component';
import { SportComponent } from './component/sport/sport.component';
import { UyeComponent } from './component/uye/uye.component';

const routes: Routes = [
  {
    path: "adminmessage",
    component: AdminmessageComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
  {
    path: "users",
    component: UyeComponent
  },
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "edit",
    component: EditComponent
  },
  {
    path: "sport",
    component: SportComponent
  },
  {
    path: "siyaset",
    component: SiyasetComponent
  },
  {
    path: "messages",
    component: MessageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
