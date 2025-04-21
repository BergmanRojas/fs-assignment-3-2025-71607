import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router=inject(Router);
  const toastrService=inject(ToastrService);
  const authService=inject(AuthService);

  if(authService.isAuthenticated())
   {
     return true;
   }
 else
 {
   router.navigate(["login"]);
   toastrService.info("Sisteme giriş yapmalısınız");
   return false;
 }

};
