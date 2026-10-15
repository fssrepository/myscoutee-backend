package com.raxim.myscoutee.domain.feedback.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.feedback.api.FeedbackDirectory;
import com.raxim.myscoutee.domain.feedback.document.FeedbackAnswer;
import com.raxim.myscoutee.domain.feedback.repository.FeedbackAnswersRepository;
@Service
public class FeedbackDirectoryService implements FeedbackDirectory {
    private final FeedbackAnswersRepository answers;
    public FeedbackDirectoryService(FeedbackAnswersRepository answers) { this.answers = answers; }
    public List<FeedbackAnswer> findByTargetUserIdOrderBySubmittedAtIsoDesc(String userId) { return answers.findByTargetUserIdOrderBySubmittedAtIsoDesc(userId); }
}
