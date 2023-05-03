import {
  Box,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PlacesAutocomplete, { Suggestion } from "react-places-autocomplete";
import { useFormData } from "./context";
import Script from "next/script";

const CitySearchInput = () => {
  const [formData, setFormData] = useFormData();
  const [query, setQuery] = useState(
    formData.location?.structuredFormatting
      ? `${formData.location.structuredFormatting.mainText} ${formData.location.structuredFormatting.secondaryText}`
      : ""
  );
  const handleInputChange = (query: string) => {
    setQuery(query);
  };

  // NOTE: `placeId` and `suggestion` are null when user hits Enter key with no suggestion item selected.
  // Also for some reason, their .d.ts doesn't mention the suggestion but their github does.
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

  const handleClear = () => {
    setQuery("");
    if (setFormData) {
      console.log("Clearing form location");
      setFormData((fD) => {
        const { location, ...others } = fD;
        return others;
      });
    }
  };

  return (
    <Box>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCOkpsRpjgv8GyDniz5L7pnxoO40arBE38&libraries=places&callback=mapsInitializedForWeVerse"
        async
      />
      <PlacesAutocomplete
        value={query}
        onChange={handleInputChange}
        onSelect={handleSelect}
        googleCallbackName="mapsInitializedForWeVerse"
        highlightFirstSuggestion
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <Box>
            <Input
              {...getInputProps({
                placeholder: "Buscar ubicaciones ...",
                onBlur: () => {
                  if (
                    formData.location &&
                    formData.location.structuredFormatting?.mainText &&
                    formData.location.structuredFormatting?.secondaryText
                  ) {
                    // userAlreadySelectedLocation
                    if (
                      !query.includes(
                        formData.location.structuredFormatting?.mainText
                      ) ||
                      !query.includes(
                        formData.location.structuredFormatting?.secondaryText
                      )
                    ) {
                      // There is no new selection from google maps.
                      // Since onBlur, we just reset it to empty.
                      setQuery("");
                    }
                    // The user has selected from google maps and is just going to onBlur
                    return;
                  } else {
                    // Onblur with no selection
                    setQuery("");
                  }
                },
                onClick: () => {
                  handleClear();
                },
              })}
              sx={{ width: "100%" }}
            />
            <List sx={{ width: "100%" }}>
              {loading && <Typography>Loading...</Typography>}
              {suggestions.map((suggestion, i) => {
                const { key, ...others } = getSuggestionItemProps(suggestion);
                // Use placeId for the key and ignore the one by getSuggestionItemPropsy;
                return (
                  <ListItem key={suggestion.placeId} {...others}>
                    <ListItemButton selected={suggestion.active}>
                      <ListItemText
                        primary={suggestion.formattedSuggestion.mainText}
                        secondary={suggestion.formattedSuggestion.secondaryText}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        )}
      </PlacesAutocomplete>
    </Box>
  );
};

export default CitySearchInput;
