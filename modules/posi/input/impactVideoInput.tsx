import { useEffect, useState } from "react";
import FileInput from "./fileInput";
import { useFormData } from "./context";

const ImpactVideoInput = () => {
  const [videoUrl, setVideoUrl] = useState<string | undefined | "loading">();
  const [formData, setFormData] = useFormData();
  useEffect(() => {
    if (setFormData) {
      setFormData((fD) => ({
        ...fD,
        video: videoUrl,
      }));
    }
  }, [videoUrl, setFormData]);
  return (
    <FileInput
      setFileUrl={setVideoUrl}
      required
      minFileSize={1048576 /** 1MB */}
      maxFileSize={2147483648 /** 2GB */}
      accept={"video"}
      metadata={{ impactId: "" }}
    />
  );
};

export default ImpactVideoInput;
