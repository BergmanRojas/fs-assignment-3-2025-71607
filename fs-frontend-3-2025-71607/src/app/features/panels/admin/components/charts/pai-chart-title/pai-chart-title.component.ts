import { Component, OnInit } from '@angular/core';

import { LegendPosition, NgxChartsModule, ColorHelper } from '@swimlane/ngx-charts';
import { AdminSidebarComponent } from "../../sidebar/adminSidebar.component";
import { DoctorService } from '../../../../doctor/services/doctor.service';


@Component({
  selector: 'app-pai-chart-title',
  standalone: true,
  templateUrl: './pai-chart-title.component.html',
  styleUrls: ['./pai-chart-title.component.scss'],
  imports: [NgxChartsModule, AdminSidebarComponent]
})
export class PaiChartTitleComponent implements OnInit {

  single: any[] = [];
  view: [number, number] = [600, 300];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Right;
  legendTitle:string="Ünvan";
  doughnut:boolean=true;
  constructor(private doctorService: DoctorService) {

  }

  colorScheme: any = {
    domain: this.generateColors()
  };

  generateColors(): string[] {
    return [
      '#1E90FF',
      '#5733FF', // Electric Indigo
      '#FF5733', // Red
      '#57FF33', // Neon Green
      '#FF33F6'  ,// Fuchsia
      '#3357FF', // Blue
      '#FFA500',
      '#FF4500',
      '#AAAAAA',
      '#FF5733', // Vibrant Red-Orange
      '#33FF57', // Bright Green
      '#3357FF', // Vivid Blue
      '#FF33A5', // Bright Pink
      '#33FFF0', // Aqua
      '#FFBD33', // Warm Orange
      '#A533FF', // Purple
      '#FF5733', // Coral
      '#33A1FF', // Light Blue
      '#FF5733', // Tomato Red
      '#A5FF33', // Lime Green
      '#5733FF', // Indigo
      '#FFC733', // Yellow Orange
      '#FF33C7', // Magenta
      '#33FFB5', // Mint Green
    ]
  }


  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.doctorService.getDoctors(0, 1000).subscribe(response => {

      const grouped: any = {};
      response.items.forEach((doctor:any) => {
        const title = doctor.title;
        if (!grouped[title]) {
          grouped[title] = [];
        }
        grouped[title].push(doctor);
      });
      this.single = Object.keys(grouped).map(titleName => ({
        name: titleName,
        value: grouped[titleName].length
      }));
    });
  }


  onSelect(event: any): void {
  }

  onActivate(event: any): void {
  }

  onDeactivate(event: any): void {
  }
}
