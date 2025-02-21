import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { useLocation } from "react-router-dom";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapComponent = () => {
    const location = useLocation();
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const directionsRef = useRef(null);

    const [providerLocation, setProviderLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // ✅ Ensure providerLocation is extracted safely
    useEffect(() => {
        const{lat,lon} = location.state;
        if (location.state) {
            console.log("Provider Location from state:", location.state);
            setProviderLocation([lon, lat]);
        } else {    
            console.error("Invalid provider location received:", lat,lon);
        }
    }, [location.state]);

    useEffect(() => {
        if (!providerLocation) return;

        console.log("Initializing Mapbox Map...");

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: providerLocation,
            zoom: 14,
        });

        mapRef.current = map;
        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        map.on("load", () => {
            console.log("Map Loaded!");
            setMapLoaded(true);
        });

        return () => {
            console.log("Cleaning up map...");
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [providerLocation]);

    useEffect(() => {
        if (!mapLoaded || !providerLocation || !mapRef.current) return;

        console.log("Setting up Mapbox Directions...");

        if (!directionsRef.current) {
            directionsRef.current = new MapboxDirections({
                accessToken: mapboxgl.accessToken,
                unit: "metric",
                profile: "mapbox/driving",
                interactive: false,
            });

            try {
                mapRef.current.addControl(directionsRef.current, "top-left");
                directionsRef.current.setDestination(providerLocation);
            } catch (error) {
                console.error("Error adding directions control:", error);
            }
        }

        const updateUserLocation = (position) => {
            const { longitude, latitude } = position.coords;
            const newUserLocation = [longitude, latitude];
            setUserLocation(newUserLocation);

            console.log("Updating user location:", newUserLocation);

            if (mapRef.current) {
                mapRef.current.flyTo({ center: newUserLocation, zoom: 14 });
            }

            try {
                directionsRef.current.setOrigin(newUserLocation);
            } catch (error) {
                console.error("Error setting origin:", error);
            }
        };

        let watchId;
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                updateUserLocation,
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true, maximumAge: 1000 }
            );
        }

        return () => {
            console.log("Clearing geolocation watch...");
            if (watchId) navigator.geolocation.clearWatch(watchId);

            try {
                console.log("Removing Mapbox Directions control...");
                if (directionsRef.current && mapRef.current) {
                    mapRef.current.removeControl(directionsRef.current);
                }
            } catch (error) {
                console.error("Error removing directions control:", error);
            }

            directionsRef.current = null;
        };
    }, [mapLoaded, providerLocation]);

    return <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />;
};

export default MapComponent;
