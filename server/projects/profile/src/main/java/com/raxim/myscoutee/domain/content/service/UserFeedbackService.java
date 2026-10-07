package com.raxim.myscoutee.domain.content.service;
import java.time.Instant;
import java.util.UUID;
import org.bson.types.ObjectId;
import com.raxim.myscoutee.domain.content.document.UserFeedbackSubmission;
import com.raxim.myscoutee.domain.content.repository.UserFeedbackSubmissionsRepository;
@org.springframework.stereotype.Service
public class UserFeedbackService implements com.raxim.myscoutee.domain.content.api.UserFeedback {
    private final UserFeedbackSubmissionsRepository userFeedbackSubmissionsRepository;
    public UserFeedbackService(UserFeedbackSubmissionsRepository repository) { userFeedbackSubmissionsRepository = repository; }
    public String submit(String userId, String category, String subject, String details) {
        String nowIso = Instant.now().toString();
        UserFeedbackSubmission document = new UserFeedbackSubmission();
        document.setId(new ObjectId().toHexString());
        document.setSyncKey(UUID.randomUUID().toString());
        document.setUserId(userId);
        document.setCategory(category);
        document.setSubject(subject);
        document.setDetails(details);
        document.setCreatedDate(nowIso);
        document.setCreatedUser(userId);
        document.setUpdatedDate(nowIso);
        document.setUpdatedUser(userId);
        userFeedbackSubmissionsRepository.save(document);
        return document.getId();
    }
}
