import { httpClient } from 'app/deps';
import { ILocation } from 'app/models/Location';
import { IPaginatedData } from 'model';

export const BASE_LOCATION_URL = '/location';
export const LocationService = {
    getLocation(name?: string): Promise<IPaginatedData<ILocation>> {
        const url = name ? `${BASE_LOCATION_URL}/${name}` : BASE_LOCATION_URL;
        return httpClient.get(url);
    },
};
