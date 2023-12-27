export interface ILocation {
    id: number;
    streetAddress?: string;
    city: string;
    country: string;
    zip?: string | null;
    longitude?: number | null;
    latitude?: number | null;
}
