
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';



@Component({
    selector: 'app-basic-layout',
    standalone: true,
    templateUrl: './basic-layout.component.html',
    styleUrl: './basic-layout.component.scss',
    imports: [CommonModule, FooterComponent, NavbarComponent]
})
export class BasicLayoutComponent {}

