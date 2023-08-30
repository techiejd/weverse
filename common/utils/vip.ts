import { Maker, PosiFormData, SocialProof } from "../../functions/shared/src";

export const calculateVipState = (
  myMaker: Maker | undefined,
  socialProofs: SocialProof[] | undefined,
  actions: PosiFormData[] | undefined
) => {
  const oneActionDone = actions ? actions.length > 0 : false;
  const presentationInfo = myMaker ? myMaker[myMaker?.locale!] : undefined;
  const unfinishedFields = (() => {
    if (!myMaker) {
      return undefined;
    }
    const fieldsWeWantToAnswers = {
      name: myMaker.name,
      pic: myMaker.pic,
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
      myMaker && socialProofs && actions
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
