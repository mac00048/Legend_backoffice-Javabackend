package com.legendatours.beans;

public class Login {
    private final String email;
    private final String password;

    public Login() {
        this(null, null);
    }

    public Login(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
