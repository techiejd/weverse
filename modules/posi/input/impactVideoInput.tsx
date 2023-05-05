import { useEffect, useState } from "react";
import FileInput from "./fileInput";
import { useFormData } from "./context";
import { Box, Typography } from "@mui/material";

const ImpactVideoInput = () => {
  const [formData, setFormData] = useFormData();
  const [videoUrl, setVideoUrl] = useState<string | undefined | "loading">(
    formData.video
  );
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        video: videoUrl,
      }));
    }
  }, [videoUrl, setFormData]);
  return (
    <Box>
      <Typography>Sube un video de tu acción</Typography>
      <FileInput
        initialFileUrl={formData.video}
        setFileUrl={setVideoUrl}
        required={formData.video ? false : true}
        minFileSize={104857 /** 0.1MB */}
        maxFileSize={2147483648 /** 2GB */}
        accept={"video"}
        metadata={{ impactId: "" }}
      />
    </Box>
  );
};

export default ImpactVideoInput;
