package com.raxim.myscoutee.domain.events.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.FeedbackDirectory;
import com.raxim.myscoutee.domain.events.document.EventFeedbackAnswer;
import com.raxim.myscoutee.domain.events.repository.EventFeedbackAnswersRepository;
@Service
public class FeedbackDirectoryService implements FeedbackDirectory {
    private final EventFeedbackAnswersRepository answers;
    public FeedbackDirectoryService(EventFeedbackAnswersRepository answers) { this.answers = answers; }
    public List<EventFeedbackAnswer> findByTargetUserIdOrderBySubmittedAtIsoDesc(String userId) { return answers.findByTargetUserIdOrderBySubmittedAtIsoDesc(userId); }
}
