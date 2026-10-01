import java.lang.reflect.Proxy;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.bson.Document;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.NoOpDbRefResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.UserRateRecordDto;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.profile.repository.UserExperienceProfilesRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.AffinityCalculationService;

/** Executes existing watcher-compiled code. No application compilation, server or database writes. */
class RatingPrecisionProbe {
    public static void main(String[] args) throws Exception {
        var config = AffinityConfig.defaults();
        config.setProfileRules(List.of());
        config.setImpressionRules(List.of());
        var service = new AffinityCalculationService(
                stub(AffinityConfigsRepository.class, Map.of("findFirstByActiveTrueOrderByVersionDesc", Optional.of(config))),
                stub(UsersRepository.class, Map.of("findByUserIdIn", List.of())),
                stub(UserRatesRepository.class, Map.of("findRelevantByUserIds", List.of())),
                stub(UserExperienceProfilesRepository.class, Map.of("findByUserIdIn", List.of())));
        for (double score : new double[]{1, 6.25, 6.75, 20d / 3d, 10}) {
            var single = rate("single", "a", "b", score);
            var pair = rate("pair", "c", "d", score);
            pair.setSecondaryRelatedUserId("e");
            service.applyAffinity(List.of(single, pair));
            near(single.getAffinityScore(), score / 10d);
            near(pair.getAffinityScore(), score / 10d);
        }
        var given = rate("single", "a", "b", 6.75);
        var reciprocal = rate("single", "b", "a", 8.25);
        service.applyAffinity(List.of(given, reciprocal));
        near(given.getScoreReceived(), 8.25);
        near(reciprocal.getScoreReceived(), 6.75);
        near(given.getAffinityScore(), 2d * 6.75 * 8.25 / (6.75 + 8.25) / 10d);
        near(reciprocal.getAffinityScore(), given.getAffinityScore());
        if (!given.getMutuallyRated() || !reciprocal.getMutuallyRated()) throw new AssertionError("Mutual state lost");
        System.out.println("PASS exact fractional one-sided, pair and reciprocal harmonic affinity; integer endpoints unchanged");

        var mapper = new ObjectMapper();
        var incoming = mapper.readValue("{\"id\":\"probe\",\"rate\":6.75,\"scoreGiven\":6.75,\"scoreReceived\":8.25}", UserRateRecordDto.class);
        near(incoming.rate().doubleValue(), 6.75);
        near(incoming.scoreGiven().doubleValue(), 6.75);
        near(incoming.scoreReceived().doubleValue(), 8.25);
        var context = new MongoMappingContext();
        context.afterPropertiesSet();
        var converter = new MappingMongoConverter(NoOpDbRefResolver.INSTANCE, context);
        converter.afterPropertiesSet();
        var legacy = converter.read(UserRate.class, new Document("scoreGiven", 7).append("scoreReceived", 8));
        near(legacy.getScoreGiven(), 7);
        near(legacy.getScoreReceived(), 8);
        var document = new Document();
        converter.write(given, document);
        var restored = converter.read(UserRate.class, document);
        near(restored.getScoreGiven(), 6.75);
        near(restored.getScoreReceived(), 8.25);
        near(restored.getAffinityScore(), given.getAffinityScore());
        System.out.println("PASS JSON decimals + legacy Mongo integers + fractional Mongo conversion round trip");
    }
    static UserRate rate(String mode, String owner, String target, double score) {
        var rate = new UserRate();
        rate.setId(mode + owner + target);
        rate.setMode(mode);
        rate.setOwnerUserId(owner);
        rate.setRelatedUserId(target);
        rate.setScoreGiven(score);
        return rate;
    }
    static void near(double actual, double expected) {
        if (Math.abs(actual - expected) > 1e-10) throw new AssertionError(actual + " != " + expected);
    }
    static <T> T stub(Class<T> type, Map<String, Object> results) {
        return type.cast(Proxy.newProxyInstance(type.getClassLoader(), new Class<?>[]{type}, (proxy, method, args) -> {
            if (results.containsKey(method.getName())) return results.get(method.getName());
            throw new AssertionError("Unexpected repository call: " + method.getName());
        }));
    }
}
