package com.example.flightbook.service;

import com.example.flightbook.model.Flight;
import com.example.flightbook.model.SearchCriteria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FlightService {

    private final List<Flight> flights = new ArrayList<>();

    public FlightService() {
        // sample data mirroring frontend
        flights.add(Flight.builder()
                .flightNumber("SF 101")
                .route("Mumbai → Delhi")
                .departTime("07:10")
                .arriveTime("09:10")
                .duration("2h 00m")
                .price(4299)
                .currency("₹")
                .available(true)
                .build());
        flights.add(Flight.builder()
                .flightNumber("SF 224")
                .route("Bengaluru → Kolkata")
                .departTime("11:30")
                .arriveTime("14:05")
                .duration("2h 35m")
                .price(5499)
                .currency("₹")
                .available(true)
                .build());
        flights.add(Flight.builder()
                .flightNumber("SF 350")
                .route("Chennai → Pune")
                .departTime("16:45")
                .arriveTime("18:35")
                .duration("1h 50m")
                .price(3999)
                .currency("₹")
                .available(true)
                .build());
    }

    public List<Flight> search(SearchCriteria criteria) {
        String from = criteria.getFrom() == null ? "" : criteria.getFrom().toLowerCase(Locale.ROOT);
        String to = criteria.getTo() == null ? "" : criteria.getTo().toLowerCase(Locale.ROOT);
        return flights.stream()
                .filter(f -> f.getRoute().toLowerCase(Locale.ROOT).contains(from)
                        && f.getRoute().toLowerCase(Locale.ROOT).contains(to))
                .collect(Collectors.toList());
    }

    public Flight getByNumber(String flightNumber) {
        return flights.stream()
                .filter(f -> f.getFlightNumber().equalsIgnoreCase(flightNumber))
                .findFirst()
                .orElse(null);
    }

    public String allocateBookingId() {
        return UUID.randomUUID().toString();
    }
}
