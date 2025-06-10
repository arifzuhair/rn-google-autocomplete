import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const baseGMapAPI = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api",
  params: {
    key: API_KEY,
  },
  paramsSerializer: (params) => new URLSearchParams(params).toString(),
});

export const GMapAPI = {
  getPlaces: async ({ input }: { input: string }) => {
    return await baseGMapAPI
      .get(`/place/autocomplete/json?input=${input}`)
      .then(({ data }) => data.predictions)
      .catch((err) => {
        throw err;
      });
  },
  getPlacesDetails: async ({ placeId }: { placeId: string }) => {
    return await baseGMapAPI
      .get(`/place/details/json?place_id=${placeId}`)
      .then(({ data }) => data.result)
      .catch((err) => {
        throw err;
      });
  },
};
