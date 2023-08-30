import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { z } from "zod";
import {
  actionPresentationExtension,
  createNestedLocalizedSchema,
  media,
  posiFormData,
} from "../../../functions/shared/src";

const workingCopyPosiFormData = posiFormData
  .merge(
    createNestedLocalizedSchema(
      actionPresentationExtension
        .extend({ media: z.union([media, z.enum(["loading"])]) })
        .optional()
    )
  )
  .deepPartial();
export type WorkingCopyPosiFormData = z.infer<typeof workingCopyPosiFormData>;

export const PosiFormContext = createContext<WorkingCopyPosiFormData>({});
export const PosiFormDispatchContext = createContext<
  Dispatch<SetStateAction<WorkingCopyPosiFormData>> | undefined
>(undefined);

export const useFormData = (): [
  WorkingCopyPosiFormData,
  Dispatch<SetStateAction<WorkingCopyPosiFormData>> | undefined
] => {
  return [useContext(PosiFormContext), useContext(PosiFormDispatchContext)];
};

// TODO(techiejd): Look into making this string instead of | undefined.
export const getPosiPage = (id: string | undefined) => `/posi/${id}`;

export const getSharePropsForPosi = (posiData: {
  summary: string;
  id?: string;
}) => ({
  title: posiData.summary,
  text: posiData.summary,
  path: getPosiPage(posiData.id),
});
