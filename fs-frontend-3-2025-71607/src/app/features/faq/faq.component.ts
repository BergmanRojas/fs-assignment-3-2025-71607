import { Component, OnInit } from '@angular/core';
import { BasicLayoutComponent } from '../../shared/components/basic-layout/basic-layout.component';
import { ScrollService } from '../../shared/components/footer-content/scroll-service.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [BasicLayoutComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit{

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {

}
}

