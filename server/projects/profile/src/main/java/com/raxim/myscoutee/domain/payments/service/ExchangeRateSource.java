package com.raxim.myscoutee.domain.payments.service;

import java.net.URI;
import java.net.InetAddress;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import java.time.*;
import java.util.*;
import java.math.BigDecimal;
import javax.xml.parsers.DocumentBuilderFactory;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** Configured ECB-compatible XML source. Redirects and XML external entities are forbidden. */
@Service
public class ExchangeRateSource implements com.raxim.myscoutee.domain.payments.api.ExchangeRateConfiguration {
    private final Set<String> developmentHosts;
    private final URI simulatorOrigin;
    public ExchangeRateSource(@Value("${payment.exchange-rates.development-hosts:}") String hosts,
            @Value("${payment.simulator.baseUrl:}") String simulatorBaseUrl) {
        developmentHosts = new HashSet<>();
        Arrays.stream(hosts.split(",")).map(String::trim).filter(host -> !host.isEmpty())
                .map(host -> host.toLowerCase(Locale.ROOT)).forEach(developmentHosts::add);
        simulatorOrigin = simulatorBaseUrl.isBlank() ? null : URI.create(simulatorBaseUrl.trim());
    }
    private boolean isSimulator(URI uri) {
        return MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO && simulatorOrigin != null
                && Objects.equals(uri.getScheme(), simulatorOrigin.getScheme())
                && Objects.equals(uri.getHost(), simulatorOrigin.getHost())
                && uri.getPort() == simulatorOrigin.getPort();
    }
    public String validate(String value) {
        if (value == null || value.isBlank()) return "";
        URI uri = URI.create(value.trim());
        boolean development = developmentHosts.contains(uri.getHost()) || isSimulator(uri);
        if (uri.getHost() == null || uri.getUserInfo() != null || uri.getFragment() != null
                || !("https".equals(uri.getScheme()) || development && "http".equals(uri.getScheme())))
            throw new IllegalArgumentException("Exchange-rate source requires an HTTPS URL.");
        // In development, outbound access is confined to the configured simulator hosts.
        if (!developmentHosts.isEmpty() && !development)
            throw new IllegalArgumentException("Use the configured development exchange-rate simulator.");
        return uri.toString();
    }
    public List<Document> fetch(String source) throws Exception {
        URI uri = URI.create(validate(source));
        if (!developmentHosts.contains(uri.getHost()) && !isSimulator(uri)) {
            for (InetAddress address : InetAddress.getAllByName(uri.getHost()))
                if (address.isAnyLocalAddress() || address.isLoopbackAddress() || address.isLinkLocalAddress()
                        || address.isSiteLocalAddress() || address.isMulticastAddress())
                    throw new IllegalArgumentException("Exchange-rate source must be public.");
        }
        var connection = (java.net.HttpURLConnection) uri.toURL().openConnection();
        connection.setConnectTimeout(3000); connection.setReadTimeout(8000); connection.setInstanceFollowRedirects(false);
        byte[] bytes;
        try {
            if (connection.getResponseCode() != 200) throw new IllegalStateException("Exchange-rate source HTTP " + connection.getResponseCode());
            try (var body = connection.getInputStream()) { bytes = body.readNBytes(1_048_577); }
        } finally { connection.disconnect(); }
        if (bytes.length > 1_048_576) throw new IllegalArgumentException("Exchange-rate response is too large.");
        return parse(bytes, uri.getHost());
    }
    static List<Document> parse(byte[] bytes, String source) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        factory.setXIncludeAware(false); factory.setExpandEntityReferences(false);
        factory.setNamespaceAware(true);
        var nodes = factory.newDocumentBuilder().parse(new java.io.ByteArrayInputStream(bytes)).getElementsByTagNameNS("*", "Cube");
        List<Document> rows = new ArrayList<>();
        for (int i = 0; i < nodes.getLength(); i++) {
            var node = (org.w3c.dom.Element) nodes.item(i);
            if (!node.hasAttribute("time")) continue;
            LocalDate date = LocalDate.parse(node.getAttribute("time"));
            if (date.isAfter(LocalDate.now(ZoneOffset.UTC))) throw new IllegalArgumentException("Future exchange-rate date.");
            Document rates = new Document();
            var children = node.getElementsByTagNameNS("*", "Cube");
            for (int j = 0; j < children.getLength(); j++) {
                var entry = (org.w3c.dom.Element) children.item(j);
                String currency = entry.getAttribute("currency");
                BigDecimal rate = new BigDecimal(entry.getAttribute("rate"));
                if (!currency.matches("[A-Z]{3}") || rate.signum() <= 0 || rate.scale() > 16 || rate.precision() > 24)
                    throw new IllegalArgumentException("Invalid exchange-rate value.");
                if (rates.put(currency, rate.toPlainString()) != null) throw new IllegalArgumentException("Duplicate currency.");
            }
            if (rates.isEmpty()) throw new IllegalArgumentException("Empty exchange-rate observation.");
            rows.add(new Document("_id", date.toString()).append("rates", rates).append("source", source)
                    .append("fetchedAt", Instant.now().toString()));
        }
        if (rows.isEmpty() || rows.size() > 400) throw new IllegalArgumentException("Invalid exchange-rate history size.");
        return rows;
    }
}
