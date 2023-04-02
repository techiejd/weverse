import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { Box, IconButton, InputAdornment, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { z } from "zod";
import { useFormData } from "./context";

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
  const [inputValue, setInputValue] = useState<string>("");

  const onUserSelectedAnOption = (event: SyntheticEvent, value: any) => {
    if (value == null) return;

    const currInput = z.string().parse(value).trim();
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
    setInputValue("");
  };

  const onUserTyping = (event: SyntheticEvent, value: string) => {
    if (event == null || event.type != "change") {
      // The user didn't type.
      return;
    }
    const almostAllNotOKTagChars = /[^\w\s]/gi;
    const scrubbedTag = value
      .toLowerCase()
      .trimStart()
      .replace(almostAllNotOKTagChars, "")
      .replace("_", "");

    setInputValue(scrubbedTag);
  };
  return (
    <Autocomplete
      onChange={onUserSelectedAnOption}
      onInputChange={onUserTyping}
      inputValue={inputValue}
      autoHighlight={true}
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
      options={hardcodedTags}
      renderOption={(props, option) => <li {...props}>{option}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label="Elija las etiquetas del impacto."
          helperText="Mínimo de una etiqueta. Agregue su propia etiqueta si no ve la que desea. Solo se puede de 'a' a 'z', de 0 a 9 y ' '."
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

const TagInfoInputValue = ({
  info,
  setTagInfos,
}: {
  info: TagInfo;
  setTagInfos: Dispatch<SetStateAction<TagInfo[]>>;
}) => {
  const closeTag = (e: MouseEvent) => {
    setTagInfos((tagInfos) => {
      const indexOfThis = tagInfos.findIndex((tI) => tI.tag == info.tag);
      tagInfos.splice(indexOfThis, 1);
      // Must be spread out to re-render
      // See https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
      return [...tagInfos];
    });
  };
  return (
    <TextField
      value={info.tag}
      InputProps={{
        readOnly: true,
        startAdornment: (
          <InputAdornment position="start">
            {info.addition && "Agregando: "}#
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={closeTag}>
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default function TagsInput() {
  const [formData, setFormData] = useFormData();
  const [tagInfos, setTagInfos] = useState<TagInfo[]>([]);

  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        tags: tagInfos.map((tI) => tI.tag),
      }));
    }
  }, [tagInfos, setFormData]);
  return (
    <Stack margin={2} spacing={2}>
      <Box>
        {tagInfos.map((tag, i) => {
          return (
            <TagInfoInputValue info={tag} setTagInfos={setTagInfos} key={i} />
          );
        })}
      </Box>
      <SearchTagsInput setTagInfos={setTagInfos} />
    </Stack>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const hardcodedTags: readonly Tag[] = ["ambiente", "pobreza"];
