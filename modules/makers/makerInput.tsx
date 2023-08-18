import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Section from "../../common/components/section";
import {
  organizationType,
  Maker,
  OrganizationType,
  Media,
} from "../../functions/shared/src";
import { FileInput } from "../posi/input";
import { useTranslations } from "next-intl";

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
  const makerTypesTranslations = useTranslations("makers.types.long");
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
        <FormLabel>{inputTranslations("title")}</FormLabel>
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
                label={makerTypesTranslations(oType)}
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
}: {
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
}) => {
  const detailedInputTranslations = useTranslations(
    "makers.edit.detailedInput"
  );
  const inputTranslations = useTranslations("input");
  const [pic, setPic] = useState<Media | undefined | "loading">(
    val.pic ? { type: "img", url: val.pic } : undefined
  );
  useEffect(() => {
    if (pic && pic != "loading") {
      setVal((maker) => ({ ...maker, pic: pic.url }));
    }
  }, [pic, setVal]);

  const [presentationVideo, setPresentationVideo] = useState<
    Media | undefined | "loading"
  >(
    val.presentationVideo
      ? { type: "video", url: val.presentationVideo }
      : undefined
  );
  useEffect(() => {
    if (presentationVideo && presentationVideo != "loading") {
      setVal((maker) => ({
        ...maker,
        presentationVideo: presentationVideo.url,
      }));
    }
  }, [presentationVideo, setVal]);

  const setAboutInput = (about: string) => {
    setVal((maker) => ({ ...maker, about: about }));
  };

  const setContactSupport = (contactSupport: string) => {
    setVal((maker) => ({
      ...maker,
      howToSupport: { ...maker.howToSupport, contact: contactSupport },
    }));
  };
  const setEmail = (email: string) => {
    setVal((maker) => ({
      ...maker,
      email: email,
    }));
  };

  const setValidationProcess = (validationProcess: string) => {
    setVal((maker) => ({ ...maker, validationProcess }));
  };

  const askForInfoMsg = detailedInputTranslations("askForInfoMsg", {
    makerType: val.type,
  });

  const askForImage = detailedInputTranslations("askForImage", {
    makerType: val.type,
  });

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
          value={val.validationProcess ? val.validationProcess : ""}
          onChange={(e) => {
            setValidationProcess(e.target.value);
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
          value={val.howToSupport?.contact ? val.howToSupport.contact : ""}
          onChange={(e) => {
            setContactSupport(e.target.value);
          }}
        />
      </Section>
    );

  return (
    <Stack margin={2} spacing={2}>
      <Typography variant="h3">{askForInfoMsg}</Typography>
      {val.type == "organization" && (
        <OrganizationTypeInput val={val} setVal={setVal} />
      )}
      <Section label={detailedInputTranslations("email")}>
        <TextField
          label={inputTranslations("email")}
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
      <Section
        label={detailedInputTranslations("story.title", {
          makerType: val.type,
        })}
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="h3">Presentation video:</Typography>
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
              Tell us about yourself and why you should be sponsored.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3">Presentation blurb:</Typography>
            <TextField
              fullWidth
              label={`${detailedInputTranslations(
                "story.prompt"
              )} (${inputTranslations("numChars", { numChars: 1000 })})`}
              name="summary"
              multiline
              minRows={3}
              inputProps={{ maxLength: 1000 }}
              helperText={detailedInputTranslations("story.helperText")}
              value={val.about ? val.about : ""}
              onChange={(e) => setAboutInput(e.target.value)}
            />
          </Box>
        </Stack>
      </Section>
      {targetedQuestion}
    </Stack>
  );
};

const MakerInput = ({
  userName,
  val,
  setVal,
}: {
  userName: string;
  val: Maker;
  setVal: Dispatch<SetStateAction<Maker>>;
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
      <DetailedInput val={val} setVal={setVal} />
    </Stack>
  );
};

export default MakerInput;
