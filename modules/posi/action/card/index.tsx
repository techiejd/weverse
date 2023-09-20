import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Dialog,
} from "@mui/material";
import { PosiFormData } from "../../../../functions/shared/src";
import Media from "../../media";
import OverlayInfo from "./overlayInfo";
import RatingsStack from "../../../../common/components/ratings";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import LogInPrompt from "../../../../common/components/logInPrompt";
import { useMyMember } from "../../../../common/context/weverseUtils";
import ValidationInfo from "./validationInfo";
import { useLocalizedPresentationInfo } from "../../../../common/utils/translations";
import Image from "next/image";

const LogInPromptDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  //TODO(techiejd): Figure out the log in stuff. bring to top of app.
  return (
    <Dialog open={open}>
      <LogInPrompt
        title="Para dar 'Me Gusta' debes iniciar sesión."
        setOpen={setOpen}
      />
    </Dialog>
  );
};

const MemberLogInTrigger = ({
  setLogInPromptDialogOpen,
}: {
  setLogInPromptDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [myMember] = useMyMember();
  useEffect(() => {
    if (myMember) setLogInPromptDialogOpen(false);
  }, [myMember, setLogInPromptDialogOpen]);
  return <Box />;
};

const ImpactCard2 = ({ posiData }: { posiData: PosiFormData }) => {
  const presentationInfo = useLocalizedPresentationInfo(posiData);
  const media = !presentationInfo
    ? undefined
    : presentationInfo.media.type == "video"
    ? {
        video: {
          threshold: 0.9,
          muted: true,
          disablePictureInPicture: true,
          src: presentationInfo.media.url,
          controls: false,
          objectFit: "cover" as "cover",
        },
      }
    : { image: { src: presentationInfo.media.url } };
  const [logInPromptDialogOpen, setLogInPromptDialogOpen] = useState(false);
  return (
    <Card
      sx={{
        width: "100%",
        p: 1,
        borderRadius: 2,
      }}
      elevation={5}
    >
      <LogInPromptDialog
        open={logInPromptDialogOpen}
        setOpen={setLogInPromptDialogOpen}
      />
      <MemberLogInTrigger setLogInPromptDialogOpen={setLogInPromptDialogOpen} />
      <CardActionArea href={`/posi/${posiData.id}`}>
        <Box
          sx={{
            width: "100%",
            height: "50vh",
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            {media && <Media {...media} />}
          </Box>
          <OverlayInfo
            action={posiData}
            setLogInPromptOpen={setLogInPromptDialogOpen}
          />
        </Box>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            sx={{
              fontSize: 18,
            }}
          >
            {presentationInfo?.summary}
          </Typography>
          <RatingsStack ratings={posiData.ratings} />
          {posiData.validation && <ValidationInfo {...posiData.validation} />}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const ImpactCard = ({ posiData }: { posiData: PosiFormData }) => {
  const presentationInfo = useLocalizedPresentationInfo(posiData);
  const media = !presentationInfo
    ? undefined
    : presentationInfo.media.type == "video"
    ? {
        video: {
          threshold: 0.9,
          muted: true,
          disablePictureInPicture: true,
          src: presentationInfo.media.url,
          controls: false,
          objectFit: "cover" as "cover",
        },
      }
    : { image: { src: presentationInfo.media.url } };
  const [logInPromptDialogOpen, setLogInPromptDialogOpen] = useState(false);
  const hasAddress = posiData.location?.structuredFormatting?.mainText;
  return (
    <Fragment>
      {" "}
      <LogInPromptDialog
        open={logInPromptDialogOpen}
        setOpen={setLogInPromptDialogOpen}
      />
      <MemberLogInTrigger setLogInPromptDialogOpen={setLogInPromptDialogOpen} />
      <div className="action-card h-[600px] overflow-hidden flex flex-col py-2 px-4 box-border items-center justify-center max-h-[1000px] text-left text-xs text-white font-card-body-text">
        <div className="w-full h-full rounded-2xl bg-white flex flex-col pt-2 px-2 pb-6 box-border items-center justify-start gap-[12px] min-w-[280px] max-w-[433px] max-h-[600px] text-left text-xs text-white font-card-body-text sm:h-full">
          <div className="self-stretch flex-1 flex flex-col items-center justify-start min-h-[200px] max-h-[336px]">
            <div className="self-stretch flex-1 rounded-xl flex flex-col items-start justify-start bg-[url('/action-image7@3x.png')] bg-cover bg-no-repeat bg-[bottom] max-h-[336px]">
              <div className="flex flex-row py-2 px-1 items-start justify-start">
                <button className="cursor-pointer [border:none] py-2 px-0 bg-gray-400/30 rounded-41xl flex flex-row flex-wrap box-border items-start justify-start min-w-[90px] max-w-[393px]">
                  <div className="flex flex-row py-0 px-2.5 items-center justify-start gap-[6px]">
                    <div className="flex flex-row items-center justify-start max-w-[300px]">
                      <div className="relative w-8 h-[33px] object-cover">
                        <Image fill alt="" src="/maker-logo5@2x.png" />
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-[4px] max-w-[348px]">
                      <div className="flex flex-row flex-wrap items-center justify-start">
                        <b
                          className="relative text-xs font-bold font-card-body-text text-blue-0 text-left inline-block min-w-[10px] max-w-[260px]"
                          id="Maker name"
                        >
                          MasterPeace Colombia / PeaceHub Medellín
                        </b>
                      </div>
                      <div className="rounded-2xs bg-lightgoldenrodyellow flex flex-col py-0.5 px-1.5 items-start justify-center">
                        <div className="relative text-xs font-card-body-text text-blue-400 text-left inline-block max-w-[185px]">
                          Type of maker
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div
              className={`self-stretch flex flex-row p-2 items-center mt-[-54px] ${
                hasAddress ? "justify-between" : "flex-end"
              }`}
            >
              {hasAddress && (
                <button className="cursor-pointer [border:none] py-1 px-3 bg-white rounded-11xl flex flex-row items-center justify-start gap-[6px]">
                  <div className="relative w-[9.27px] h-[10.7px]">
                    <Image fill alt="" src="/vector13.svg" />
                  </div>
                  <div className="relative text-xs font-semibold font-card-body-text text-black text-center">
                    {posiData.location!.structuredFormatting!.mainText}
                  </div>
                </button>
              )}
              <button className="cursor-pointer [border:none] p-0 bg-[transparent] relative w-[34px] h-[34px]">
                <div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50%] bg-gray-500/50" />
                <div className="absolute h-[57.83%] w-[66.18%] top-[21.3%] right-[16.91%] bottom-[20.87%] left-[16.91%] max-w-full overflow-hidden max-h-full">
                  <svg
                    width="24"
                    height="21"
                    viewBox="0 0 24 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 19.6363C17.25 16.0888 22.5 12.1363 22.5 6.88626C22.502 6.19627 22.3675 5.51269 22.1044 4.87483C21.8413 4.23698 21.4546 3.65744 20.9667 3.16954C20.4788 2.68163 19.8993 2.295 19.2614 2.03186C18.6236 1.76873 17.94 1.63428 17.25 1.63626C15.9 1.63626 14.565 2.14626 13.5375 3.17376L12 4.71126L10.4625 3.17376C9.976 2.68441 9.39754 2.29606 8.76041 2.03106C8.12328 1.76606 7.44005 1.62964 6.75 1.62964C6.05996 1.62964 5.37673 1.76606 4.7396 2.03106C4.10247 2.29606 3.52401 2.68441 3.0375 3.17376C2.54934 3.66081 2.16222 4.23951 1.89837 4.87662C1.63452 5.51372 1.49914 6.19668 1.5 6.88626C1.5 12.1363 6.75 16.0888 12 19.6363Z"
                      fill="red"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <div className="self-stretch flex flex-col py-0 px-1 items-start justify-center">
            <div className="rounded-xl bg-lightslategray h-[18px] flex flex-row p-2 box-border items-center justify-start">
              <div className="relative">Accion</div>
            </div>
            {posiData.validation && <ValidationInfo {...posiData.validation} />}
          </div>
          <div className="self-stretch flex flex-row flex-wrap py-0 px-1 items-start justify-start text-base text-gray-100 sm:flex-row sm:gap-[8px] sm:items-start sm:justify-start">
            <small
              className="flex-1 relative leading-[24px] font-medium line-clamp-3"
              id="Action card text copy"
            >
              {presentationInfo?.summary}
            </small>
          </div>
          <div className="flex flex-row pt-0 px-0 pb-2 items-center justify-center gap-[26px] text-black">
            <div className="relative w-[95.75px] h-[16.5px]">
              <Image fill alt="" src="/5-stars-rating6.svg" />
            </div>
            <div className="rounded-2xl bg-aliceblue-200 w-[133px] overflow-hidden shrink-0 flex flex-row p-2.5 box-border items-center justify-between">
              <div className="relative w-4 h-4">
                <Image fill alt="" src="/testimonials-icon10.svg" />
              </div>
              <div className="relative leading-[22px] font-medium">
                11 Testimonials
              </div>
            </div>
          </div>
          <button className="cursor-pointer [border:none] py-0 px-2.5 bg-aliceblue-300 w-full rounded-lg h-9 overflow-hidden shrink-0 flex flex-col box-border items-center justify-center max-w-[338px] hover:bg-aliceblue-100">
            <div className="relative text-xs leading-[22px] font-medium font-card-body-text text-darkblue text-center inline-block w-[217.32px]">
              Apoyar
            </div>
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ImpactCard;
