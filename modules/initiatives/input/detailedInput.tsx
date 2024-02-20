import { TextField, Stack, Box, Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  FC,
  useMemo,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
  useEffect,
  Fragment,
} from "react";
import { DetailedInputProps } from "../../../common/components/addInternationalizedDetailedInput";
import Section from "../../../common/components/section";
import { sectionStyles } from "../../../common/components/theme";
import {
  Initiative,
  InitiativePresentationExtension,
  organizationType,
  Media,
} from "../../../functions/shared/src";
import { FileInput } from "../../posi/input";
import { useRouter } from "next/router";
import { extractAccountLink } from "../context";

const DetailedInput: FC<DetailedInputProps<Initiative>> = ({
  val,
  setVal,
  locale,
}: DetailedInputProps<Initiative>) => {
  const currentPath = useRouter().asPath;
  const isPublished = currentPath.includes("edit");
  const connectAccountHref = (() => {
    if (isPublished) {
      return currentPath.replace("edit", "connectAccount");
    }
    return undefined;
  })();
  const accountOnboarding = val?.connectedAccount?.status == "onboarding";
  const viewConnectedAccountHref = (() => {
    if (val?.connectedAccount?.status == "active") {
      return extractAccountLink(val.connectedAccount);
    }
    return undefined;
  })();
  const connectIncubatorAccountNeedsAttn =
    (val?.connectedAccount &&
      val?.incubator?.connectedAccount == "pendingIncubateeApproval") ||
    val?.incubator?.connectedAccount == "incubateeRequested";
  const ifIncubatorAccountDoesNotNeedAttn =
    !val?.incubator?.connectedAccount ||
    val?.incubator?.connectedAccount == "allAccepted";
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

  console.log({
    val,
    connectAccount: val?.incubator?.connectedAccount,
    connectIncubatorAccountNeedsAttn,
    ifIncubatorAccountDoesNotNeedAttn,
  });
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
              maxFileSize={2147483648 /** 2GB */}
              accept={"video"}
              metadata={{ initiativePath: val?.path || "" }}
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
      {connectAccountHref && (
        <Section label="Get financial help">
          {!viewConnectedAccountHref &&
            !accountOnboarding && [
              <Typography variant="h3" key="connectAccountMsg">
                In order to get financial help, you need to connect an account.
              </Typography>,
              <Button
                variant="contained"
                href={connectAccountHref}
                sx={{ width: "fit-content", alignSelf: "center" }}
                key="connectAccountBtn"
              >
                Connect account
              </Button>,
            ]}
          {(accountOnboarding || connectIncubatorAccountNeedsAttn) && [
            <Typography variant="h3" key="finishOnboardingMsg">
              Your have not finished onboarding your account. You will be able
              to receive financial help once the process is complete.
            </Typography>,
            <Button
              variant="contained"
              href={connectAccountHref}
              sx={{ width: "fit-content", alignSelf: "center" }}
              key="finishOnboardingBtn"
            >
              Continue onboarding
            </Button>,
          ]}
          {viewConnectedAccountHref &&
            ifIncubatorAccountDoesNotNeedAttn && [
              <Typography variant="h3" key="connectedAccountOkMsg">
                Congratulations, you are on your way to receiving financial
                help.
              </Typography>,
              <Button
                variant="outlined"
                href={connectAccountHref}
                sx={{ width: "fit-content", alignSelf: "center" }}
                key="modifyConnectedAccountBtn"
              >
                Modify connected account
              </Button>,
              <Button
                variant="contained"
                href={viewConnectedAccountHref}
                sx={{ width: "fit-content", alignSelf: "center" }}
                key="viewConnectedAccountBtn"
              >
                View Account
              </Button>,
            ]}
        </Section>
      )}
      {targetedQuestion}
    </Stack>
  );
};

export default DetailedInput;
