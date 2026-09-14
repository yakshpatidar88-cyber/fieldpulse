package com.opsflow.service;

import com.opsflow.util.GeoDistanceCalculator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class GeoDistanceCalculatorTest {

    @Test
    @DisplayName("Should return 0.0 km for identical coordinates")
    void testIdenticalCoordinates() {
        double dist = GeoDistanceCalculator.calculateDistanceKm(37.7749, -122.4194, 37.7749, -122.4194);
        assertEquals(0.0, dist, 0.01);
    }

    @Test
    @DisplayName("Should accurately calculate distance between San Francisco and Oakland (~13.3 km)")
    void testSfToOaklandDistance() {
        // San Francisco (37.7749, -122.4194) to Oakland (37.8044, -122.2711)
        double dist = GeoDistanceCalculator.calculateDistanceKm(37.7749, -122.4194, 37.8044, -122.2711);
        assertTrue(dist >= 13.0 && dist <= 14.0, "Expected ~13.3 km, got: " + dist);
    }

    @Test
    @DisplayName("Should be symmetric: distance(A, B) == distance(B, A)")
    void testSymmetry() {
        BigDecimal lat1 = new BigDecimal("40.7128");
        BigDecimal lon1 = new BigDecimal("-74.0060");
        BigDecimal lat2 = new BigDecimal("42.3601");
        BigDecimal lon2 = new BigDecimal("-71.0589");

        double d1 = GeoDistanceCalculator.calculateDistanceKm(lat1, lon1, lat2, lon2);
        double d2 = GeoDistanceCalculator.calculateDistanceKm(lat2, lon2, lat1, lon1);

        assertEquals(d1, d2, 0.001);
    }

    @Test
    @DisplayName("Should return Double.MAX_VALUE when coordinates are null")
    void testNullCoordinates() {
        double dist = GeoDistanceCalculator.calculateDistanceKm(null, null, new BigDecimal("37.7749"), new BigDecimal("-122.4194"));
        assertEquals(Double.MAX_VALUE, dist);
    }
}
