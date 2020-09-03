import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { HelpComponent } from './help/help.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { DealsComponent } from './deals/deals.component';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { BannerComponent } from './banner/banner.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FooterTopComponent } from './footer/footer-top/footer-top.component';
import { ProductsComponent } from './products/products.component';
import { RecommendationsComponent } from './products/recommendations/recommendations.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { CoreValuesComponent } from './core-values/core-values.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [UserComponent, DashboardComponent, HeaderComponent, FooterComponent, AboutComponent, ContactComponent, FaqComponent, HelpComponent, LoginComponent, RegisterComponent, ResetPasswordComponent, SubscribeComponent, DealsComponent, ComingSoonComponent, BannerComponent, FooterTopComponent, ProductsComponent, ProductDetailComponent, RecommendationsComponent, MarketplaceComponent, CoreValuesComponent, SitemapComponent, PrivacyPolicyComponent],
  imports: [
    CommonModule, UserRoutingModule, FormsModule, HttpClientModule
  ],
  exports: [

  ]
})
export class UserModule { }
