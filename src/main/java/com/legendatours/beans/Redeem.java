package com.legendatours.beans;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Redeem extends Activity {
    private final List<ActivityDay> days;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private final LocalDate startDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private final LocalDateTime expirationDate;

    public Redeem(Activity activity, List<ActivityDay> days, LocalDate startDate, LocalDateTime expirationDate) {
        super(
            activity.getId(),
            activity.getTitle(),
            activity.getSubtitle(),
            activity.getDescription(),
            activity.getImages(),
            activity.getCreatedAt(),
            activity.getCreatedBy(),
            activity.getUpdatedAt(),
            activity.getUpdatedBy(),
            activity.getDeletedAt(),
            activity.getDeletedBy());

        this.days = days;
        this.startDate = startDate;
        this.expirationDate = expirationDate;
    }

    public List<ActivityDay> getDays() {
        return days;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }
}
