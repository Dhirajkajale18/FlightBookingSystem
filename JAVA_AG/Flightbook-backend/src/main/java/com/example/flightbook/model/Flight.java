package com.example.flightbook.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Flight {
    private String flightNumber;
    private String route; // e.g., "Mumbai → Delhi"
    private String departTime; // e.g., 07:10
    private String arriveTime; // e.g., 09:10
    private String duration;   // e.g., 2h 00m
    private int price;
    private String currency;
    private boolean available;
}
