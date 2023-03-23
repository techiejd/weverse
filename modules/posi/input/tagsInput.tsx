import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import { Box, IconButton, InputAdornment } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { z } from "zod";

const tag = z.string();
type Tag = z.infer<typeof tag>;
const tagInfo = z.object({ tag: tag, addition: z.boolean().optional() });
type TagInfo = z.infer<typeof tagInfo>;

const SearchTagsInput = ({
  setTagInfos,
}: {
  setTagInfos: Dispatch<SetStateAction<TagInfo[]>>;
}) => {
  const additionPrompt = "Agregar";
  const tagFromAdditionPrompt = (input: string) => {
    return input.replace(additionPrompt, "").slice(2, -1); // remove ` "` and `"` from front and back.
  };

  const filter = createFilterOptions<Tag>();
  const onUserSelectedAnOption = (event: SyntheticEvent, value: any) => {
    if (value == null) return;
    const currInput = z.string().parse(value);
    const tagInfo = currInput.startsWith(additionPrompt)
      ? {
          addition: true,
          tag: tagFromAdditionPrompt(currInput),
        }
      : { tag: currInput };

    setTagInfos((tagInfos) => {
      const tagInfoAlreadyIn = tagInfos.some((val) => val.tag == tagInfo.tag);
      return tagInfoAlreadyIn ? tagInfos : [...tagInfos, tagInfo];
    });
  };
  return (
    <Autocomplete
      onChange={onUserSelectedAnOption}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option);
        if (inputValue !== "" && !isExisting) {
          filtered.push(`${additionPrompt} "${inputValue}"`);
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={hardcodedTags}
      renderOption={(props, option) => <li {...props}>{option}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label="Elija las etiquetas del impacto."
          helperText="Mínimo de una etiqueta. Agregue su propia etiqueta si no ve la que desea."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">#</InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

const TagInfoInputValue = ({ info }: { info: TagInfo }) => {
  return (
    <TextField
      value={info.tag}
      InputProps={{
        readOnly: true,
        startAdornment: <InputAdornment position="start">#</InputAdornment>,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default function TagsInput() {
  const [tagInfos, setTagInfos] = useState<TagInfo[]>([]);
  return (
    <Box>
      {Array.from(tagInfos).map((tag, i) => {
        return <TagInfoInputValue info={tag} key={i} />;
      })}
      <SearchTagsInput setTagInfos={setTagInfos} />
    </Box>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const hardcodedTags: readonly Tag[] = ["ambiente", "pobreza"];
