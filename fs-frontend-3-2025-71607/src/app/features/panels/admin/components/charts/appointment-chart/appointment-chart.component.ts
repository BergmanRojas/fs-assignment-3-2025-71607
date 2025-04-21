import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../../../appointments/services/appointment.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule, formatDate } from '@angular/common';
import { AppointmentCountPerMonth } from './appointmentCountPerMonth';
import { AdminSidebarComponent } from '../../sidebar/adminSidebar.component';


@Component({
    selector: 'app-appointment-chart',
    standalone: true,
    templateUrl: './appointment-chart.component.html',
    styleUrls: ['./appointment-chart.component.scss'],
    imports: [CommonModule,NgxChartsModule,  AdminSidebarComponent]
})
export class AppointmentChartComponent implements OnInit {
  appointmentCounts: AppointmentCountPerMonth[] = [];
  single: any[] = []; // Grafikte kullanılacak veri

  // Grafik ayarları
  view: [number,number] = [600, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Aylar';
  showYAxisLabel = true;
  yAxisLabel = 'Randevu Sayısı';
  legendTitle:string="Ay";


  colorScheme: any = {
    domain: this.generateColors()
  };

  generateColors(): string[] {
    // Burada renklerin dinamik olarak üretilmesi sağlanabilir
    return ['#1E90FF', '#FFA500', '#FF4500', '#AAAAAA',
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
      '#5733FF', // Electric Indigo
      '#FF5733', // Red
      '#57FF33', // Neon Green
      '#FF33F6'  ,// Fuchsia
      '#3357FF', // Blue
    ]
  }
  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.fetchAppointmentCounts();
  }

  fetchAppointmentCounts(): void {
    const currentYear = new Date().getFullYear();
    this.appointmentService.getAllAppointments(0, 1000).subscribe(
      response => {
        const appointments = response.items;

        const appointmentCountsMap = new Map<string, number>();
        appointments.forEach(appointment => {
          if (appointment.date) {
            const formattedDate = this.formatDate(appointment.date);
            const [year, month] = formattedDate.split('-');
            if (Number(year) === currentYear) {
              const count = appointmentCountsMap.get(month) || 0; // Eğer anahtar varsa değeri al, yoksa 0 olarak varsay
              appointmentCountsMap.set(month, count + 1);
            }
          }
        });

        this.appointmentCounts = [];
        appointmentCountsMap.forEach((count, month) => {
          this.appointmentCounts.push({ month: this.getMonthName(month), count });
        });

        this.appointmentCounts.sort((a, b) => this.getMonthNumber(a.month) - this.getMonthNumber(b.month));

        // Grafikte kullanılacak format
         this.single = this.appointmentCounts.map(item => ({
          name: item.month,
          value: item.count
        }));
      }
      
    );
  }
  formatDate(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  getMonthName(month: string): string {
    switch (month) {
      case '01': return 'Ocak';
      case '02': return 'Şubat';
      case '03': return 'Mart';
      case '04': return 'Nisan';
      case '05': return 'Mayıs';
      case '06': return 'Haziran';
      case '07': return 'Temmuz';
      case '08': return 'Ağustos';
      case '09': return 'Eylül';
      case '10': return 'Ekim';
      case '11': return 'Kasım';
      case '12': return 'Aralık';
      default: return '';
    }
  }

  getMonthNumber(monthName: string): number {
    switch (monthName) {
      case 'Ocak': return 1;
      case 'Şubat': return 2;
      case 'Mart': return 3;
      case 'Nisan': return 4;
      case 'Mayıs': return 5;
      case 'Haziran': return 6;
      case 'Temmuz': return 7;
      case 'Ağustos': return 8;
      case 'Eylül': return 9;
      case 'Ekim': return 10;
      case 'Kasım': return 11;
      case 'Aralık': return 12;
      default: return 0;
    }
  }

  onSelect(event: any): void {
    
  }

}
