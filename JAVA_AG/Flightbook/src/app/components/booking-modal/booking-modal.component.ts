import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingDetails, Flight } from '../../models/flight.model';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.css'
})
export class BookingModalComponent {
  isOpen = input<boolean>(false);
  selectedFlight = input<Flight | null>(null);

  closeModal = output<void>();
  confirmBooking = output<BookingDetails>();

  onClose() { this.closeModal.emit(); }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  onConfirm() {
    const flight = this.selectedFlight();
    if (!flight) {
      this.onClose();
      return;
    }
    // Minimal booking payload; replace with real form as needed
    const booking: BookingDetails = {
      flightNumber: flight.flightNumber,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '0000000000',
      seatClass: flight.cabinClass || 'Economy',
      notes: 'Auto-generated booking',
      from: flight.departureAirport,
      to: flight.arrivalAirport,
      departDate: flight.departureDate,
      passengers: 1,
      totalPrice: flight.price,
      currency: flight.currency || 'USD'
    };
    this.confirmBooking.emit(booking);
  }
}
