import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../../panels/doctor/models/doctor';
import { BasicLayoutComponent } from '../../../../shared/components/basic-layout/basic-layout.component';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../panels/doctor/services/doctor.service';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, BasicLayoutComponent, FormsModule],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss'
})
export class DoctorListComponent implements OnInit {

  doctors: Doctor[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  isLoading: boolean = true;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  getDoctors() {
    this.isLoading = true;
    this.doctorService.getDoctors(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.doctors = response.items;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
