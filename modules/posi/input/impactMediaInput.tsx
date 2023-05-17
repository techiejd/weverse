import { useEffect, useState } from "react";
import FileInput from "./fileInput";
import { useFormData } from "./context";
import { Box, Typography } from "@mui/material";
import { Media } from "shared";

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
  return (
    <Box>
      <Typography>Sube un video o imagen de tu acción.</Typography>
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
