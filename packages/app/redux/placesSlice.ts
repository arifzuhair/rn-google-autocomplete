import type { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GMapAPI } from "../services/api";

type Coordinates = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type PlaceState = {
  results: PlaceAutocompleteResult[];
  history: PlaceAutocompleteResult[];
  selectedPlace: Coordinates | undefined;
  loading: boolean;
  error: string | null;
  isSearching: boolean;
};

const initialState: PlaceState = {
  results: [],
  history: [],
  selectedPlace: undefined,
  loading: false,
  error: null,
  isSearching: false,
};

export const findPlaces = createAsyncThunk(
  "places/findPlaces",
  async (input: string, { rejectWithValue }) => {
    try {
      return await GMapAPI.getPlaces({ input });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const findPlacesDetails = createAsyncThunk(
  "places/findPlacesDetails",
  async (placeId: string, { rejectWithValue }) => {
    try {
      const { geometry } = await GMapAPI.getPlacesDetails({ placeId });
      const { location, viewport } = geometry;

      return {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: viewport.northeast.lat - viewport.southwest.lat,
        longitudeDelta: viewport.northeast.lng - viewport.southwest.lng,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        findPlaces.fulfilled,
        (state, action: PayloadAction<PlaceAutocompleteResult[]>) => {
          state.loading = false;
          state.results = action.payload;
        }
      )
      .addCase(findPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(findPlacesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        findPlacesDetails.fulfilled,
        (
          state,
          action: PayloadAction<Coordinates, string, { arg: string }>
        ) => {
          state.loading = false;
          state.selectedPlace = action.payload;

          const place = state.results.find(
            (place) => place.place_id === action.meta.arg
          );

          if (place) {
            state.history.push(place);
          }
        }
      )
      .addCase(findPlacesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setIsSearching } = placesSlice.actions;

export default placesSlice.reducer;
