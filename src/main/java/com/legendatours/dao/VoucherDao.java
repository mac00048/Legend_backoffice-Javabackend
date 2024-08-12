package com.legendatours.dao;

import java.util.List;
import java.util.UUID;

import com.legendatours.beans.Voucher;

import org.jdbi.v3.sqlobject.config.RegisterFieldMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.customizer.Define;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

public interface VoucherDao {

    @SqlQuery("SELECT * " +
              "FROM voucher " +
              "WHERE id=:id AND deleted_at IS NULL LIMIT 1")
    @RegisterFieldMapper(Voucher.class)
    Voucher get(@Bind("id") UUID id);

    @SqlQuery("SELECT * " +
              "FROM voucher " +
              "WHERE voucher=:voucher AND deleted_at IS NULL LIMIT 1")
    @RegisterFieldMapper(Voucher.class)
    Voucher get(@Bind("voucher") String voucher);

    @SqlQuery(
        "SELECT * FROM voucher " +
        "WHERE deleted_at IS NULL " +
        "AND (client_name ILIKE '%' || :query || '%' OR " +
        "     client_phone ILIKE '%' || :query || '%' OR " +
        "     client_email ILIKE '%' || :query || '%' OR " +
        "     voucher ILIKE '%' || :query || '%') " +
        "ORDER BY <orderBy> <order>")
    @RegisterFieldMapper(Voucher.class)
    List<Voucher> list(@Bind("query") String query, @Define("orderBy") String orderBy, @Define("order") String order);

    @SqlUpdate("INSERT INTO voucher (id, activity_id, start_date, client_name, client_phone, client_email, voucher, redeem_date, created_at, created_by) " +
               "VALUES (:id, :activityId, :startDate, :clientName, :clientPhone, :clientEmail, :voucher, :redeemDate, :createdAt, :createdBy)")
    void insert(@BindBean Voucher voucher);

    @SqlUpdate("UPDATE voucher " +
               "SET activity_id=:activityId, start_date=:startDate, client_name=:clientName, client_phone=:clientPhone, client_email=:clientEmail, voucher=:voucher, redeem_date=:redeemDate, updated_at=:updatedAt, updated_by=:updatedBy::uuid " +
               "WHERE id=:id AND deleted_at IS NULL")
    void update(@BindBean Voucher voucher);
    
    @SqlUpdate("UPDATE voucher " +
               "SET deleted_at=:deletedAt, deleted_by=:deletedBy " +
               "WHERE id=:id AND deleted_at IS NULL")
    void delete(@BindBean Voucher voucher);
}
