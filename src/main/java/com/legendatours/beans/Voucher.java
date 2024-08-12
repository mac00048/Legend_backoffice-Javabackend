package com.legendatours.beans;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Voucher extends AbstractBean {
    private final UUID id;
    private final UUID activityId;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private final LocalDate startDate;
    private final String clientName;
    private final String clientPhone;
    private final String clientEmail;
    private final String voucher;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private final OffsetDateTime redeemDate;

    public Voucher() {
        this(null, null, null, null, null, null, null, null, null, null);
    }

    public Voucher(UUID id, UUID activityId, LocalDate startDate, String clientName, String clientPhone, String clientEmail, String voucher, OffsetDateTime redeemDate,
            OffsetDateTime createdAt, UUID createdBy) {
        this(id, activityId, startDate, clientName, clientPhone, clientEmail, voucher, redeemDate, createdAt, createdBy, null, null);
    }

    public Voucher(UUID id, UUID activityId, LocalDate startDate, String clientName, String clientPhone, String clientEmail, String voucher, OffsetDateTime redeemDate,
            OffsetDateTime createdAt, UUID createdBy, OffsetDateTime updatedAt, UUID updatedBy) {
        this(id, activityId, startDate, clientName, clientPhone, clientEmail, voucher, redeemDate, createdAt, createdBy, updatedAt, updatedBy, null, null);
    }

    public Voucher(UUID id, UUID activityId, LocalDate startDate, String clientName, String clientPhone, String clientEmail, String voucher, OffsetDateTime redeemDate,
            OffsetDateTime createdAt, UUID createdBy, OffsetDateTime updatedAt, UUID updatedBy, OffsetDateTime deletedAt, UUID deletedBy) {
        super(createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy);
        this.id = id;
        this.activityId = activityId;
        this.startDate = startDate;
        this.clientName = clientName;
        this.clientPhone = clientPhone;
        this.clientEmail = clientEmail;
        this.voucher = voucher;
        this.redeemDate = redeemDate;
    }

    public UUID getId() {
        return id;
    }

    public UUID getActivityId() {
        return activityId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public String getClientName() {
        return clientName;
    }

    public String getClientPhone() {
        return clientPhone;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public String getVoucher() {
        return voucher;
    }

    public OffsetDateTime getRedeemDate() {
        return redeemDate;
    }
}
