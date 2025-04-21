import { Component } from '@angular/core';
import { TokenService } from '../../../core/auth/services/token.service';
import { ToastrService,IndividualConfig  } from 'ngx-toastr'; // ToastrService import edildi.
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-token',
  standalone: true,
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent {
  tokenExpirationTime: string = '';

  constructor(
    private tokenService: TokenService,
    private toastrService: ToastrService,
    private authService:AuthService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.updateTokenExpirationTime();
    setInterval(() => {
      this.updateTokenExpirationTime();
    }, 1000); // Her saniye güncelle
  }

  private updateTokenExpirationTime(): void {
    const tokenExpirationDate = this.tokenService.getTokenExpirationDate();
    if (tokenExpirationDate) {
      const currentTime = new Date();
      const timeDifference =
        tokenExpirationDate.getTime() - currentTime.getTime();

      if (timeDifference > 0) {
        const totalSeconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Saat/dakika formatında göstermek için formatlama
        this.tokenExpirationTime = this.formatTime(minutes, seconds);

        // Eğer kalan süre 10 saniyeden azsa toastr ile uyarı göster
        if (minutes === 0 && seconds === 1) {
          const remainingTime = `${seconds} saniye`;
          this.toastrService.warning('Oturumunuz sonlanmak üzere', `Kalan Süre: ${remainingTime}`);
        }

      } else {
        this.toastrService.error('Oturumunuzun süresi dolmuştur. Lütfen tekrar giriş yapın');
        this.authService.logout();
        this.router.navigate(['/login']);

      }
    } else {
      this.tokenExpirationTime = 'Token süresi alınamadı';
    }
  }

  private formatTime(minutes: number, seconds: number): string {
    // Saat/dakika formatında göstermek için padStart ile sıfırlarla doldurarak formatlama
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
