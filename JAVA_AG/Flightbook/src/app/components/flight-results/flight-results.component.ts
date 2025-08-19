import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Flight } from '../../models/flight.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flight-results',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './flight-results.component.html',
  styleUrls: ['./flight-results.component.css']
})
export class FlightResultsComponent {
  private _flights = signal<Flight[]>([]);
  sortBy = signal<string>('price');
  sortDirection = signal<'asc' | 'desc'>('asc');
  
  @Input() set flights(value: Flight[] | null) {
    this._flights.set(value || []);
  }
  
  get flights(): Flight[] | null {
    return this._flights();
  }
  
  get firstFlight(): Flight | null {
    return this.flights && this.flights.length > 0 ? this.flights[0] : null;
  }
  
  @Input() showResults = false;
  @Output() bookFlight = new EventEmitter<Flight>();

  // Computed property for sorted flights
  sortedFlights = computed<Flight[]>(() => {
    const flights = this._flights();
    const currentSortBy = this.sortBy();
    const currentSortDirection = this.sortDirection();

    if (!flights || !flights.length) return [];
    
    return [...flights].sort((a, b) => {
      let valueA: any, valueB: any;
      
      switch (currentSortBy) {
        case 'price':
          valueA = a.price;
          valueB = b.price;
          break;
        case 'departure':
          valueA = new Date(a.departureTime).getTime();
          valueB = new Date(b.departureTime).getTime();
          break;
        case 'duration':
          valueA = a.duration;
          valueB = b.duration;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) {
        return currentSortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return currentSortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  });

  // Handle sorting column clicks
  onSort(column: string): void {
    if (this.sortBy() === column) {
      // Toggle sort direction if clicking the same column
      this.sortDirection.update((dir: 'asc' | 'desc') => dir === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      this.sortBy.set(column);
      this.sortDirection.set('asc');
    }
  }
  
  // Format duration in minutes to 'Xh Ym' format
  formatDuration(minutes: number | undefined): string {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
  
  // Emit book flight event
  onBook(flight: Flight): void {
    this.bookFlight.emit(flight);
  }
}
