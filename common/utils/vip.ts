import {
  Initiative,
  PosiFormData,
  SocialProof,
} from "../../functions/shared/src";
import { useLocalizedPresentationInfo } from "./translations";

export const useVipState = (
  myInitiative: Initiative | undefined,
  socialProofs: SocialProof[] | undefined,
  actions: PosiFormData[] | undefined
) => {
  const oneActionDone = actions ? actions.length > 0 : false;
  const presentationInfo = useLocalizedPresentationInfo(myInitiative);
  const unfinishedFields = (() => {
    if (!myInitiative) {
      return undefined;
    }
    const fieldsWeWantToAnswers = {
      name: myInitiative.name,
      pic: myInitiative.pic,
      contact: presentationInfo?.howToSupport?.contact,
      about: presentationInfo?.about,
    };
    const unfinishedFields = Object.entries(fieldsWeWantToAnswers).reduce(
      (unansweredFields, [field, answer]) => {
        return answer && answer != ""
          ? unansweredFields
          : [...unansweredFields, field];
      },
      Array<string>()
    );
    return unfinishedFields;
  })();
  const allFieldsFinished = unfinishedFields && !unfinishedFields.length;
  const enoughSocialProof = socialProofs && socialProofs.length >= 3;
  return {
    entryGiven:
      myInitiative && socialProofs && actions
        ? oneActionDone && allFieldsFinished && enoughSocialProof
        : undefined,
    oneActionDone,
    allFieldsFinished,
    unfinishedFields,
    enoughSocialProof,
    numSocialProofsDoneForVIP: socialProofs
      ? socialProofs.length >= 3
        ? 3
        : socialProofs.length
      : 0,
  };
};
