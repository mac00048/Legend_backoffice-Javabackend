package com.legendatours.beans;

import java.util.UUID;

public class User {
    private UUID id;
    private final String name;
    private final String email;
    private final String phone;
    private final String password;
    private final String role;

    public User() {
        this(null, null, null, null, null, null);
    }

    public User(UUID id, String name, String email, String phone, String password, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }
}
