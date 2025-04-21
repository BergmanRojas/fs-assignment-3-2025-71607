import { Component, OnInit } from '@angular/core';
import { BasicLayoutComponent } from '../../../basic-layout/basic-layout.component';
import { ScrollService } from '../../scroll-service.service';


@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [BasicLayoutComponent],
  templateUrl: './cookie-policy.component.html',
  styleUrl: './cookie-policy.component.scss'
})
export class CookiePolicyComponent implements OnInit{

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {

  }
}
