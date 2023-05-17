import { z } from "zod";
export declare const formUrl: z.ZodString;
export declare const mediaType: z.ZodEnum<["video", "img"]>;
export type MediaType = z.infer<typeof mediaType>;
export declare const media: z.ZodObject<{
    type: z.ZodEnum<["video", "img"]>;
    url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type?: "img" | "video";
    url?: string;
}, {
    type?: "img" | "video";
    url?: string;
}>;
export type Media = z.infer<typeof media>;
export declare const organizationType: z.ZodEnum<["nonprofit", "religious", "governmental", "unincorporated", "profit"]>;
export type OrganizationType = z.infer<typeof organizationType>;
export declare const organizationLabels: {
    nonprofit: string;
    religious: string;
    governmental: string;
    unincorporated: string;
    profit: string;
};
declare const howToSupport: z.ZodObject<{
    contact: z.ZodOptional<z.ZodString>;
    finance: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contact?: string;
    finance?: string;
}, {
    contact?: string;
    finance?: string;
}>;
export type HowToSupport = z.infer<typeof howToSupport>;
export declare const ratings: z.ZodObject<{
    sum: z.ZodNumber;
    count: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    sum?: number;
    count?: number;
}, {
    sum?: number;
    count?: number;
}>;
export declare const maker: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    ownerId: z.ZodString;
    type: z.ZodEnum<["individual", "organization"]>;
    pic: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    organizationType: z.ZodOptional<z.ZodEnum<["nonprofit", "religious", "governmental", "unincorporated", "profit"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    howToSupport: z.ZodOptional<z.ZodObject<{
        contact: z.ZodOptional<z.ZodString>;
        finance: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        contact?: string;
        finance?: string;
    }, {
        contact?: string;
        finance?: string;
    }>>;
    about: z.ZodOptional<z.ZodString>;
    ratings: z.ZodOptional<z.ZodObject<{
        sum: z.ZodNumber;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        sum?: number;
        count?: number;
    }, {
        sum?: number;
        count?: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    ownerId?: string;
    type?: "individual" | "organization";
    pic?: string;
    name?: string;
    organizationType?: "nonprofit" | "religious" | "governmental" | "unincorporated" | "profit";
    createdAt?: Date;
    howToSupport?: {
        contact?: string;
        finance?: string;
    };
    about?: string;
    ratings?: {
        sum?: number;
        count?: number;
    };
}, {
    id?: string;
    ownerId?: string;
    type?: "individual" | "organization";
    pic?: string;
    name?: string;
    organizationType?: "nonprofit" | "religious" | "governmental" | "unincorporated" | "profit";
    createdAt?: Date;
    howToSupport?: {
        contact?: string;
        finance?: string;
    };
    about?: string;
    ratings?: {
        sum?: number;
        count?: number;
    };
}>;
export type Maker = z.infer<typeof maker>;
export declare const member: z.ZodObject<{
    makerId: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    makerId?: string;
    id?: string;
    createdAt?: Date;
}, {
    makerId?: string;
    id?: string;
    createdAt?: Date;
}>;
export type Member = z.infer<typeof member>;
export declare const socialProof: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    rating: z.ZodNumber;
    videoUrl: z.ZodOptional<z.ZodString>;
    byMaker: z.ZodString;
    forMaker: z.ZodString;
    forAction: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    rating?: number;
    videoUrl?: string;
    byMaker?: string;
    forMaker?: string;
    forAction?: string;
    createdAt?: Date;
}, {
    id?: string;
    rating?: number;
    videoUrl?: string;
    byMaker?: string;
    forMaker?: string;
    forAction?: string;
    createdAt?: Date;
}>;
export type SocialProof = z.infer<typeof socialProof>;
export declare const posiFormData: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    summary: z.ZodString;
    howToIdentifyImpactedPeople: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodObject<{
        /**
         * A place ID that can be used to retrieve details about this place using
         * the place details service (see {@link
         * google.maps.places.PlacesService.getDetails}).
         */
        id: z.ZodString;
        /**
         * Structured information about the place's description, divided into a
         * main text and a secondary text. We remove lots of google info.
         * (see {@link google.maps.places.StructuredFormatting}).
         */
        structuredFormatting: z.ZodObject<{
            mainText: z.ZodString;
            secondaryText: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            mainText?: string;
            secondaryText?: string;
        }, {
            mainText?: string;
            secondaryText?: string;
        }>;
        /**
         * Information about individual terms in the above description, from most to
         * least specific. For example, "Taco Bell", "TOWN",
         * and "STATE".
         */
        terms: z.ZodArray<z.ZodObject<{
            /**
             * The offset, in unicode characters, of the start of this term in the
             * description of the place. AKA first term's offset = 0.
             */
            offset: z.ZodNumber;
            /**
             * The value of this term, for example,"Taco Bell".
             */
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            offset?: number;
            value?: string;
        }, {
            offset?: number;
            value?: string;
        }>, "many">;
        /**
         * An array of types that the prediction belongs to, for example
         * <code>'establishment'</code> or <code>'geocode'</code>.
         */
        types: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        id?: string;
        structuredFormatting?: {
            mainText?: string;
            secondaryText?: string;
        };
        terms?: {
            offset?: number;
            value?: string;
        }[];
        types?: string[];
    }, {
        id?: string;
        structuredFormatting?: {
            mainText?: string;
            secondaryText?: string;
        };
        terms?: {
            offset?: number;
            value?: string;
        }[];
        types?: string[];
    }>>;
    media: z.ZodObject<{
        type: z.ZodEnum<["video", "img"]>;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type?: "img" | "video";
        url?: string;
    }, {
        type?: "img" | "video";
        url?: string;
    }>;
    makerId: z.ZodString;
    createdAt: z.ZodOptional<z.ZodDate>;
    ratings: z.ZodOptional<z.ZodObject<{
        sum: z.ZodNumber;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        sum?: number;
        count?: number;
    }, {
        sum?: number;
        count?: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    summary?: string;
    howToIdentifyImpactedPeople?: string;
    location?: {
        id?: string;
        structuredFormatting?: {
            mainText?: string;
            secondaryText?: string;
        };
        terms?: {
            offset?: number;
            value?: string;
        }[];
        types?: string[];
    };
    media?: {
        type?: "img" | "video";
        url?: string;
    };
    makerId?: string;
    createdAt?: Date;
    ratings?: {
        sum?: number;
        count?: number;
    };
}, {
    id?: string;
    summary?: string;
    howToIdentifyImpactedPeople?: string;
    location?: {
        id?: string;
        structuredFormatting?: {
            mainText?: string;
            secondaryText?: string;
        };
        terms?: {
            offset?: number;
            value?: string;
        }[];
        types?: string[];
    };
    media?: {
        type?: "img" | "video";
        url?: string;
    };
    makerId?: string;
    createdAt?: Date;
    ratings?: {
        sum?: number;
        count?: number;
    };
}>;
export type PosiFormData = z.infer<typeof posiFormData>;
export {};
