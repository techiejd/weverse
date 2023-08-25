import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  NativeSelect,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Section from "../../common/components/section";
import {
  organizationType,
  Maker,
  OrganizationType,
  Media,
  locale,
  Locale,
  MakerPresentationExtension,
} from "../../functions/shared/src";
import { FileInput } from "../posi/input";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { Locale2Messages } from "../../common/utils/translations";
import { sectionStyles } from "../../common/components/theme";

const OrganizationTypeInput = ({
  val,
  setVal,
}: {
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
}) => {
  const organizationTypeTranslations = useTranslations(
    "makers.edit.chooseMakerType.organizationType"
  );
  const makerTypesTranslations = useTranslations("makers.types");
  const inputTranslations = useTranslations("input");
  const organizationTypeChange = (
    e: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const type = value as OrganizationType;
    setVal((maker) => ({
      ...maker,
      organizationType: type,
    }));
  };

  return (
    <Box>
      <TextField
        required
        fullWidth
        label={`${organizationTypeTranslations(
          "namePrompt"
        )} (${inputTranslations("numChars", { numChars: 75 })})`}
        margin="normal"
        inputProps={{ maxLength: 75 }}
        value={val.name ? val.name : ""}
        onChange={(e) => {
          setVal((maker) => ({
            ...maker,
            name: e.target.value,
          }));
        }}
      />
      <FormControl>
        <FormLabel>{makerTypesTranslations("title")}</FormLabel>
        <RadioGroup
          name="chooseOrganizationType"
          onChange={organizationTypeChange}
          value={val.organizationType ?? null}
        >
          {Object.keys(organizationType.Values).map((val) => {
            const oType = val as OrganizationType;
            return (
              <FormControlLabel
                key={oType}
                value={oType}
                control={<Radio required />}
                label={makerTypesTranslations("long." + oType)}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

const DetailedInput = ({
  val,
  setVal,
  locale,
}: {
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
  locale: Locale;
}) => {
  const detailedInputTranslations = useTranslations(
    "makers.edit.detailedInput"
  );
  const inputTranslations = useTranslations("input");

  const detailedInput = useMemo(() => {
    return val[locale];
  }, [locale, val]);

  const setPartialDetailedInput: Dispatch<
    SetStateAction<MakerPresentationExtension>
  > = useCallback(
    (
      extOrCallback:
        | MakerPresentationExtension
        | ((
            prevState: MakerPresentationExtension
          ) => MakerPresentationExtension)
    ): void => {
      // localized
      setVal((maker) => {
        const prevValue = maker[locale] || {};
        const value =
          typeof extOrCallback == "function"
            ? extOrCallback(prevValue)
            : extOrCallback;
        return {
          ...maker,
          [locale]: {
            ...prevValue,
            ...value,
          },
        };
      });
    },
    [locale, setVal]
  );

  const [presentationVideo, setPresentationVideo] = useState<
    Media | undefined | "loading"
  >(
    detailedInput?.presentationVideo
      ? { type: "video", url: detailedInput.presentationVideo }
      : undefined
  );
  useEffect(() => {
    if (presentationVideo && presentationVideo != "loading") {
      setPartialDetailedInput({ presentationVideo: presentationVideo.url });
    }
  }, [presentationVideo, setPartialDetailedInput]);

  const setAboutInput = (about: string) => {
    setPartialDetailedInput({ about });
  };

  const setContactSupport = (contactSupport: string) => {
    setPartialDetailedInput((ext) => ({
      howToSupport: { ...ext.howToSupport, contact: contactSupport },
    }));
  };

  //TODO(techiejd): Fix videos story. All the videos should have refs (not just links) and the metadata should include maker id.

  const targetedQuestion =
    val.organizationType == organizationType.Enum.incubator ? (
      <Section
        label={detailedInputTranslations(
          "incubator.whatIsYourValidationProcess"
        )}
      >
        <TextField
          fullWidth
          label={`${detailedInputTranslations(
            "incubator.leaveDetails"
          )} (${inputTranslations("numChars", { numChars: 500 })}).`}
          name="validationProcess"
          multiline
          minRows={2}
          inputProps={{ maxLength: 500 }}
          helperText={detailedInputTranslations(
            "incubator.devilIsInTheDetailsReminder"
          )}
          value={
            detailedInput?.validationProcess
              ? detailedInput.validationProcess
              : ""
          }
          onChange={(e) => {
            setPartialDetailedInput({ validationProcess: e.target.value });
          }}
        />
      </Section>
    ) : (
      <Section
        label={detailedInputTranslations(
          "nonFinancialHelp.whatOtherHelpDoYouNeed",
          { makerType: val.type }
        )}
      >
        <TextField
          fullWidth
          label={`${detailedInputTranslations(
            "nonFinancialHelp.leaveContactDetails"
          )} (${inputTranslations("numChars", { numChars: 500 })}).`}
          name="summary"
          multiline
          minRows={2}
          inputProps={{ maxLength: 500 }}
          helperText={detailedInputTranslations("nonFinancialHelp.helperText")}
          value={
            detailedInput?.howToSupport?.contact
              ? detailedInput.howToSupport.contact
              : ""
          }
          onChange={(e) => {
            setContactSupport(e.target.value);
          }}
        />
      </Section>
    );

  return (
    <Stack margin={2} spacing={2}>
      <Section
        label={detailedInputTranslations("story.title", {
          makerType: val.type,
        })}
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="h3">
              {detailedInputTranslations("story.video.title")}
            </Typography>
            <FileInput
              initialMedia={
                presentationVideo != "loading" ? presentationVideo : undefined
              }
              setMedia={setPresentationVideo}
              maxFileSize={10485760 /** 10MB */}
              accept={"video"}
              metadata={{ makerId: "", userID: "" }}
            />
            <Typography>
              {detailedInputTranslations("story.video.prompt")}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3">
              {detailedInputTranslations("story.blurb.title")}
            </Typography>
            <TextField
              fullWidth
              label={`${detailedInputTranslations(
                "story.blurb.prompt"
              )} (${inputTranslations("numChars", { numChars: 1000 })})`}
              name="summary"
              multiline
              minRows={3}
              inputProps={{ maxLength: 1000 }}
              helperText={detailedInputTranslations("story.blurb.helperText")}
              value={detailedInput?.about ? detailedInput.about : ""}
              onChange={(e) => setAboutInput(e.target.value)}
            />
          </Box>
        </Stack>
      </Section>
      {targetedQuestion}
    </Stack>
  );
};

const AddInternationalizedDetailedInput = ({
  val,
  setVal,
  locale2Messages,
}: {
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
  locale2Messages: Locale2Messages;
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

  // In this section, we will make a box that holds in it
  // 1. A title that says "Detailed info in other languages"
  return (
    <Box>
      <Typography variant="h3"> Detailed info in other languages</Typography>
      {
        // In this section, we will make a box that holds in it
        // 1. A list of the choosen locales with the detailed info form for each
        chosenLocales.map((l) => (
          <Box key={l}>
            <Typography variant="h3">{locale.Enum[l]}</Typography>
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
        // 4. A component that lets you edit the detailed maker input for that language
        // 5. A close button on the top right of the detailed maker input component
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
    </Box>
  );
};

const MakerInput = ({
  userName,
  val,
  setVal,
  locale2Messages,
}: {
  userName: string;
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
  locale2Messages: Locale2Messages;
}) => {
  const makerChange = (e: ChangeEvent<HTMLInputElement>, value: string) => {
    const type = value as "individual" | "organization";

    setVal((maker) => ({
      ...maker,
      type: type,
      organizationType:
        type == "organization" ? val.organizationType : undefined,
      name: type == "organization" ? val.name : userName,
    }));
  };
  const chooseMakerTypeTranslations = useTranslations(
    "makers.edit.chooseMakerType"
  );

  const setEmail = (email: string) => {
    setVal((maker) => ({
      ...maker,
      email: email,
    }));
  };

  const detailedInputTranslations = useTranslations(
    "makers.edit.detailedInput"
  );

  const askForInfoMsg = detailedInputTranslations("askForInfoMsg", {
    makerType: val.type,
  });

  const [pic, setPic] = useState<Media | undefined | "loading">(
    val.pic ? { type: "img", url: val.pic } : undefined
  );
  useEffect(() => {
    if (pic && pic != "loading") {
      setVal((maker) => ({ ...maker, pic: pic.url }));
    }
  }, [pic, setVal]);
  const askForImage = detailedInputTranslations("askForImage", {
    makerType: val.type,
  });
  return (
    <Stack alignItems={"center"}>
      <FormControl>
        <RadioGroup
          name="chooseMakerType"
          row
          onChange={makerChange}
          value={val.type}
        >
          <FormControlLabel
            value="individual"
            control={<Radio required />}
            label={chooseMakerTypeTranslations("individual")}
          />
          <FormControlLabel
            value="organization"
            control={<Radio required />}
            label={chooseMakerTypeTranslations("organization")}
          />
        </RadioGroup>
      </FormControl>
      <Typography variant="h3">{askForInfoMsg}</Typography>
      {val.type == "organization" && (
        <OrganizationTypeInput val={val} setVal={setVal} />
      )}
      <Section label={"Whatever put yor email here"}>
        <TextField
          label={"email dawg"}
          type="email"
          fullWidth
          value={val.email ? val.email : ""}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Section>
      <Section
        label={detailedInputTranslations("profileImage", {
          makerType: val.type,
        })}
      >
        <Typography>{askForImage}</Typography>
        <FileInput
          initialMedia={pic != "loading" ? pic : undefined}
          setMedia={setPic}
          maxFileSize={10485760 /** 10MB */}
          accept={"img"}
          metadata={{ makerId: "", userID: "" }}
        />
      </Section>
      <DetailedInput val={val} setVal={setVal} locale={val.locale!} />
      <AddInternationalizedDetailedInput
        val={val}
        setVal={setVal}
        locale2Messages={locale2Messages}
      />
    </Stack>
  );
};

export default MakerInput;
