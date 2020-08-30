import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminService } from './admin.service';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { DataTablesModule } from 'angular-datatables';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { Interceptor } from '../shared/interceptor/http.intercepter';
import { HttpErrorInterceptor } from '../shared/interceptor/http-error.interceptor';
import { ServiceProviderRequestComponent } from './service-provider/service-provider-request/service-provider-request.component';
import { DealerRequestComponent } from './dealer/dealer-request/dealer-request.component';
import { DealerListComponent } from './dealer/dealer-list/dealer-list.component';
import { ServiceProviderListComponent } from './service-provider/service-provider-list/service-provider-list.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce,
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    ServiceProviderListComponent,
    ServiceProviderRequestComponent,
    DealerRequestComponent,
    DealerListComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    AdminRoutingModule,
    NgxSmoothDnDModule,
    DataTablesModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    SharedModule,
    NgSelectModule
  ],
  providers: [AdminService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }]
})
export class AdminModule { }
