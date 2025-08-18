package com.example.flightbook.controller;

import com.example.flightbook.model.BookingConfirmation;
import com.example.flightbook.model.BookingDetails;
import com.example.flightbook.model.Flight;
import com.example.flightbook.model.SearchCriteria;
import com.example.flightbook.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @PostMapping("/flights/search")
    public ResponseEntity<List<Flight>> search(@RequestBody SearchCriteria criteria) {
        return ResponseEntity.ok(flightService.search(criteria));
    }

    @GetMapping("/flights/{flightNumber}")
    public ResponseEntity<Flight> getByNumber(@PathVariable String flightNumber) {
        Flight f = flightService.getByNumber(flightNumber);
        if (f == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(f);
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingConfirmation> book(@Valid @RequestBody BookingDetails details) {
        Flight flight = flightService.getByNumber(details.getFlightNumber());
        if (flight == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new BookingConfirmation(null, "Invalid flight number"));
        }
        String id = flightService.allocateBookingId();
        return ResponseEntity.ok(new BookingConfirmation(id, "Booking confirmed for flight " + details.getFlightNumber()));
    }
}
