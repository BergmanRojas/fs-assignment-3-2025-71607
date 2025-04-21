import { Routes } from '@angular/router';
import { DoctorListComponent } from '../../features/doctors/components/doctor-list/doctor-list.component';
import { HomePageComponent } from './home-page.component';
import { FaqComponent } from '../../features/faq/faq.component';
import { ContactComponent } from '../../features/contact/contact.component';
import { AboutComponent } from '../../features/about/about.component';
import { VisitorCompanionPolicyComponent } from '../../shared/components/footer-content/visitor-companion-policy/visitor-companion-policy/visitor-companion-policy.component';
import { QualityPolicyComponent } from '../../shared/components/footer-content/quality-policy/quality-policy/quality-policy.component';
import { KvkkComponent } from '../../shared/components/footer-content/kvkk/kvkk/kvkk.component';
import { CookiePolicyComponent } from '../../shared/components/footer-content/cookie-policy/cookie-policy/cookie-policy.component';

export const homepageRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'doctors',
    component: DoctorListComponent,
  },
  {
    path: 'faq',
    component: FaqComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'visitor-companion-policy',
    component: VisitorCompanionPolicyComponent,
  },
  {
    path: 'quality-policy',
    component: QualityPolicyComponent,
  },
  {
    path: 'kvkk',
    component: KvkkComponent,
  },
  {
    path: 'cookie-policy',
    component: CookiePolicyComponent,
  },
];
