import { Component, OnInit } from '@angular/core';
import { BasicLayoutComponent } from '../../../basic-layout/basic-layout.component';
import { ScrollService } from '../../scroll-service.service';

@Component({
  selector: 'app-kvkk',
  standalone: true,
  imports: [BasicLayoutComponent],
  templateUrl: './kvkk.component.html',
  styleUrl: './kvkk.component.scss'
})
export class KvkkComponent implements OnInit{

  constructor(private scrollService: ScrollService, ) {}

  ngOnInit(): void {

}
}
