
import { HttpInterceptorFn } from '@angular/common/http';



export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token=localStorage.getItem("token");
  let newRequest=req.clone({
    setHeaders:{
      Authorization:`Bearer ${token}`
  }
})
  return next(newRequest);
};

/* import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  
  // Check if we are in the browser platform
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');
    if (token) {
      const newRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(newRequest);
    }
  }
  
  // If not in browser or no token, proceed with the original request
  return next(req);
};
 */ /* local storage hatasını almamak için denedim bi şeyler fakat başka hatalar verdi -ö */
