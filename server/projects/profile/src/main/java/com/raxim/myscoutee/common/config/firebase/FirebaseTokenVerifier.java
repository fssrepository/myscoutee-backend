package com.raxim.myscoutee.common.config.firebase;

import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;

public interface FirebaseTokenVerifier {
    FirebaseCredential verify(String firebaseToken);
}
