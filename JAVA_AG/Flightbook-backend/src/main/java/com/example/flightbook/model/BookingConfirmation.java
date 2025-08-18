package com.example.flightbook.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingConfirmation {
    private String bookingId;
    private String message;
}
