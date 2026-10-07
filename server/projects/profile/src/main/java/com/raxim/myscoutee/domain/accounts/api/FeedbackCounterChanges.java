package com.raxim.myscoutee.domain.accounts.api;
public interface FeedbackCounterChanges {
    public record FeedbackBucketDelta(int ownEvents, int pending, int feedbacked, int removed) {
        public static FeedbackBucketDelta forBucket(String bucket, int amount) {
            return switch (bucket) {
                case "own-events" -> new FeedbackBucketDelta(amount, 0, 0, 0);
                case "removed" -> new FeedbackBucketDelta(0, 0, 0, amount);
                case "feedbacked" -> new FeedbackBucketDelta(0, 0, amount, 0);
                default -> new FeedbackBucketDelta(0, amount, 0, 0);
            };
        }

        public FeedbackBucketDelta plus(FeedbackBucketDelta other) {
            return new FeedbackBucketDelta(
                    ownEvents + other.ownEvents,
                    pending + other.pending,
                    feedbacked + other.feedbacked,
                    removed + other.removed);
        }
    }
}
