package com.raxim.myscoutee.domain.platform.api;
public interface CountryDirectory {
    java.util.List<? extends Country> supportedCountries();
    interface Country { String getCountryCode(); String getCountryName(); }
}
