package com.raxim.myscoutee.profile.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.geo.GeoJsonMultiPolygon;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeospatialIndex;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

import com.raxim.myscoutee.profile.data.document.CountryPartition;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.repository.CountryPartitionsRepository;

import jakarta.annotation.PostConstruct;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class CountryPartitionService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CountryPartitionService.class);
    private static final String OSM_SOURCE = "openstreetmap";
    private static final String NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
    private static final String NOMINATIM_USER_AGENT = "myscoutee-backend-country-partitions/1.0";
    private static final int DEFAULT_COUNTRY_SPECIFICITY = 100;
    private static final String HUNGARY_COUNTRY_NAME = "Hungary";
    private static final String HUNGARY_COUNTRY_CODE = "HU";
    private static final String HUNGARY_PARTITION_KEY = "country:hu";

    private final CountryPartitionsRepository countryPartitionsRepository;
    private final MongoTemplate mongoTemplate;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public CountryPartitionService(
            CountryPartitionsRepository countryPartitionsRepository,
            MongoTemplate mongoTemplate,
            ObjectMapper objectMapper) {
        this.countryPartitionsRepository = countryPartitionsRepository;
        this.mongoTemplate = mongoTemplate;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();
        this.mongoTemplate.indexOps(CountryPartition.class)
                .ensureIndex(new GeospatialIndex("geometry")
                        .typed(GeoSpatialIndexType.GEO_2DSPHERE)
                        .named("country_partition_geometry"));
    }

    @PostConstruct
    public void bootstrapDefaultCountryPartitions() {
        try {
            ensureCountryImported(HUNGARY_COUNTRY_NAME, HUNGARY_COUNTRY_CODE, HUNGARY_PARTITION_KEY);
        } catch (RuntimeException exception) {
            LOGGER.warn("Unable to bootstrap default country partition for {}.", HUNGARY_COUNTRY_NAME, exception);
        }
    }

    public String resolvePartitionKey(LocationCoordinatesDto coordinates) {
        CountryPartition partition = resolvePartition(coordinates);
        return partition == null ? null : partition.getPartitionKey();
    }

    public CountryPartition ensureCountryImported(String countryName, String countryCode, String partitionKey) {
        String normalizedCountryName = safeText(countryName);
        String normalizedCountryCode = normalizeCountryCode(countryCode);
        String normalizedPartitionKey = StringUtils.hasText(safeText(partitionKey))
                ? safeText(partitionKey)
                : defaultPartitionKey(normalizedCountryName, normalizedCountryCode);
        if (!StringUtils.hasText(normalizedCountryName)) {
            throw new IllegalArgumentException("Country name is required for OpenStreetMap import.");
        }

        CountryPartition existing = countryPartitionsRepository.findByPartitionKey(normalizedPartitionKey).orElse(null);
        if (existing != null && existing.getGeometry() != null) {
            return existing;
        }

        URI uri = buildNominatimSearchUri(normalizedCountryName, normalizedCountryCode, null);
        JsonNode match = fetchFirstCountryMatch(uri);
        CountryPartition document = existing == null ? new CountryPartition() : existing;
        document.setId(StringUtils.hasText(document.getId()) ? document.getId() : new ObjectId().toHexString());
        document.setPartitionKey(normalizedPartitionKey);
        document.setCountryCode(resolveCountryCode(normalizedCountryCode, match));
        document.setCountryName(resolveCountryName(normalizedCountryName, match));
        document.setDisplayName(safeText(match.path("display_name").asText()));
        document.setSource(OSM_SOURCE);
        document.setOsmType(safeText(match.path("osm_type").asText()));
        document.setOsmId(match.path("osm_id").isNumber() ? match.path("osm_id").asLong() : null);
        document.setSpecificity(DEFAULT_COUNTRY_SPECIFICITY);
        document.setImportedAtIso(Instant.now().toString());
        document.setGeometry(toMultiPolygon(match.path("geojson")));
        return countryPartitionsRepository.save(document);
    }

    private CountryPartition resolvePartition(LocationCoordinatesDto coordinates) {
        if (coordinates == null
                || coordinates.latitude() == null
                || coordinates.longitude() == null
                || !Double.isFinite(coordinates.latitude())
                || !Double.isFinite(coordinates.longitude())) {
            return null;
        }

        Query query = Query.query(Criteria.where("geometry")
                .intersects(new GeoJsonPoint(coordinates.longitude(), coordinates.latitude())));
        return mongoTemplate.find(query, CountryPartition.class).stream()
                .max(Comparator.comparing(partition -> partition.getSpecificity() == null ? 0 : partition.getSpecificity()))
                .orElse(null);
    }

    private URI buildNominatimSearchUri(String countryName, String countryCode, Double polygonThreshold) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(NOMINATIM_SEARCH_URL)
                .queryParam("format", "jsonv2")
                .queryParam("limit", 1)
                .queryParam("featureType", "country")
                .queryParam("polygon_geojson", 1)
                .queryParam("addressdetails", 1);

        if (polygonThreshold != null) {
            builder.queryParam("polygon_threshold", polygonThreshold);
        }

        if (StringUtils.hasText(countryName)) {
            builder.queryParam("country", countryName);
        }

        if (StringUtils.hasText(countryCode)) {
            builder.queryParam("countrycodes", countryCode.toLowerCase(Locale.ROOT));
        }

        return URI.create(builder.build(true).toUriString());
    }

    private JsonNode fetchFirstCountryMatch(URI uri) {
        HttpRequest httpRequest = HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(30))
                .header("Accept", "application/json")
                .header("Accept-Language", "en")
                .header("User-Agent", NOMINATIM_USER_AGENT)
                .GET()
                .build();

        try {
            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("OpenStreetMap country import failed with HTTP " + response.statusCode() + ".");
            }

            JsonNode root = objectMapper.readTree(response.body());
            if (!root.isArray() || root.isEmpty()) {
                throw new IllegalStateException("No OpenStreetMap country boundary found for the requested country.");
            }

            JsonNode first = root.get(0);
            if (first == null || first.path("geojson").isMissingNode() || first.path("geojson").isNull()) {
                throw new IllegalStateException("OpenStreetMap returned a country match without GeoJSON geometry.");
            }
            return first;
        } catch (IOException | InterruptedException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new IllegalStateException("Unable to download the OpenStreetMap country boundary.", exception);
        }
    }

    private GeoJsonMultiPolygon toMultiPolygon(JsonNode geoJson) {
        String type = safeText(geoJson.path("type").asText());
        JsonNode coordinates = geoJson.path("coordinates");
        if (!coordinates.isArray() || coordinates.isEmpty()) {
            throw new IllegalArgumentException("OpenStreetMap returned an empty country geometry.");
        }

        if ("Polygon".equalsIgnoreCase(type)) {
            return new GeoJsonMultiPolygon(List.of(toPolygon(coordinates)));
        }
        if ("MultiPolygon".equalsIgnoreCase(type)) {
            List<GeoJsonPolygon> polygons = new ArrayList<>();
            for (JsonNode polygonCoordinates : coordinates) {
                polygons.add(toPolygon(polygonCoordinates));
            }
            return new GeoJsonMultiPolygon(polygons);
        }
        throw new IllegalArgumentException("Unsupported country geometry type: " + type);
    }

    private GeoJsonPolygon toPolygon(JsonNode polygonCoordinates) {
        if (!polygonCoordinates.isArray() || polygonCoordinates.isEmpty()) {
            throw new IllegalArgumentException("OpenStreetMap returned an invalid polygon geometry.");
        }

        GeoJsonPolygon polygon = new GeoJsonPolygon(toRingPoints(polygonCoordinates.get(0)));
        for (int ringIndex = 1; ringIndex < polygonCoordinates.size(); ringIndex += 1) {
            polygon = polygon.withInnerRing(toRingPoints(polygonCoordinates.get(ringIndex)));
        }
        return polygon;
    }

    private List<Point> toRingPoints(JsonNode ringCoordinates) {
        if (!ringCoordinates.isArray() || ringCoordinates.isEmpty()) {
            throw new IllegalArgumentException("OpenStreetMap returned an empty polygon ring.");
        }

        List<Point> points = new ArrayList<>();
        for (JsonNode coordinate : ringCoordinates) {
            if (!coordinate.isArray() || coordinate.size() < 2) {
                throw new IllegalArgumentException("OpenStreetMap returned an invalid polygon coordinate.");
            }
            points.add(new Point(coordinate.get(0).asDouble(), coordinate.get(1).asDouble()));
        }

        if (points.size() < 4) {
            throw new IllegalArgumentException("OpenStreetMap returned a polygon ring with too few coordinates.");
        }

        Point first = points.get(0);
        Point last = points.get(points.size() - 1);
        if (!samePoint(first, last)) {
            points.add(new Point(first.getX(), first.getY()));
        }
        return points;
    }

    private boolean samePoint(Point left, Point right) {
        return left != null
                && right != null
                && Double.compare(left.getX(), right.getX()) == 0
                && Double.compare(left.getY(), right.getY()) == 0;
    }

    private String defaultPartitionKey(String countryName, String countryCode) {
        if (StringUtils.hasText(countryCode)) {
            return "country:" + countryCode.toLowerCase(Locale.ROOT);
        }

        if (!StringUtils.hasText(countryName)) {
            throw new IllegalArgumentException("Unable to resolve country name for the imported partition.");
        }
        return "country:" + slugify(countryName);
    }

    private String resolveCountryCode(String countryCode, JsonNode match) {
        if (StringUtils.hasText(countryCode)) {
            return countryCode;
        }

        JsonNode address = match.path("address");
        return normalizeCountryCode(address.path("country_code").asText());
    }

    private String resolveCountryName(String countryName, JsonNode match) {
        if (StringUtils.hasText(countryName)) {
            return countryName;
        }

        JsonNode address = match.path("address");
        String addressCountry = safeText(address.path("country").asText());
        if (StringUtils.hasText(addressCountry)) {
            return addressCountry;
        }

        return safeText(match.path("name").asText());
    }

    private String normalizeCountryCode(String countryCode) {
        String normalized = safeText(countryCode);
        return StringUtils.hasText(normalized) ? normalized.toUpperCase(Locale.ROOT) : null;
    }

    private String slugify(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        StringBuilder builder = new StringBuilder();
        boolean lastDash = false;
        for (int index = 0; index < normalized.length(); index += 1) {
            char current = normalized.charAt(index);
            boolean isAsciiLetterOrDigit = (current >= 'a' && current <= 'z') || (current >= '0' && current <= '9');
            if (isAsciiLetterOrDigit) {
                builder.append(current);
                lastDash = false;
            } else if (!lastDash && builder.length() > 0) {
                builder.append('-');
                lastDash = true;
            }
        }
        int length = builder.length();
        if (length > 0 && builder.charAt(length - 1) == '-') {
            builder.deleteCharAt(length - 1);
        }
        return builder.toString();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
