import { TextField, Stack, Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  FC,
  useMemo,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
  useEffect,
} from "react";
import { DetailedInputProps } from "../../../common/components/addInternationalizedDetailedInput";
import Section from "../../../common/components/section";
import { sectionStyles } from "../../../common/components/theme";
import {
  Maker as Initiative,
  MakerPresentationExtension as InitiativePresentationExtension,
  organizationType,
  Media,
} from "../../../functions/shared/src";
import { FileInput } from "../../posi/input";

const DetailedInput: FC<DetailedInputProps<Initiative>> = ({
  val,
  setVal,
  locale,
}: DetailedInputProps<Initiative>) => {
  const detailedInputTranslations = useTranslations(
    "initiatives.edit.detailedInput"
  );
  const inputTranslations = useTranslations("input");

  const detailedInput = useMemo(() => {
    return val ? val[locale] : undefined;
  }, [locale, val]);

  const setPartialDetailedInput: Dispatch<
    SetStateAction<InitiativePresentationExtension>
  > = useCallback(
    (
      extOrCallback:
        | InitiativePresentationExtension
        | ((
            prevState: InitiativePresentationExtension
          ) => InitiativePresentationExtension)
    ): void => {
      if (!setVal) return;
      // localized
      setVal((initiative) => {
        const prevValue = initiative[locale] || {};
        const value =
          typeof extOrCallback == "function"
            ? extOrCallback(prevValue)
            : extOrCallback;
        return {
          ...initiative,
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

  //TODO(techiejd): Fix videos story. All the videos should have refs (not just links) and the metadata should include initiative id.

  const targetedQuestion =
    val?.organizationType == organizationType.Enum.incubator ? (
      <Section
        label={detailedInputTranslations(
          "incubator.whatIsYourValidationProcess"
        )}
      >
        <TextField
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
          { initiativeType: val?.type }
        )}
      >
        <TextField
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
    <Stack spacing={2} sx={sectionStyles}>
      <Section
        label={detailedInputTranslations("story.title", {
          initiativeType: val?.type,
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
              metadata={{ initiativeId: "", userID: "" }}
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

export default DetailedInput;
