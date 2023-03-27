import {
  Box,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Component, useState } from "react";
import PlacesAutocomplete, {
  Suggestion,
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useFormData } from "./context";

const CitySearchInput = () => {
  const [formData, setFormData] = useFormData();
  const [query, setQuery] = useState("");
  const handleInputChange = (query: string) => {
    console.log("handleInputChange");
    setQuery(query);
  };

  // NOTE: `placeId` and `suggestion` are null when user hits Enter key with no suggestion item selected.
  // Also for some reason, their .d.ts doesn't mention the suggestion.
  const handleSelect = (
    selectedQueryResult: string,
    placeID?: string,
    suggestion?: Suggestion
  ) => {
    if (placeID && suggestion && setFormData) {
      setQuery(selectedQueryResult);
      setFormData((fD) => ({
        ...fD,
        location: {
          id: placeID,
          structuredFormatting: suggestion.formattedSuggestion,
          terms: suggestion.terms,
          types: suggestion.types,
        },
      }));
    }
  };
  return (
    <Box>
      <script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCOkpsRpjgv8GyDniz5L7pnxoO40arBE38&libraries=places"
        async
      />
      <PlacesAutocomplete
        value={query}
        onChange={handleInputChange}
        onSelect={handleSelect}
        highlightFirstSuggestion
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <Box>
            <Input
              {...getInputProps({
                placeholder: "Buscar ubicaciones ...",
                onBlur: (e) => {
                  if (
                    formData.location &&
                    formData.location.structuredFormatting?.mainText &&
                    formData.location.structuredFormatting?.secondaryText
                  ) {
                    if (
                      !query.includes(
                        formData.location.structuredFormatting?.mainText
                      ) ||
                      !query.includes(
                        formData.location.structuredFormatting?.secondaryText
                      )
                    ) {
                      setQuery("");
                    }
                  } else {
                    setQuery("");
                  }
                },
              })}
              sx={{ width: "100%" }}
            />
            <List sx={{ width: "100%" }}>
              {loading && <Typography>Loading...</Typography>}
              {suggestions.map((suggestion, i) => (
                <ListItem key={i}>
                  <ListItemButton selected={suggestion.active}>
                    <ListItemText
                      primary={suggestion.formattedSuggestion.mainText}
                      secondary={suggestion.formattedSuggestion.secondaryText}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </PlacesAutocomplete>
    </Box>
  );
};

export default CitySearchInput;
