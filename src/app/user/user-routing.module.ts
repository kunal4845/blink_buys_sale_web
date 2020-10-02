import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { HelpComponent } from './help/help.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { CoreValuesComponent } from './core-values/core-values.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { UserLoginComponent } from './login/user-login.component';
import { UserResetPasswordComponent } from './login/reset-password/user-reset-password.component';
import { UserRegisterComponent } from './login/register/user-register.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      { path: "dashboard", component: DashboardComponent },
      { path: "login", component: UserLoginComponent },
      { path: "resetPassword", component: UserResetPasswordComponent },
      { path: "register", component: UserRegisterComponent },
      { path: "contact-us", component: ContactComponent },
      { path: "about-us", component: AboutComponent },
      { path: "faq", component: FaqComponent },
      { path: "help", component: HelpComponent },
      { path: "products", component: ProductsComponent },
      { path: "product-detail/:id", component: ProductDetailComponent },
      { path: "core-values", component: CoreValuesComponent },
      { path: "marketplace", component: MarketplaceComponent },
      { path: "sitemap", component: SitemapComponent },
      { path: "privacy-policy", component: PrivacyPolicyComponent },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
