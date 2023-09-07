import Delete from "@mui/icons-material/Delete";
import {
  Stack,
  Typography,
  Box,
  IconButton,
  NativeSelect,
  Button,
} from "@mui/material";
import { NextIntlClientProvider } from "next-intl";
import {
  Dispatch,
  SetStateAction,
  useState,
  Fragment,
  FC,
  useEffect,
} from "react";
import { Locale, locale } from "../../functions/shared/src";
import { Locale2Messages, localeDisplayNames } from "../utils/translations";
import { sectionStyles } from "./theme";

type ValType = { [l in Locale]?: any } & { locale?: Locale };
type SetValType<T extends ValType> = Dispatch<SetStateAction<T>>;

export type DetailedInputProps<T extends ValType> = {
  val?: T;
  setVal?: Dispatch<SetStateAction<T>>;
  locale: Locale;
};

const AddInternationalizedDetailedInput = <T extends ValType>({
  val,
  setVal,
  locale2Messages,
  detailedInput: DetailedInput,
}: {
  val: T;
  setVal: SetValType<T>;
  locale2Messages: Locale2Messages;
  detailedInput: FC<DetailedInputProps<T>>;
}) => {
  const possibleLocales = Object.keys(locale.Enum).filter(
    (l) => l != val.locale
  ) as Locale[];

  const [chosenLocales, setChosenLocales] = useState<Locale[]>([
    ...possibleLocales.filter((l) => !!val[l]),
  ]);
  const [choosableLocales, setChoosableLocales] = useState<Locale[]>(
    possibleLocales.filter((l) => !chosenLocales.includes(l))
  );
  const [selectedLocale, setSelectedLocale] = useState<Locale | undefined>(
    choosableLocales[0]
  );
  useEffect(() => {
    setSelectedLocale(choosableLocales[0]);
  }, [choosableLocales]);

  // In this section, we will make a box that holds in it
  // 1. A title that says "Detailed info in other languages"
  return (
    <Stack
      sx={[
        sectionStyles,
        {
          backgroundColor: "background.paper",
        },
      ]}
      spacing={2}
    >
      <Typography variant="h3"> Detailed info in other languages</Typography>
      {
        // In this section, we will make a box that holds in it
        // 1. A list of the choosen locales with the detailed info form for each
        chosenLocales.map((l) => (
          <Box key={l}>
            <Stack
              direction="row"
              sx={{ ml: 2, alignItems: "center" }}
              spacing={2}
            >
              <IconButton
                onClick={() => {
                  // Remove the locale from the chosen locales
                  // And setVal to remove the detailed info for that locale
                  setChosenLocales((prev) => prev.filter((cl) => cl != l));
                  setChoosableLocales((prev) => [...prev, l]);
                  setVal((prev) => {
                    const newPrev = { ...prev };
                    delete newPrev[l];
                    return newPrev;
                  });
                }}
              >
                <Delete />
              </IconButton>
              <Typography variant="h3">{localeDisplayNames[l]}</Typography>
            </Stack>
            <NextIntlClientProvider messages={locale2Messages[l]}>
              <DetailedInput val={val} setVal={setVal} locale={l} />
            </NextIntlClientProvider>
          </Box>
        ))
      }
      {
        // In this section, we will make a box that holds in it
        // 1. A title that says "Add another language". Languages are represented by locale codes.
        // 2. A dropdown that lets you choose a language
        // 3. A button that says "Add"
        // 4. A component that lets you edit the detailed initiative input for that language
        // 5. A close button on the top right of the detailed initiative input component
        choosableLocales.length > 0 && (
          <Fragment>
            <Typography variant="h3">Add another language</Typography>
            <NativeSelect
              value={selectedLocale}
              onChange={(e) => {
                setSelectedLocale(e.target.value as Locale);
              }}
            >
              {choosableLocales.map((l) => (
                <option value={l} key={l}>
                  {locale.Enum[l]}
                </option>
              ))}
            </NativeSelect>
            <Button
              onClick={() => {
                setChosenLocales((chosenLocales) => [
                  ...chosenLocales,
                  selectedLocale!,
                ]);
                setChoosableLocales((choosableLocales) =>
                  choosableLocales.filter((l) => l != selectedLocale)
                );
              }}
            >
              Add
            </Button>
          </Fragment>
        )
      }
    </Stack>
  );
};

export default AddInternationalizedDetailedInput;
