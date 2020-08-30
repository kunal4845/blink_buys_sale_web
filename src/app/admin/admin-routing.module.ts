import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServiceProviderListComponent } from './service-provider/service-provider-list/service-provider-list.component';
import { ServiceProviderRequestComponent } from './service-provider/service-provider-request/service-provider-request.component';
import { DealerListComponent } from './dealer/dealer-list/dealer-list.component';
import { DealerRequestComponent } from './dealer/dealer-request/dealer-request.component';



const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: '', component: AdminComponent, children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'service-providers', component: ServiceProviderListComponent },
            { path: 'provider-requests', component: ServiceProviderRequestComponent },
            { path: 'dealers', component: DealerListComponent },
            { path: 'dealer-requests', component: DealerRequestComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
