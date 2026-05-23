package com.raxim.myscoutee.common.config.firebase;

import java.util.Objects;

import org.springframework.stereotype.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;
import com.raxim.myscoutee.common.config.firebase.exception.FirebaseTokenInvalidException;

@Service
public class DefaultFirebaseTokenVerifier implements FirebaseTokenVerifier {
    @Override
    public FirebaseCredential verify(String firebaseToken) {
        Objects.requireNonNull(firebaseToken, "FirebaseToken must not be null or blank");
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(firebaseToken);
            return new FirebaseCredential(decodedToken);
        } catch (Exception e) {
            throw new FirebaseTokenInvalidException(e.getMessage());
        }
    }
}
