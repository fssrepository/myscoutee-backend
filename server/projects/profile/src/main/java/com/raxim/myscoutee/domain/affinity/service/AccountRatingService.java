package com.raxim.myscoutee.domain.affinity.service;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.affinity.api.AccountRatings;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
@Service
public class AccountRatingService implements AccountRatings {
    private final UserRatesRepository rates;
    public AccountRatingService(UserRatesRepository rates) { this.rates = rates; }
    @Override public Map<String, Double> scoresGiven(String profileId) {
        return rates.findByOwnerUserId(profileId).stream().filter(rate -> rate.getCampaignId() == null && rate.getScoreGiven() != null)
                .collect(Collectors.toMap(UserRate::getRelatedUserId, UserRate::getScoreGiven, (a, b) -> b));
    }
}
