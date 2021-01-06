import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { GoldPriceComponent } from './gold-price/gold-price.component';
import { InvoiceHindiComponent } from './invoice-hindi/invoice-hindi.component';
import { LoginComponent } from './login/login.component';
import { OwnerComponent } from './owner/owner.component';
import { ProductChartComponent } from './product-chart/product-chart.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { ViewProductComponent } from './view-product/view-product.component';
import {AuthGuardGuard} from './auth-guard.guard';

const routes: Routes = [
  {path:'',component:LoginComponent,pathMatch:'full'},
  {path:'goldPrice',component:GoldPriceComponent, canActivate: [AuthGuardGuard]},
  {path:'owner',component:OwnerComponent, children:[
    {path:'userProfile',component:UserProfileComponent, canActivate: [AuthGuardGuard]},
    {path:'editProfile',component:EditProfileComponent, canActivate: [AuthGuardGuard]},
    {path:'addProduct',component:AddProductComponent, canActivate: [AuthGuardGuard]},
    {path:'viewProduct',component:ViewProductComponent, canActivate: [AuthGuardGuard]},
    {path:'invoiceHindi',component:InvoiceHindiComponent, canActivate: [AuthGuardGuard]},
    {path:'productChart',component:ProductChartComponent, canActivate: [AuthGuardGuard]},
    {path:'sellProduct',component:AddCustomerComponent, canActivate: [AuthGuardGuard]},
    {path:'viewCustomer',component:ViewCustomerComponent, canActivate: [AuthGuardGuard]}
 ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
