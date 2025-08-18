export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  status: string;
  aircraftType: string;
  duration: number;
  cabinClass: string;
  stops: number;
  departureCity: string;
  arrivalCity: string;
  departureTerminal: string;
  arrivalTerminal: string;
  departureGate: string;
  arrivalGate: string;
  departureDate: string;
  returnDate: string;
  bookingClass: string;
  fareBasis: string;
  fareRules: string;
  baggageAllowance: string;
  cabinBaggageAllowance: string;
  checkInStartTime: string;
  checkInEndTime: string;
  operatingCarrier: string;
  operatingFlightNumber: string;
  aircraftRegistration: string;
  flightDistance: number;
  timezoneDifference: number;
  mealService: boolean;
  wifiAvailable: boolean;
  entertainment: boolean;
  powerOutlets: boolean;
  layoverDuration: number;
  totalTravelTime: number;
  isCodeShare: boolean;
  codeSharePartners: string[];
  fare: number;
  taxes: number;
  fees: number;
  totalPrice: number;
  currency: string;
  available: boolean;
}

export interface FlightOptions {
  directFlights: boolean;
  refundable: boolean;
  baggage: boolean;
}

export interface SearchCriteria {
  from: string;
  to: string;
  departDate: string;
  returnDate: string | null;
  passengers: number;
  cabinClass: 'economy' | 'premium' | 'business' | 'first';
  options: FlightOptions;
  timestamp?: number; // Optional timestamp for change detection
}

export interface BookingDetails {
  flightNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  seatClass: string;
  notes?: string;
  bookingReference?: string;
  status?: string;
  from?: string;
  to?: string;
  departDate?: string;
  returnDate?: string;
  passengers?: number;
  totalPrice?: number;
  currency?: string;
}
