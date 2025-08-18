package com.example.flightbook.model;

import lombok.Data;

@Data
public class SearchCriteria {
    private String from;
    private String to;
    private String departDate; // ISO string
    private String returnDate; // optional
    private String passengers; // keep as string to match UI
}
