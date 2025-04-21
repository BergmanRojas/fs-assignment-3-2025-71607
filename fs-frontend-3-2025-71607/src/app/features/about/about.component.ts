import { Component, OnInit } from '@angular/core';
import { BasicLayoutComponent } from '../../shared/components/basic-layout/basic-layout.component';
import { ScrollService } from '../../shared/components/footer-content/scroll-service.service';



@Component({
  selector: 'app-about',
  standalone: true,
  imports: [BasicLayoutComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit{

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {

}
}
