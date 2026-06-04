import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent } from './shared/error/forbidden/forbidden.component';
import { PageNotFoundComponent } from './shared/error/page-not-found/page-not-found.component';
import { LayoutComponent } from './shared/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    children: [{
      path: 'dashboard',
      loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
    }],
  },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    children: [{
      path: 'users',
      loadChildren: () =>
          import('./features/users/users.module').then(m => m.UsersModule)
    }],
  },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    children: [{
      path: 'orders',
      loadChildren: () =>
          import('./features/orders/orders.module').then(m => m.OrdersModule)
    }],
  },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    children: [{
      path: 'customers',
      loadChildren: () =>
          import('./features/customers/customers.module').then(m => m.CustomersModule)
    }],
  },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    children: [{
      path: 'products',
      loadChildren: () =>
          import('./features/products/products.module').then(m => m.ProductsModule)
    }],
  },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    children: [{
      path: 'payments',
      loadChildren: () =>
          import('./features/payments/payments.module').then(m => m.PaymentsModule)
    }],
  },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    children: [{
      path: 'categories',
      loadChildren: () =>
          import('./features/categories/categories.module').then(m => m.CategoriesModule)
    }],
  },
  {
    path: '',
    component: LayoutComponent,
    //canActivate: [AuthGuard],
    children: [{
      path: 'debug',
      loadChildren: () =>
          import('./feature-basics/basics.module').then(m => m.BasicsModule)
    }],
  },
 {
    path: 'not-authorize',
    component: ForbiddenComponent
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
