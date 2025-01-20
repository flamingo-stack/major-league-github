import { useState, useEffect } from 'react';
import { Region } from '../types/api';

interface Coordinates {
    latitude: number;
    longitude: number;
}

// Haversine formula to calculate distance between two points on Earth
function getDistance(coords1: Coordinates, coords2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coords2.latitude - coords1.latitude) * Math.PI / 180;
    const dLon = (coords2.longitude - coords1.longitude) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coords1.latitude * Math.PI / 180) * Math.cos(coords2.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

export function useNearestRegion(regions: Region[]) {
    const [nearestRegion, setNearestRegion] = useState<Region | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!regions.length) return;

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };

                // Find the nearest region by calculating distances
                let nearest: Region | null = null;
                let minDistance = Infinity;

                regions.forEach(region => {
                    // Skip regions without geo coordinates
                    if (!region.geo?.latitude || !region.geo?.longitude) return;

                    const distance = getDistance(userCoords, {
                        latitude: region.geo.latitude,
                        longitude: region.geo.longitude
                    });

                    if (distance < minDistance) {
                        minDistance = distance;
                        nearest = region;
                    }
                });

                if (nearest) {
                    setNearestRegion(nearest);
                } else {
                    setError('No regions with coordinates found');
                }
            },
            (error) => {
                setError('Unable to retrieve your location');
                console.error('Geolocation error:', error);
            }
        );
    }, [regions]);

    return { nearestRegion, error };
} 