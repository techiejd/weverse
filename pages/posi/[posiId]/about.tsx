import { useRouter } from "next/router";
import ImpactPage, { PageTypes } from "../../../modules/posi/impactPage";
import AboutContent from "../../../modules/posi/impactPage/about/AboutContent";
import {
  PosiFormData,
  castFirestoreDocToPosiFormData,
} from "../../../modules/posi/input/context";
import { doc, getDoc } from "firebase/firestore";
import { useAppState } from "../../../common/context/appState";
import { useEffect, useState } from "react";
import { z } from "zod";
import { CircularProgress } from "@mui/material";

const About = () => {
  const appState = useAppState();
  const router = useRouter();
  const { posiId } = router.query;
  const [posiData, setPosiData] = useState<PosiFormData | undefined>(undefined);

  useEffect(() => {
    if (appState && posiId) {
      const fetchAndSetPosiData = async () => {
        const docRef = doc(
          appState.firestore,
          "impacts",
          z.string().parse(posiId)
        );
        const docSnap = await getDoc(docRef);
        setPosiData(castFirestoreDocToPosiFormData.parse(docSnap.data()));
      };
      fetchAndSetPosiData();
    }
  }, [appState, setPosiData, posiId]);
  return posiData && posiId ? (
    <ImpactPage
      type={PageTypes.about}
      path={router.asPath}
      description={`${posiData.summary}`}
      id={String(posiId)}
    >
      <AboutContent {...posiData} />
    </ImpactPage>
  ) : (
    <CircularProgress />
  );
};

export default About;
