import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  loading = true;

  constructor() {}

  ngOnInit(): void {
    // Don't load data on home - it's a public landing page
    this.loading = false;
    
    // Mock categories for display
    this.categories = [
      { id: 1, name: 'Electronics', description: 'Latest tech gadgets' },
      { id: 2, name: 'Fashion', description: 'Trendy clothing' },
      { id: 3, name: 'Home & Garden', description: 'Home essentials' },
      { id: 4, name: 'Sports', description: 'Sports equipment' }
    ];
  }
}
