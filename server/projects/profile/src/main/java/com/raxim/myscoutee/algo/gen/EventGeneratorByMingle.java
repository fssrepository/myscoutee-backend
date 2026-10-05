package com.raxim.myscoutee.algo.gen;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.raxim.myscoutee.algo.dto.FGraph;
import com.raxim.myscoutee.algo.gen.GeneratorModels.MingleGeneratorRequest;
import com.raxim.myscoutee.algo.gen.GeneratorModels.MinglePreviousTable;
import com.raxim.myscoutee.algo.gen.GeneratorModels.MingleRoundPlan;
import com.raxim.myscoutee.algo.gen.GeneratorModels.MingleTablePlan;

/**
 * Deterministic physical-table planner. It minimizes repeated co-participants
 * first, balances the available gender information when requested, then uses
 * the existing affinity graph as a tie-breaker.
 * It has no persistence or event-lifecycle responsibility.
 */
public class EventGeneratorByMingle implements EventGenerator<MingleGeneratorRequest, MingleRoundPlan> {
    private static final int MIN_GROUP_SIZE = 2;
    private static final int MAX_GROUP_SIZE = 20;

    @Override
    public MingleRoundPlan generate(MingleGeneratorRequest input) {
        int roundNumber = Math.max(1, input == null ? 1 : input.roundNumber());
        if (input == null) {
            return new MingleRoundPlan(roundNumber, List.of());
        }

        List<String> members = normalizeMembers(input.eligibleUserIds());
        if (members.isEmpty()) {
            return new MingleRoundPlan(roundNumber, List.of());
        }

        int groupSize = Math.max(MIN_GROUP_SIZE, Math.min(MAX_GROUP_SIZE, input.groupSize()));
        Map<String, String> genders = normalizeGenders(input.userGenders(), members);
        GenderBalancedSelection balancedSelection = input.requireGenderBalance()
                ? genderBalancedSelection(
                        members,
                        genders,
                        groupSize,
                        roundNumber,
                        configuredTableLimit(input.tableNumbers()))
                : null;
        if (input.requireGenderBalance() && (balancedSelection == null || balancedSelection.members().isEmpty())) {
            return new MingleRoundPlan(roundNumber, List.of());
        }
        if (balancedSelection != null) {
            members = balancedSelection.members();
        }
        int automaticTableCount = Math.max(1, (int) Math.ceil(members.size() / (double) groupSize));
        List<Integer> tableNumbers = resolveTableNumbers(input.tableNumbers(), automaticTableCount);
        if (!input.requireGenderBalance()) {
            members = capacityLimitedMembers(
                    members,
                    tableNumbers.size() * groupSize,
                    roundNumber);
        }
        Map<String, Map<String, Integer>> repeats = repeatCounts(input.previousTables());
        FGraph graph = input.randomMixing() || input.graph() == null ? new FGraph() : input.graph();
        Set<String> genderCategories = new LinkedHashSet<>(genders.values());

        List<List<String>> tables = new ArrayList<>();
        for (int index = 0; index < tableNumbers.size(); index += 1) {
            tables.add(new ArrayList<>());
        }

        int targetCapacity = groupSize;
        List<Map<String, Integer>> genderQuotas = balancedSelection == null
                ? List.of()
                : balancedSelection.genderQuotas();
        var tieOrder=new ArrayList<>(members);
        if(input.randomMixing())java.util.Collections.shuffle(tieOrder);
        Map<String,Integer> ranks=new HashMap<>();for(int i=0;i<tieOrder.size();i++)ranks.put(tieOrder.get(i),i);
        members.stream()
                .sorted(Comparator
                        .<String>comparingInt(member -> totalRepeats(member, repeats)).reversed()
                        .thenComparing(input.randomMixing()?Comparator.comparingInt(ranks::get):Comparator.naturalOrder()))
                .forEach(member -> selectTable(
                        member,
                        tables,
                        targetCapacity,
                        repeats,
                        graph,
                        genders,
                        genderCategories,
                        input.requireGenderBalance(),
                        genderQuotas).add(member));

        rebalanceSingleton(tables);

        List<MingleTablePlan> plans = new ArrayList<>();
        for (int index = 0; index < tables.size(); index += 1) {
            List<String> assigned = tables.get(index).stream().sorted().toList();
            if (!assigned.isEmpty()) {
                plans.add(new MingleTablePlan(tableNumbers.get(index), assigned));
            }
        }
        return new MingleRoundPlan(roundNumber, List.copyOf(plans));
    }

    private List<String> normalizeMembers(Set<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .filter(value -> value != null && !value.isBlank())
                .map(String::trim)
                .distinct()
                .sorted()
                .toList();
    }

    private List<Integer> resolveTableNumbers(List<Integer> configured, int automaticTableCount) {
        LinkedHashSet<Integer> numbers = new LinkedHashSet<>();
        if (configured != null) {
            configured.stream()
                    .filter(value -> value != null && value > 0)
                    .forEach(numbers::add);
        }
        int required = numbers.isEmpty() ? automaticTableCount : Math.min(automaticTableCount, numbers.size());
        int candidate = 1;
        while (numbers.size() < required) {
            numbers.add(candidate++);
        }
        return numbers.stream().limit(required).toList();
    }

    private int configuredTableLimit(List<Integer> configured) {
        if (configured == null || configured.isEmpty()) {
            return Integer.MAX_VALUE;
        }
        return (int) configured.stream()
                .filter(value -> value != null && value > 0)
                .distinct()
                .count();
    }

    private GenderBalancedSelection genderBalancedSelection(
            List<String> members,
            Map<String, String> genders,
            int groupSize,
            int roundNumber,
            int configuredTableLimit) {
        List<String> categories = genders.values().stream().distinct().sorted().toList();
        if (categories.size() != 2) {
            return null;
        }
        Map<String, List<String>> membersByGender = new LinkedHashMap<>();
        for (String category : categories) {
            membersByGender.put(category, members.stream()
                    .filter(member -> category.equals(genders.get(member)))
                    .sorted()
                    .toList());
        }
        int basePerGender = groupSize / 2;
        int maximumByTotal = membersByGender.values().stream().mapToInt(List::size).sum() / groupSize;
        int maximumByGender = membersByGender.values().stream()
                .mapToInt(values -> values.size() / Math.max(1, basePerGender))
                .min()
                .orElse(0);
        int tableCount = Math.min(Math.min(maximumByTotal, maximumByGender), configuredTableLimit);
        if (tableCount <= 0) {
            return null;
        }

        int firstCount = tableCount * basePerGender;
        int secondCount = firstCount;
        int extras = tableCount * (groupSize % 2);
        int firstAvailable = membersByGender.get(categories.get(0)).size() - firstCount;
        int firstExtras = Math.min(extras, Math.max(0, firstAvailable));
        int secondExtras = extras - firstExtras;
        int secondAvailable = membersByGender.get(categories.get(1)).size() - secondCount;
        if (secondExtras > secondAvailable) {
            int shift = secondExtras - secondAvailable;
            firstExtras += shift;
            secondExtras -= shift;
        }
        if (firstExtras > firstAvailable || secondExtras > secondAvailable) {
            return null;
        }

        List<String> selected = new ArrayList<>();
        selected.addAll(rotatingSlice(
                membersByGender.get(categories.get(0)),
                firstCount + firstExtras,
                roundNumber));
        selected.addAll(rotatingSlice(
                membersByGender.get(categories.get(1)),
                secondCount + secondExtras,
                roundNumber));
        List<Map<String, Integer>> genderQuotas = new ArrayList<>();
        for (int tableIndex = 0; tableIndex < tableCount; tableIndex += 1) {
            Map<String, Integer> quota = new LinkedHashMap<>();
            quota.put(categories.get(0), basePerGender + (tableIndex < firstExtras ? 1 : 0));
            quota.put(categories.get(1), basePerGender
                    + (tableIndex >= firstExtras && tableIndex < firstExtras + secondExtras ? 1 : 0));
            genderQuotas.add(Map.copyOf(quota));
        }
        return new GenderBalancedSelection(
                selected.stream().sorted().toList(),
                List.copyOf(genderQuotas));
    }

    private List<String> capacityLimitedMembers(List<String> members, int capacity, int roundNumber) {
        if (members == null || members.isEmpty() || capacity <= 0) {
            return List.of();
        }
        if (members.size() <= capacity) {
            return members;
        }
        return rotatingSlice(members, capacity, roundNumber).stream().sorted().toList();
    }

    private List<String> rotatingSlice(List<String> members, int count, int roundNumber) {
        if (count <= 0 || members == null || members.isEmpty()) {
            return List.of();
        }
        int safeCount = Math.min(count, members.size());
        int start = Math.floorMod((Math.max(1, roundNumber) - 1) * safeCount, members.size());
        List<String> selected = new ArrayList<>(safeCount);
        for (int index = 0; index < safeCount; index += 1) {
            selected.add(members.get((start + index) % members.size()));
        }
        return selected;
    }

    private Map<String, Map<String, Integer>> repeatCounts(List<MinglePreviousTable> history) {
        Map<String, Map<String, Integer>> counts = new LinkedHashMap<>();
        if (history == null) {
            return counts;
        }
        for (MinglePreviousTable table : history) {
            List<String> members = normalizeMembers(table == null
                    ? Set.of()
                    : new LinkedHashSet<>(table.memberUserIds() == null ? List.of() : table.memberUserIds()));
            for (int left = 0; left < members.size(); left += 1) {
                for (int right = left + 1; right < members.size(); right += 1) {
                    incrementPair(counts, members.get(left), members.get(right));
                    incrementPair(counts, members.get(right), members.get(left));
                }
            }
        }
        return counts;
    }

    private void incrementPair(Map<String, Map<String, Integer>> counts, String left, String right) {
        counts.computeIfAbsent(left, ignored -> new HashMap<>()).merge(right, 1, Integer::sum);
    }

    private int totalRepeats(String member, Map<String, Map<String, Integer>> repeats) {
        return repeats.getOrDefault(member, Map.of()).values().stream().mapToInt(Integer::intValue).sum();
    }

    private List<String> selectTable(
            String member,
            List<List<String>> tables,
            int targetCapacity,
            Map<String, Map<String, Integer>> repeats,
            FGraph graph,
            Map<String, String> genders,
            Set<String> genderCategories,
            boolean requireGenderBalance,
            List<Map<String, Integer>> genderQuotas) {
        return java.util.stream.IntStream.range(0, tables.size())
                .filter(index -> tables.get(index).size() < targetCapacity)
                .filter(index -> !requireGenderBalance || hasGenderCapacity(
                        member,
                        tables.get(index),
                        genders,
                        genderQuotas.get(index)))
                .boxed()
                .min(Comparator
                        .comparingInt((Integer index) -> repeatedPairCost(member, tables.get(index), repeats))
                        .thenComparingInt(index -> genderBalanceCost(
                                member,
                                tables.get(index),
                                genders,
                                genderCategories,
                                requireGenderBalance))
                        .thenComparing(Comparator.comparingDouble(
                                (Integer index) -> affinity(member, tables.get(index), graph)).reversed())
                        .thenComparingInt(index -> tables.get(index).size())
                        .thenComparingInt(Integer::intValue))
                .map(tables::get)
                .orElseThrow();
    }

    private boolean hasGenderCapacity(
            String member,
            List<String> table,
            Map<String, String> genders,
            Map<String, Integer> quota) {
        String gender = genders.get(member);
        if (gender == null) {
            return false;
        }
        long current = table.stream().filter(other -> gender.equals(genders.get(other))).count();
        return current < quota.getOrDefault(gender, 0);
    }

    private int repeatedPairCost(
            String member,
            List<String> table,
            Map<String, Map<String, Integer>> repeats) {
        Map<String, Integer> memberRepeats = repeats.getOrDefault(member, Map.of());
        return table.stream().mapToInt(other -> memberRepeats.getOrDefault(other, 0)).sum();
    }

    private double affinity(String member, List<String> table, FGraph graph) {
        if (table.isEmpty()) {
            return 0d;
        }
        return table.stream().mapToDouble(other -> graph.weightBetween(member, other)).sum();
    }

    private Map<String, String> normalizeGenders(Map<String, String> values, List<String> members) {
        if (values == null || values.isEmpty()) {
            return Map.of();
        }
        Set<String> eligible = new LinkedHashSet<>(members);
        Map<String, String> result = new LinkedHashMap<>();
        values.forEach((userId, gender) -> {
            String normalizedUserId = userId == null ? "" : userId.trim();
            String normalizedGender = gender == null ? "" : gender.trim().toLowerCase();
            if (eligible.contains(normalizedUserId) && !normalizedGender.isBlank()) {
                result.put(normalizedUserId, normalizedGender);
            }
        });
        return result;
    }

    private int genderBalanceCost(
            String member,
            List<String> table,
            Map<String, String> genders,
            Set<String> categories,
            boolean enabled) {
        String memberGender = genders.get(member);
        if (!enabled || memberGender == null || categories.size() < 2) {
            return 0;
        }
        Map<String, Integer> counts = new LinkedHashMap<>();
        categories.forEach(gender -> counts.put(gender, 0));
        for (String tableMember : table) {
            String gender = genders.get(tableMember);
            if (gender != null) {
                counts.computeIfPresent(gender, (ignored, count) -> count + 1);
            }
        }
        counts.computeIfPresent(memberGender, (ignored, count) -> count + 1);
        int minimum = counts.values().stream().mapToInt(Integer::intValue).min().orElse(0);
        int maximum = counts.values().stream().mapToInt(Integer::intValue).max().orElse(0);
        return maximum - minimum;
    }

    private void rebalanceSingleton(List<List<String>> tables) {
        if (tables.size() < 2) {
            return;
        }
        List<String> singleton = tables.stream().filter(table -> table.size() == 1).findFirst().orElse(null);
        if (singleton == null) {
            return;
        }
        List<String> donor = tables.stream()
                .filter(table -> table.size() > 2)
                .max(Comparator.comparingInt(List::size))
                .orElse(null);
        if (donor != null) {
            singleton.add(donor.remove(donor.size() - 1));
        }
    }

    private record GenderBalancedSelection(
            List<String> members,
            List<Map<String, Integer>> genderQuotas) {
    }
}
