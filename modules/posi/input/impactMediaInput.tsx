import { useEffect, useState } from "react";
import FileInput from "./fileInput";
import { useFormData } from "./context";
import { Box, Typography } from "@mui/material";
import { Media } from "../../../functions/shared/src";
import { useTranslations } from "next-intl";

const ImpactMediaInput = () => {
  const [formData, setFormData] = useFormData();
  const [media, setMedia] = useState<Media | undefined | "loading">(
    formData.media
  );
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        media: media,
      }));
    }
  }, [media, setFormData]);
  const t = useTranslations("actions.upload.sections.media");
  return (
    <Box>
      <Typography>{t("prompt")}</Typography>
      <FileInput
        initialMedia={formData.media == "loading" ? undefined : formData.media}
        setMedia={setMedia}
        required={formData.media ? false : true}
        maxFileSize={2147483648 /** 2GB */}
        accept={"both"}
        metadata={{ impactId: "" }}
      />
    </Box>
  );
};

export default ImpactMediaInput;
