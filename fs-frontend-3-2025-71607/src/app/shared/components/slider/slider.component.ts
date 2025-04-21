import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicLayoutComponent } from "../basic-layout/basic-layout.component";


 @Component({
    selector: 'app-slider',
    standalone: true,
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.scss',
    imports: [CommonModule]
})
export class SliderComponent {
}
