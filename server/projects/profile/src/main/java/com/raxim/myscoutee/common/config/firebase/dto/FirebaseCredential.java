package com.raxim.myscoutee.common.config.firebase.dto;

import java.util.List;
import java.util.Map;

import com.google.firebase.auth.FirebaseToken;

public class FirebaseCredential {
    private static final String FIREBASE = "firebase";
    private static final String IDENTITES = "identities";
    private static final String GOOGLE_COM = "google.com";

    private final FirebaseToken token;

    public FirebaseCredential(FirebaseToken token) {
        this.token = token;
    }

    public String getEmail() {
        return token.getEmail();
    }

    public String getIssuer() {
        return token.getIssuer();
    }

    public String getName() {
        return token.getName();
    }

    public String getUid() {
        return token.getUid();
    }

    public String getGoogleId() {
        Map<?, ?> firebaseClaim = asMap(token.getClaims().get(FIREBASE));
        Map<?, ?> identitiesMap = asMap(firebaseClaim.get(IDENTITES));
        return firstString(asList(identitiesMap.get(GOOGLE_COM)));
    }

    private Map<?, ?> asMap(Object value) {
        return value instanceof Map<?, ?> map ? map : Map.of();
    }

    private List<?> asList(Object value) {
        return value instanceof List<?> list ? list : List.of();
    }

    private String firstString(List<?> values) {
        for (Object value : values) {
            if (value instanceof String stringValue) {
                return stringValue;
            }
        }
        return null;
    }
}
