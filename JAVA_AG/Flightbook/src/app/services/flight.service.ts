import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { BookingDetails, Flight, SearchCriteria } from '../models/flight.model';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  private mockFlights: Flight[] = [
    {
      id: 'FL123',
      flightNumber: 'FL123',
      airline: 'SkyFly',
      departureAirport: 'JFK',
      arrivalAirport: 'LAX',
      departureTime: '2025-08-25T08:00:00',
      arrivalTime: '2025-08-25T11:30:00',
      price: 299.99,
      availableSeats: 120,
      status: 'On Time',
      aircraftType: 'Boeing 737',
      duration: 210,
      cabinClass: 'Economy',
      stops: 0,
      departureCity: 'New York',
      arrivalCity: 'Los Angeles',
      departureTerminal: '4',
      arrivalTerminal: '5',
      departureGate: 'B12',
      arrivalGate: 'A7',
      departureDate: '2025-08-25',
      returnDate: '2025-08-30',
      bookingClass: 'Y',
      fareBasis: 'Y26',
      fareRules: 'Refundable with fee',
      baggageAllowance: '1 x 23kg',
      cabinBaggageAllowance: '1 x 7kg',
      checkInStartTime: '2025-08-24T20:00:00',
      checkInEndTime: '2025-08-25T07:00:00',
      operatingCarrier: 'SkyFly',
      operatingFlightNumber: 'FL123',
      aircraftRegistration: 'N123SF',
      flightDistance: 2475,
      timezoneDifference: -3,
      mealService: true,
      wifiAvailable: true,
      entertainment: true,
      powerOutlets: true,
      layoverDuration: 0,
      totalTravelTime: 210,
      isCodeShare: false,
      codeSharePartners: [],
      fare: 299.99,
      taxes: 50.00,
      fees: 25.00,
      totalPrice: 374.99,
      currency: 'USD',
      available: true
    }
  ];

  searchFlights(criteria: SearchCriteria): Observable<Flight[]> {
    // Try to call the real API first
    return this.http.post<Flight[]>(`${this.baseUrl}/flights/search`, criteria).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Using mock data for flights search');
        // Return mock data if the API call fails
        return of(this.mockFlights).pipe(delay(500)); // Add a small delay to simulate network
      })
    );
  }

  getFlightByNumber(flightNumber: string): Observable<Flight> {
    // Try to call the real API first
    return this.http.get<Flight>(`${this.baseUrl}/flights/${encodeURIComponent(flightNumber)}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Using mock data for flight details');
        // Return mock data if the API call fails
        const flight = this.mockFlights.find(f => f.flightNumber === flightNumber);
        return flight ? of(flight).pipe(delay(300)) : 
          throwError(() => new Error('Flight not found'));
      })
    );
  }

  bookFlight(details: BookingDetails): Observable<{ bookingId: string; message: string }> {
    // Try to call the real API first
    return this.http.post<{ bookingId: string; message: string }>(`${this.baseUrl}/bookings`, details).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('Using mock booking response');
        // Return mock success response
        return of({
          bookingId: `MOCK-${Math.floor(Math.random() * 1000000)}`,
          message: 'Booking successful (mock data)'
        }).pipe(delay(500));
      })
    );
  }
}
