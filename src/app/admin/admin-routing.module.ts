import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServiceProviderListComponent } from './service-provider/service-provider-list/service-provider-list.component';
import { ServiceProviderRequestComponent } from './service-provider/service-provider-request/service-provider-request.component';
import { DealerListComponent } from './dealer/dealer-list/dealer-list.component';
import { DealerRequestComponent } from './dealer/dealer-request/dealer-request.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ProductsComponent } from './products/products.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AddServiceComponent } from './services/add-service/add-service.component';
import { CategoryComponent } from './category/category.component';
import { DealerComponent } from './dealer/dealer.component';
import { ServiceProviderComponent } from './service-provider/service-provider.component';
import { BookedServicesComponent } from './services/booked-services/booked-services.component';
import { MyServicesComponent } from './services/my-services/my-services.component';
import { SubCategoryComponent } from './category/sub-category/sub-category.component';



const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: '', component: AdminComponent, children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'service-providers', component: ServiceProviderListComponent },
            { path: 'provider-requests', component: ServiceProviderRequestComponent },
            { path: 'dealers', component: DealerListComponent },
            { path: 'dealer-requests', component: DealerRequestComponent },
            { path: 'add-product/:id', component: AddProductComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'profile', component: AdminProfileComponent },
            { path: 'services', component: AddServiceComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'dealer-detail/:id', component: DealerComponent },
            { path: 'serviceProvider-detail/:id', component: ServiceProviderComponent },
            { path: 'booked-services', component: BookedServicesComponent },
            { path: 'my-services/:id', component: MyServicesComponent },
            { path: 'sub-category', component: SubCategoryComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
