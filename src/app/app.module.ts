import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { OwnerComponent } from './owner/owner.component';
import { ErrorComponent } from './error/error.component';
import {UserService} from './user.service';
import {ProductService} from './product.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddProductComponent } from './add-product/add-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ProductChartComponent } from './product-chart/product-chart.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { AngularFireModule } from "@angular/fire";
import { environment } from "../environments/environment";
import {
  AngularFireStorageModule,
  AngularFireStorageReference,
  AngularFireUploadTask
} from "@angular/fire/storage";
import { GoldPriceComponent } from './gold-price/gold-price.component';
import { WindowComponent } from './window/window.component';
import { PortalModule } from '@angular/cdk/portal';
import { CustomerDetailsComponent, BottomSheet, AssetExchange } from './customer-details/customer-details.component';
import { FilterPipe } from './filter.pipe';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InvoiceHindiComponent } from './invoice-hindi/invoice-hindi.component';
import {MyAlertDialogComponent} from './view-customer/view-customer.component'
import { AuthGuardGuard } from './auth-guard.guard';
import {TokenInterceptorService} from './token-interceptor.service';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    OwnerComponent,
    ErrorComponent,
    LoginComponent,
    UserProfileComponent,
    EditProfileComponent,
    AddProductComponent,
    ViewProductComponent,
    ProductChartComponent,
    AddCustomerComponent,
    ViewCustomerComponent,
    GoldPriceComponent,
    WindowComponent,
    CustomerDetailsComponent,
    FilterPipe,
    AddItemComponent,
    EditItemComponent,
    BottomSheet,
    AssetExchange,
    InvoiceHindiComponent,
    MyAlertDialogComponent
  ],
  entryComponents: [ErrorComponent,CustomerDetailsComponent, AddItemComponent, EditItemComponent, MyAlertDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    PortalModule,
    AngularFireStorageModule,
    DragDropModule,
    ChartsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, "cloud")
  ],
  providers: [UserService, ProductService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptorService,
      multi:true
    },
    AuthGuardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
