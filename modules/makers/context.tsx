import { useRouter } from "next/router";
import { AppState } from "../../common/context/appState";
import { useMaker } from "../../common/context/weverseUtils";

export const useCurrentMaker = (appState: AppState) => {
  const router = useRouter();
  const { makerId } = router.query;
  return useMaker(appState, router.isReady ? String(makerId) : undefined);
};
