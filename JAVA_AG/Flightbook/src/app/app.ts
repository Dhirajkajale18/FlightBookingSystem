import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';
import { FlightResultsComponent } from './components/flight-results/flight-results.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { Flight, SearchCriteria, BookingDetails } from './models/flight.model';
import { FlightService } from './services/flight.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FlightSearchComponent, FlightResultsComponent, BookingModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = signal('SkyFly');
  searchResults = signal<Flight[]>([]);
  showResults = signal(false);
  isLoading = signal(false);
  isBookingModalOpen = signal(false);
  selectedFlight = signal<Flight | null>(null);
  private flightService = inject(FlightService);

  onSearchInitiated(isSearching: boolean) {
    this.isLoading.set(isSearching);
  }

  onSearchFlights(criteria: SearchCriteria) {
    this.isLoading.set(true);
    this.showResults.set(false);
    
    this.flightService.searchFlights(criteria).subscribe({
      next: (flights) => {
        this.searchResults.set(flights);
        this.showResults.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Search failed', err);
        this.searchResults.set([]);
        this.showResults.set(true);
        this.isLoading.set(false);
        alert('Failed to load flights. Please ensure the backend is running on http://localhost:8080');
      }
    });
  }

  onBookFlight(flight: Flight) {
    this.selectedFlight.set(flight);
    this.isBookingModalOpen.set(true);
  }

  openBookingModal() {
    this.isBookingModalOpen.set(true);
  }

  closeBookingModal() {
    this.isBookingModalOpen.set(false);
    this.selectedFlight.set(null);
  }

  onConfirmBooking(bookingDetails: BookingDetails) {
    this.flightService.bookFlight(bookingDetails).subscribe({
      next: (res) => {
        alert(res.message + `\nBooking ID: ${res.bookingId}`);
        this.closeBookingModal();
      },
      error: (err) => {
        console.error('Booking failed', err);
        alert('Booking failed. Please try again.');
      }
    });
  }
}
