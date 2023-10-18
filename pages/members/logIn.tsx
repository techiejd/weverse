import { Box } from "@mui/material";
import { asOneWePage } from "../../common/components/onewePage";
import { WithTranslationsStaticProps } from "../../common/utils/translations";
import { useMyMember } from "../../common/context/weverseUtils";
import { useEffect } from "react";
import { useRouter } from "next/router";
import LogInPrompt from "../../common/components/logInPrompt";

export const getStaticProps = WithTranslationsStaticProps();

const LogIn = asOneWePage(() => {
  const [myMember] = useMyMember();
  const router = useRouter();
  useEffect(() => {
    if (myMember) {
      router.push(`${myMember.path}`);
    }
  }, [myMember, router]);
  return <LogInPrompt title="Yo" />;
});

export default LogIn;
