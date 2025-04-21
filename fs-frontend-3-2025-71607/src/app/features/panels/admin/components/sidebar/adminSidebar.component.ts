import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../../../../core/auth/services/token.service';

import { Admin } from '../../models/admin';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';



@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule,],
  templateUrl: './adminSidebar.component.html',
  styleUrl: './adminSidebar.component.scss',
})
export class AdminSidebarComponent implements OnInit {
  admin: Admin;
  adminName: string = '';

  constructor(
    private tokenService: TokenService,
    private adminService: AdminService,
    private authService:AuthService,
    private toastrService:ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAdminProfile();
  }

  getAdminProfile() {
    this.adminService.getAdminProfile().subscribe((admin) => {
      this.adminName = admin.firstName + ' ' + admin.lastName;
      return this.adminName;
    });
  }

  logout(): void {
    this.authService.logout();
    this.toastrService.success(
      'Başarıyla çıkış yaptınız. Giriş sayfasına yönlendiriliyorsunuz',
      'Başarılı'
    );
    this.router.navigate(['/']); // Giriş sayfasına yönlendir
  }
}
