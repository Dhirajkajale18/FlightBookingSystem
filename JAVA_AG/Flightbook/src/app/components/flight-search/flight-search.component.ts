import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Flight, BookingDetails, SearchCriteria } from '../../models/flight.model';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {
  private flightService = inject(FlightService);
  private fb = inject(FormBuilder);
  
  bookingForm: FormGroup;
  today = new Date().toISOString().split('T')[0];
  minReturnDate: string = this.today;
  isRoundTrip = true;
  isBooking = false;
  bookings: BookingDetails[] = [];
  showFlightOptions = false;
  
  @Output() searchFlights = new EventEmitter<SearchCriteria>();
  @Output() searchInitiated = new EventEmitter<boolean>();

  constructor() {
    this.bookingForm = this.fb.group({
      // Flight details
      from: ['', Validators.required],
      to: ['', Validators.required],
      departDate: [this.today, Validators.required],
      returnDate: [''],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      cabinClass: ['economy', Validators.required],
      
      // Flight options
      directFlights: [false],
      refundable: [false],
      baggage: [true],
      
      // Passenger details
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      notes: ['']
    });

    // Set up return date validation
    this.bookingForm.get('departDate')?.valueChanges.subscribe(date => {
      if (date) {
        this.minReturnDate = date;
        if (this.isRoundTrip) {
          this.bookingForm.patchValue({ returnDate: date });
        }
      }
    });
  }

  ngOnInit(): void {
    // Set default values
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.bookingForm.patchValue({
      departDate: tomorrow.toISOString().split('T')[0]
    });
  }

  toggleTripType(isRound: boolean) {
    this.isRoundTrip = isRound;
    const returnDateControl = this.bookingForm.get('returnDate');
    
    if (!isRound) {
      // If switching to one-way, clear the return date
      returnDateControl?.clearValidators();
    } else {
      // If switching to round-trip, add required validator and set default return date
      returnDateControl?.setValidators(Validators.required);
      if (!returnDateControl?.value) {
        const departDate = this.bookingForm.get('departDate')?.value || this.today;
        this.bookingForm.patchValue({ returnDate: departDate });
      }
    }
    
    returnDateControl?.updateValueAndValidity();
  }

  onSearch(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    
    // Emit that search has been initiated
    this.searchInitiated.emit(true);
    
    const searchCriteria: SearchCriteria = {
      from: this.bookingForm.get('from')?.value,
      to: this.bookingForm.get('to')?.value,
      departDate: this.bookingForm.get('departDate')?.value,
      returnDate: this.bookingForm.get('returnDate')?.value || null,
      passengers: this.bookingForm.get('passengers')?.value,
      cabinClass: this.bookingForm.get('cabinClass')?.value,
      options: {
        directFlights: this.bookingForm.get('directFlights')?.value,
        refundable: this.bookingForm.get('refundable')?.value,
        baggage: this.bookingForm.get('baggage')?.value
      },
      // Add a timestamp to force change detection
      timestamp: new Date().getTime()
    };
    
    this.searchFlights.emit(searchCriteria);
  }

  onSubmitBooking() {
    if (this.bookingForm.invalid) {
      this.markFormGroupTouched(this.bookingForm);
      return;
    }

    this.isBooking = true;
    const formValue = this.bookingForm.value;
    
    // Create a booking object
    const booking: BookingDetails = {
      flightNumber: 'FL' + Math.floor(1000 + Math.random() * 9000), // Mock flight number
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phone: formValue.phone,
      seatClass: formValue.cabinClass,
      notes: formValue.notes
    };

    // In a real app, you would call the flight service to book the flight
    // For now, we'll simulate a successful booking
    setTimeout(() => {
      this.bookings = [booking, ...this.bookings];
      this.isBooking = false;
      
      // Show success message
      alert(`✅ Booking confirmed!\n\n` +
            `Passenger: ${booking.firstName} ${booking.lastName}\n` +
            `Flight: ${booking.flightNumber}\n` +
            `Class: ${booking.seatClass.charAt(0).toUpperCase() + booking.seatClass.slice(1)}`);
      
      // Reset the form but keep the flight details
      this.bookingForm.patchValue({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        notes: ''
      });
    }, 1000);
  }
  
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  toggleFlightOptions() {
    this.showFlightOptions = !this.showFlightOptions;
  }

  viewBookingDetails(booking: BookingDetails) {
    // In a real app, you would navigate to a booking details page
    alert(`Viewing details for booking ${booking.bookingReference || 'N/A'}\n` +
          `Flight: ${booking.flightNumber}\n` +
          `Passenger: ${booking.firstName} ${booking.lastName}\n` +
          `Class: ${booking.seatClass.charAt(0).toUpperCase() + booking.seatClass.slice(1)}`);
  }
  
  cancelBooking(booking: BookingDetails) {
    if (confirm(`Are you sure you want to cancel booking for ${booking.firstName} ${booking.lastName}?`)) {
      this.bookings = this.bookings.filter(b => b !== booking);
      alert('Booking has been cancelled.');
    }
  }
}
