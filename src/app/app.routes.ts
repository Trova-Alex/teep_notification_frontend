import { Routes } from '@angular/router';
import { ItemListComponent } from './components/item-list/item-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterListComponent } from './register-list/register-list.component';
import { UserListComponent } from './user-list/user-list.component';
import { NotificationRulesComponent } from './notification-rules/notification-rules.component';
import { NotificationRuleFormComponent } from './notification-rule-form/notification-rule-form.component';
import { UserFormComponent } from './user-form/user-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'items', component: ItemListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'register-list', component: RegisterListComponent, canActivate: [AuthGuard] },
  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'notification-rules-list', component: NotificationRulesComponent, canActivate: [AuthGuard] },
  { path: 'notification-rule-form', component: NotificationRuleFormComponent, canActivate: [AuthGuard] },
  { path: 'user-form', component: UserFormComponent, canActivate: [AuthGuard] }
];
