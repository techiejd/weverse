import { Ref, forwardRef, useEffect, useState } from "react";

const useHostname = () => {
  const [hostname, setHostName] = useState<undefined | string>();
  useEffect(() => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : undefined;
    if (origin) {
      setHostName(origin);
    }
  }, []);
  return hostname;
};

export default useHostname;
