package com.raxim.myscoutee.profile.data;

import java.util.List;
import java.util.Map;
import java.util.Set;

public final class AssetCatalog {
    public static final String TYPE_TRANSPORT = "Transport";
    public static final String TYPE_ACCOMMODATION = "Accommodation";
    public static final String TYPE_SUPPLIES = "Supplies";
    public static final String FILTER_TICKET = "Ticket";

    public static final String CATEGORY_SEDAN = "Sedan";
    public static final String CATEGORY_SUV = "SUV";
    public static final String CATEGORY_VAN = "Van";
    public static final String CATEGORY_BUS = "Bus";
    public static final String CATEGORY_TRUCK = "Truck";
    public static final String CATEGORY_MOTORCYCLE = "Motorcycle";
    public static final String CATEGORY_BICYCLE = "Bicycle";
    public static final String CATEGORY_BOAT = "Boat";
    public static final String CATEGORY_FLIGHT = "Flight";
    public static final String CATEGORY_SHUTTLE = "Shuttle";

    public static final String CATEGORY_HOTEL = "Hotel";
    public static final String CATEGORY_APARTMENT = "Apartment";
    public static final String CATEGORY_HOUSE = "House";
    public static final String CATEGORY_ROOM = "Room";
    public static final String CATEGORY_VENUE = "Venue";
    public static final String CATEGORY_CAMPSITE = "Campsite";
    public static final String CATEGORY_STORAGE = "Storage";
    public static final String CATEGORY_WORKSPACE = "Workspace";

    public static final String CATEGORY_CAMPING = "Camping";
    public static final String CATEGORY_COOKING = "Cooking";
    public static final String CATEGORY_GAMES = "Games";
    public static final String CATEGORY_AUDIO = "Audio";
    public static final String CATEGORY_SPORTS = "Sports";
    public static final String CATEGORY_SAFETY = "Safety";
    public static final String CATEGORY_DECOR = "Decor";
    public static final String CATEGORY_TECH = "Tech";

    public static final Set<String> ASSET_TYPES = Set.of(
            TYPE_TRANSPORT,
            TYPE_ACCOMMODATION,
            TYPE_SUPPLIES
    );

    public static final List<String> TRANSPORT_CATEGORIES = List.of(
            CATEGORY_SEDAN,
            CATEGORY_SUV,
            CATEGORY_VAN,
            CATEGORY_BUS,
            CATEGORY_TRUCK,
            CATEGORY_MOTORCYCLE,
            CATEGORY_BICYCLE,
            CATEGORY_BOAT,
            CATEGORY_FLIGHT,
            CATEGORY_SHUTTLE
    );

    public static final List<String> ACCOMMODATION_CATEGORIES = List.of(
            CATEGORY_HOTEL,
            CATEGORY_APARTMENT,
            CATEGORY_HOUSE,
            CATEGORY_ROOM,
            CATEGORY_VENUE,
            CATEGORY_CAMPSITE,
            CATEGORY_STORAGE,
            CATEGORY_WORKSPACE
    );

    public static final List<String> SUPPLIES_CATEGORIES = List.of(
            CATEGORY_CAMPING,
            CATEGORY_COOKING,
            CATEGORY_GAMES,
            CATEGORY_AUDIO,
            CATEGORY_SPORTS,
            CATEGORY_SAFETY,
            CATEGORY_DECOR,
            CATEGORY_TECH
    );

    public static final Map<String, List<String>> CATEGORIES_BY_TYPE = Map.of(
            TYPE_TRANSPORT, TRANSPORT_CATEGORIES,
            TYPE_ACCOMMODATION, ACCOMMODATION_CATEGORIES,
            TYPE_SUPPLIES, SUPPLIES_CATEGORIES
    );

    private AssetCatalog() {
    }
}
