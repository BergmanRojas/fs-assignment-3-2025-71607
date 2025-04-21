import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Message } from '../../models/message';

@Component({
  selector: 'app-live-support',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-support.component.html',
  styleUrls: ['./live-support.component.scss']
})
export class LiveSupportComponent {
  messages: Message[] = [];

  initialOptions: Message[] = [
    { id: 1, text: 'Randevu işlemleri' },
    { id: 2, text: 'Kolay üyelik' },
    { id: 3, text: 'Bilgilerim güvende mi?' },
    { id: 4, text: 'Öneri ve Şikayet' }
  ];

  appointmentOptions: Message[] = [
    { id: 101, text: 'Randevu süresi ne kadardır?' },
    { id: 102, text: 'Randevumu nasıl iptal edebilirim?' },
    { id: 103, text: 'Randevularımı nereden görebilirim?' },
    { id: 104, text: 'Randevu alabileceğim doktorlar kimlerdir?' }
  ];

  membershipOptions: Message[] = [
    { id: 201, text: 'Üyelik için ne gerekli?' },
    { id: 202, text: 'Üyelik avantajları nelerdir?' },
    { id: 203, text: 'Üyelik ücretli mi?' },
    { id: 204, text: 'Üyelik bilgilerimi nasıl güncelleyebilirim?' }
  ];

  securityOptions: Message[] = [
    { id: 301, text: 'Bilgilerim güvende mi?' },
    { id: 302, text: 'Veri gizliliği politikası nedir?' },
    { id: 303, text: 'Kişisel bilgilerim kimlerle paylaşılır?' },
    { id: 304, text: 'Veri ihlali durumunda ne yapılır?' }
  ];

  feedbackOptions: Message[] = [
    { id: 401, text: 'Şikayetimi nasıl iletebilirim?' },
    { id: 403, text: 'Öneri ve şikayetler nasıl değerlendirilir?' },
    { id: 404, text: 'Geri bildirim süreci nasıl işler?' }
  ];

  welcomeMessage = 'Merhaba, ben dijital asistanınız Pair5. Size hangi konuda yardımcı olmamı istersiniz?';
  selectedMessageId: number | null = null;  // Seçilen mesajın ID'sini tutmak için değişken
  currentMessages: Message[] = [];  // Gösterilecek mesajlar listesi
  history: Message[][] = [];  // Geçmiş mesaj listelerini tutmak için

  constructor() {
    this.currentMessages = this.initialOptions; // Başlangıçta ilk seçenekleri göster
  }

  selectMessage(message: Message) {
    if (this.selectedMessageId === message.id) {
      this.selectedMessageId = null;  // Aynı mesaja tekrar tıklandığında kapatmak için
    } else {
      this.selectedMessageId = message.id;  // Yeni mesaja tıklandığında ID'yi güncelle
    }

    // Şu anki mesajları history'ye ekleyin
    this.history.push([...this.currentMessages]);

    switch (message.id) {
      case 1:
        this.currentMessages = this.appointmentOptions;
        break;
      case 2:
        this.currentMessages = this.membershipOptions;
        break;
      case 3:
        this.currentMessages = this.securityOptions;
        break;
      case 4:
        this.currentMessages = this.feedbackOptions;
        break;
      default:
        switch (message.id) {
          case 101:
            message.response = 'Randevu süresi genellikle 30 dakikadır.';
            break;
          case 102:
            message.response = 'Randevunuzu iptal etmek için "Randevularım" bölümünden iptal edebilirsiniz.';
            break;
          case 103:
            message.response = 'Randevularınızı hesabınızdaki "Randevularım" bölümünden görebilirsiniz.';
            break;
          case 104:
            message.response = 'Randevu alabileceğiniz doktorları "Doktorlar" bölümünden görebilirsiniz.';
            break;
          case 201:
            message.response = 'Üyelik için ad, soyad, telefon ve şifre girmeniz gerekmektedir.';
            break;
          case 202:
            message.response = 'Üyelik avantajları arasında hızlı randevu erişimi bulunmaktadır.';
            break;
          case 203:
            message.response = 'Üyelik ücretsizdir.';
            break;
          case 204:
            message.response = 'Üyelik bilgilerinizi "Hesabım" bölümünden güncelleyebilirsiniz.';
            break;
          case 301:
            message.response = 'Evet, bilgileriniz güvendedir. Tüm verileriniz şifrelenmektedir.';
            break;
          case 302:
            message.response = 'Veri gizliliği politikamızı "Gizlilik Politikası" bölümünde bulabilirsiniz.';
            break;
          case 303:
            message.response = 'Kişisel bilgileriniz sadece sizin izninizle paylaşılır.';
            break;
          case 304:
            message.response = 'Veri ihlali durumunda size hemen bilgi verilecektir ve gerekli önlemler alınacaktır.';
            break;
          case 401:
            message.response = 'Şikayetlerinizi "Geribildirimlerim" bölümünden yapabilirsiniz.';
            break;
          case 403:
            message.response = 'Öneri ve şikayetleriniz titizlikle değerlendirilir ve ilgili birimlere iletilir.';
            break;
          case 404:
            message.response = 'Geri bildirim süreci, öneri ve şikayetlerin alınması, değerlendirilmesi ve sonuçlandırılması aşamalarını içerir.';
            break;
          default:
            message.response = 'Belirtilen konu hakkında bilgi bulunamadı.';
        }
    }
  }
  goBack() {
    if (this.history.length > 0) {
      this.currentMessages = this.history.pop() || this.initialOptions;  // Geçmişteki mesaj listesini geri yükle
      this.selectedMessageId = null;  // Seçili mesajı temizle
    }
  }
}
