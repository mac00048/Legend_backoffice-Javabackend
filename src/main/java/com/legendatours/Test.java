package com.legendatours;

import org.mindrot.jbcrypt.BCrypt;

public class Test {
    
    public static void main(String[] args) {
        final String password = "zzz";

        final long start = System.currentTimeMillis();
        final String hashed = BCrypt.hashpw(password, BCrypt.gensalt(12));
        final long end = System.currentTimeMillis();
        
        System.out.println(hashed);
        System.out.println(end - start);
        
        final long start2 = System.currentTimeMillis();
        final boolean check = BCrypt.checkpw(password, hashed);
        final long end2 = System.currentTimeMillis();

        System.out.println(check);
        System.out.println(end2 - start2);
    }
}
