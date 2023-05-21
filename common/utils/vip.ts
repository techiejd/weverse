import { Maker, PosiFormData, SocialProof } from "../../functions/shared/src";

export const calculateVipState = (
  myMaker: Maker | undefined,
  socialProofs: SocialProof[] | undefined,
  actions: PosiFormData[] | undefined
) => {
  const oneActionDone = actions ? actions.length > 0 : false;
  const unfinishedFields = (() => {
    if (!myMaker) {
      return undefined;
    }
    const fieldsWeWantToAnswers = {
      name: myMaker.name,
      pic: myMaker.pic,
      financial: myMaker.howToSupport?.finance,
      contact: myMaker.howToSupport?.contact,
      about: myMaker.about,
    };
    const unfinishedFields = Object.entries(fieldsWeWantToAnswers).reduce(
      (unansweredFields, [field, answer]) => {
        console.log({field, answer, next: answer && answer != "" ? unansweredFields : [...unansweredFields, field]});
        return answer && answer != "" ? unansweredFields : [...unansweredFields, field];
      },
      Array<string>()
    );
    return unfinishedFields;
  })();
  const allFieldsFinished = unfinishedFields && !unfinishedFields.length;
  const enoughSocialProof = socialProofs && socialProofs.length >= 3;
  console.log( {
    entryGiven:
      oneActionDone && allFieldsFinished && enoughSocialProof,
    oneActionDone,
    allFieldsFinished,
    unfinishedFields,
    enoughSocialProof,
    numSocialProofsDoneForVIP: socialProofs
      ? socialProofs.length >= 3
        ? 3
        : socialProofs.length
      : 0,
});
  return {
    entryGiven:
      oneActionDone && allFieldsFinished && enoughSocialProof,
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
