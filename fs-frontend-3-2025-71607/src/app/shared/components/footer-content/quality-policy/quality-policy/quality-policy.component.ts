import { Component, OnInit } from '@angular/core';
import { BasicLayoutComponent } from '../../../basic-layout/basic-layout.component';
import { ScrollService } from '../../scroll-service.service';

@Component({
  selector: 'app-quality-policy',
  standalone: true,
  imports: [BasicLayoutComponent],
  templateUrl: './quality-policy.component.html',
  styleUrl: './quality-policy.component.scss'
})
export class QualityPolicyComponent implements OnInit{

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {

}
}


