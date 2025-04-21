import { Component, OnInit } from '@angular/core';
import { BasicLayoutComponent } from '../../../basic-layout/basic-layout.component';
import { ScrollService } from '../../scroll-service.service';

@Component({
  selector: 'app-visitor-companion-policy',
  standalone: true,
  imports: [BasicLayoutComponent],
  templateUrl: './visitor-companion-policy.component.html',
  styleUrl: './visitor-companion-policy.component.scss'
})
export class VisitorCompanionPolicyComponent implements OnInit{

  constructor(private scrollService: ScrollService) {}

  ngOnInit(): void {

}
}
