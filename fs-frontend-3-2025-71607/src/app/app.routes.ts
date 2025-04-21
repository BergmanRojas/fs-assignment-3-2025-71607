import { Routes } from '@angular/router';
import { authRoutes } from './routes/auth/auth.routes';
import { homepageRoutes } from './routes/home-page/homepages.routes';
import { adminRoutes } from './routes/admins/admins.routes';
import { doctorRoutes } from './routes/doctors/doctors.routes';
import { patientRoutes } from './routes/patients/patients.routes';

export const routes: Routes = [

    ...authRoutes,
    ...homepageRoutes,
    ...adminRoutes,
    ...doctorRoutes,
    ...patientRoutes  
    
];
