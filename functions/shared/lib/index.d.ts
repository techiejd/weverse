import { z } from "zod";
export declare const timeStamp: z.ZodEffects<z.ZodAny, Date, any>;
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
export declare const initiativeType: z.ZodEnum<["individual", "organization"]>;
export type InitiativeType = z.infer<typeof initiativeType>;
export declare const organizationType: z.ZodEnum<["nonprofit", "religious", "unincorporated", "profit", "incubator"]>;
export type OrganizationType = z.infer<typeof organizationType>;
declare const howToSupport: z.ZodObject<{
    contact: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contact?: string;
}, {
    contact?: string;
}>;
export type HowToSupport = z.infer<typeof howToSupport>;
export declare const zeroRatings: {
    sum: number;
    count: number;
};
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
export type Ratings = z.infer<typeof ratings>;
export declare const locale: z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>;
export type Locale = z.infer<typeof locale>;
export declare const dbBase: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
}>;
export type DbBase = z.infer<typeof dbBase>;
declare const initiativePresentationExtension: z.ZodObject<{
    presentationVideo: z.ZodOptional<z.ZodString>;
    howToSupport: z.ZodOptional<z.ZodObject<{
        contact: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        contact?: string;
    }, {
        contact?: string;
    }>>;
    about: z.ZodOptional<z.ZodString>;
    validationProcess: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    presentationVideo?: string;
    howToSupport?: {
        contact?: string;
    };
    about?: string;
    validationProcess?: string;
}, {
    presentationVideo?: string;
    howToSupport?: {
        contact?: string;
    };
    about?: string;
    validationProcess?: string;
}>;
export type InitiativePresentationExtension = z.infer<typeof initiativePresentationExtension>;
export declare function createNestedLocalizedSchema<ItemType extends z.ZodTypeAny>(itemSchema: ItemType): z.ZodObject<{
    en: ItemType;
    es: ItemType;
    fr: ItemType;
    de: ItemType;
    pl: ItemType;
    pt: ItemType;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    en: ItemType;
    es: ItemType;
    fr: ItemType;
    de: ItemType;
    pl: ItemType;
    pt: ItemType;
}>, (undefined extends ItemType["_output"] ? never : "en") | (undefined extends ItemType["_output"] ? never : "es") | (undefined extends ItemType["_output"] ? never : "fr") | (undefined extends ItemType["_output"] ? never : "de") | (undefined extends ItemType["_output"] ? never : "pl") | (undefined extends ItemType["_output"] ? never : "pt")> extends infer T ? { [k_1 in keyof T]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    en: ItemType;
    es: ItemType;
    fr: ItemType;
    de: ItemType;
    pl: ItemType;
    pt: ItemType;
}>, (undefined extends ItemType["_output"] ? never : "en") | (undefined extends ItemType["_output"] ? never : "es") | (undefined extends ItemType["_output"] ? never : "fr") | (undefined extends ItemType["_output"] ? never : "de") | (undefined extends ItemType["_output"] ? never : "pl") | (undefined extends ItemType["_output"] ? never : "pt")>[k_1]; } : never, z.baseObjectInputType<{
    en: ItemType;
    es: ItemType;
    fr: ItemType;
    de: ItemType;
    pl: ItemType;
    pt: ItemType;
}> extends infer T_1 ? { [k_2 in keyof T_1]: z.baseObjectInputType<{
    en: ItemType;
    es: ItemType;
    fr: ItemType;
    de: ItemType;
    pl: ItemType;
    pt: ItemType;
}>[k_2]; } : never>;
declare const accountStatus: z.ZodEnum<["onboarding", "active"]>;
export type AccountStatus = z.infer<typeof accountStatus>;
export declare const initiative: z.ZodObject<{
    type: z.ZodEnum<["individual", "organization"]>;
    name: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    incubator: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        connectedAccount: z.ZodOptional<z.ZodEnum<["incubateeRequested", "pendingIncubateeApproval", "allAccepted"]>>;
    }, "strip", z.ZodTypeAny, {
        path?: string;
        connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
    }, {
        path?: string;
        connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
    }>>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    organizationType: z.ZodOptional<z.ZodEnum<["nonprofit", "religious", "unincorporated", "profit", "incubator"]>>;
    pic: z.ZodOptional<z.ZodString>;
    connectedAccount: z.ZodOptional<z.ZodObject<{
        ownerMemberPath: z.ZodString;
        stripeAccountId: z.ZodString;
        status: z.ZodEnum<["onboarding", "active"]>;
        title: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        ownerMemberPath?: string;
        stripeAccountId?: string;
        status?: "active" | "onboarding";
        title?: string;
    }, {
        ownerMemberPath?: string;
        stripeAccountId?: string;
        status?: "active" | "onboarding";
        title?: string;
    }>>;
    ratings: z.ZodObject<{
        sum: z.ZodNumber;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        sum?: number;
        count?: number;
    }, {
        sum?: number;
        count?: number;
    }>;
    en: z.ZodOptional<z.ZodObject<{
        presentationVideo: z.ZodOptional<z.ZodString>;
        howToSupport: z.ZodOptional<z.ZodObject<{
            contact: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            contact?: string;
        }, {
            contact?: string;
        }>>;
        about: z.ZodOptional<z.ZodString>;
        validationProcess: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }>>;
    es: z.ZodOptional<z.ZodObject<{
        presentationVideo: z.ZodOptional<z.ZodString>;
        howToSupport: z.ZodOptional<z.ZodObject<{
            contact: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            contact?: string;
        }, {
            contact?: string;
        }>>;
        about: z.ZodOptional<z.ZodString>;
        validationProcess: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }>>;
    fr: z.ZodOptional<z.ZodObject<{
        presentationVideo: z.ZodOptional<z.ZodString>;
        howToSupport: z.ZodOptional<z.ZodObject<{
            contact: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            contact?: string;
        }, {
            contact?: string;
        }>>;
        about: z.ZodOptional<z.ZodString>;
        validationProcess: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }>>;
    de: z.ZodOptional<z.ZodObject<{
        presentationVideo: z.ZodOptional<z.ZodString>;
        howToSupport: z.ZodOptional<z.ZodObject<{
            contact: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            contact?: string;
        }, {
            contact?: string;
        }>>;
        about: z.ZodOptional<z.ZodString>;
        validationProcess: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }>>;
    pl: z.ZodOptional<z.ZodObject<{
        presentationVideo: z.ZodOptional<z.ZodString>;
        howToSupport: z.ZodOptional<z.ZodObject<{
            contact: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            contact?: string;
        }, {
            contact?: string;
        }>>;
        about: z.ZodOptional<z.ZodString>;
        validationProcess: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }>>;
    pt: z.ZodOptional<z.ZodObject<{
        presentationVideo: z.ZodOptional<z.ZodString>;
        howToSupport: z.ZodOptional<z.ZodObject<{
            contact: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            contact?: string;
        }, {
            contact?: string;
        }>>;
        about: z.ZodOptional<z.ZodString>;
        validationProcess: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }, {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    type?: "individual" | "organization";
    name?: string;
    path?: string;
    email?: string;
    incubator?: {
        path?: string;
        connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
    };
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
    pic?: string;
    connectedAccount?: {
        ownerMemberPath?: string;
        stripeAccountId?: string;
        status?: "active" | "onboarding";
        title?: string;
    };
    ratings?: {
        sum?: number;
        count?: number;
    };
    en?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    es?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    fr?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    de?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    pl?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    pt?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
}, {
    type?: "individual" | "organization";
    name?: string;
    path?: string;
    email?: string;
    incubator?: {
        path?: string;
        connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
    };
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
    pic?: string;
    connectedAccount?: {
        ownerMemberPath?: string;
        stripeAccountId?: string;
        status?: "active" | "onboarding";
        title?: string;
    };
    ratings?: {
        sum?: number;
        count?: number;
    };
    en?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    es?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    fr?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    de?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    pl?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
    pt?: {
        presentationVideo?: string;
        howToSupport?: {
            contact?: string;
        };
        about?: string;
        validationProcess?: string;
    };
}>;
export type Initiative = z.infer<typeof initiative>;
declare const paymentPlanOptions: z.ZodEnum<["monthly", "oneTime"]>;
export type PaymentPlanOptions = z.infer<typeof paymentPlanOptions>;
declare const currency: z.ZodEnum<["cop", "usd", "eur", "gbp"]>;
export type Currency = z.infer<typeof currency>;
declare const accounts: z.ZodRecord<z.ZodString, z.ZodObject<{
    title: z.ZodString;
    initiatives: z.ZodArray<z.ZodString, "many">;
    status: z.ZodEnum<["onboarding", "active"]>;
}, "strip", z.ZodTypeAny, {
    title?: string;
    initiatives?: string[];
    status?: "active" | "onboarding";
}, {
    title?: string;
    initiatives?: string[];
    status?: "active" | "onboarding";
}>>;
export type Accounts = z.infer<typeof accounts>;
export declare const phoneNumber: z.ZodObject<{
    countryCallingCode: z.ZodString;
    nationalNumber: z.ZodString;
}, "strip", z.ZodTypeAny, {
    countryCallingCode?: string;
    nationalNumber?: string;
}, {
    countryCallingCode?: string;
    nationalNumber?: string;
}>;
export declare const member: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    customer: z.ZodOptional<z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        address: z.ZodObject<{
            postalCode: z.ZodString;
            country: z.ZodString;
            countryCode: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            postalCode?: string;
            country?: string;
            countryCode?: string;
        }, {
            postalCode?: string;
            country?: string;
            countryCode?: string;
        }>;
        currency: z.ZodEnum<["cop", "usd", "eur", "gbp"]>;
    }, "strip", z.ZodTypeAny, {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: {
            postalCode?: string;
            country?: string;
            countryCode?: string;
        };
        currency?: "cop" | "usd" | "eur" | "gbp";
    }, {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: {
            postalCode?: string;
            country?: string;
            countryCode?: string;
        };
        currency?: "cop" | "usd" | "eur" | "gbp";
    }>>;
    stripe: z.ZodOptional<z.ZodObject<{
        customer: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            status: z.ZodEnum<["incomplete", "confirmed"]>;
            paymentMethod: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            id?: string;
            status?: "incomplete" | "confirmed";
            paymentMethod?: string;
        }, {
            id?: string;
            status?: "incomplete" | "confirmed";
            paymentMethod?: string;
        }>>;
        accounts: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
            title: z.ZodString;
            initiatives: z.ZodArray<z.ZodString, "many">;
            status: z.ZodEnum<["onboarding", "active"]>;
        }, "strip", z.ZodTypeAny, {
            title?: string;
            initiatives?: string[];
            status?: "active" | "onboarding";
        }, {
            title?: string;
            initiatives?: string[];
            status?: "active" | "onboarding";
        }>>>;
    }, "strip", z.ZodTypeAny, {
        customer?: {
            id?: string;
            status?: "incomplete" | "confirmed";
            paymentMethod?: string;
        };
        accounts?: Record<string, {
            title?: string;
            initiatives?: string[];
            status?: "active" | "onboarding";
        }>;
    }, {
        customer?: {
            id?: string;
            status?: "incomplete" | "confirmed";
            paymentMethod?: string;
        };
        accounts?: Record<string, {
            title?: string;
            initiatives?: string[];
            status?: "active" | "onboarding";
        }>;
    }>>;
    pic: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    settings: z.ZodOptional<z.ZodObject<{
        locales: z.ZodArray<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>, "many">;
    }, "strip", z.ZodTypeAny, {
        locales?: ("en" | "es" | "fr" | "de" | "pl" | "pt")[];
    }, {
        locales?: ("en" | "es" | "fr" | "de" | "pl" | "pt")[];
    }>>;
    phoneNumber: z.ZodObject<{
        countryCallingCode: z.ZodString;
        nationalNumber: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        countryCallingCode?: string;
        nationalNumber?: string;
    }, {
        countryCallingCode?: string;
        nationalNumber?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    customer?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: {
            postalCode?: string;
            country?: string;
            countryCode?: string;
        };
        currency?: "cop" | "usd" | "eur" | "gbp";
    };
    stripe?: {
        customer?: {
            id?: string;
            status?: "incomplete" | "confirmed";
            paymentMethod?: string;
        };
        accounts?: Record<string, {
            title?: string;
            initiatives?: string[];
            status?: "active" | "onboarding";
        }>;
    };
    pic?: string;
    name?: string;
    settings?: {
        locales?: ("en" | "es" | "fr" | "de" | "pl" | "pt")[];
    };
    phoneNumber?: {
        countryCallingCode?: string;
        nationalNumber?: string;
    };
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    customer?: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        address?: {
            postalCode?: string;
            country?: string;
            countryCode?: string;
        };
        currency?: "cop" | "usd" | "eur" | "gbp";
    };
    stripe?: {
        customer?: {
            id?: string;
            status?: "incomplete" | "confirmed";
            paymentMethod?: string;
        };
        accounts?: Record<string, {
            title?: string;
            initiatives?: string[];
            status?: "active" | "onboarding";
        }>;
    };
    pic?: string;
    name?: string;
    settings?: {
        locales?: ("en" | "es" | "fr" | "de" | "pl" | "pt")[];
    };
    phoneNumber?: {
        countryCallingCode?: string;
        nationalNumber?: string;
    };
}>;
export type Member = z.infer<typeof member>;
export declare const like: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
}>;
export type Like = z.infer<typeof like>;
export declare const socialProof: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    rating: z.ZodNumber;
    videoUrl: z.ZodOptional<z.ZodString>;
    byMember: z.ZodString;
    forInitiative: z.ZodString;
    forAction: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    rating?: number;
    videoUrl?: string;
    byMember?: string;
    forInitiative?: string;
    forAction?: string;
    text?: string;
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    rating?: number;
    videoUrl?: string;
    byMember?: string;
    forInitiative?: string;
    forAction?: string;
    text?: string;
}>;
export type SocialProof = z.infer<typeof socialProof>;
declare const validation: z.ZodObject<{
    validator: z.ZodString;
    validated: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    validator?: string;
    validated?: boolean;
}, {
    validator?: string;
    validated?: boolean;
}>;
export type Validation = z.infer<typeof validation>;
export declare const actionPresentationExtension: z.ZodObject<{
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
    summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    media?: {
        type?: "img" | "video";
        url?: string;
    };
    summary?: string;
}, {
    media?: {
        type?: "img" | "video";
        url?: string;
    };
    summary?: string;
}>;
export declare const posiFormData: z.ZodObject<{
    location: z.ZodOptional<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        structuredFormatting: z.ZodOptional<z.ZodObject<{
            mainText: z.ZodOptional<z.ZodString>;
            secondaryText: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            mainText?: string;
            secondaryText?: string;
        }, {
            mainText?: string;
            secondaryText?: string;
        }>>;
        terms: z.ZodOptional<z.ZodArray<z.ZodObject<{
            offset: z.ZodOptional<z.ZodNumber>;
            value: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            offset?: number;
            value?: string;
        }, {
            offset?: number;
            value?: string;
        }>, "many">>;
        types: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
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
    path: z.ZodOptional<z.ZodString>;
    validation: z.ZodOptional<z.ZodObject<{
        validator: z.ZodString;
        validated: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        validator?: string;
        validated?: boolean;
    }, {
        validator?: string;
        validated?: boolean;
    }>>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    ratings: z.ZodObject<{
        sum: z.ZodNumber;
        count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        sum?: number;
        count?: number;
    }, {
        sum?: number;
        count?: number;
    }>;
    en: z.ZodOptional<z.ZodObject<{
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
        summary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }>>;
    es: z.ZodOptional<z.ZodObject<{
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
        summary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }>>;
    fr: z.ZodOptional<z.ZodObject<{
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
        summary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }>>;
    de: z.ZodOptional<z.ZodObject<{
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
        summary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }>>;
    pl: z.ZodOptional<z.ZodObject<{
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
        summary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }>>;
    pt: z.ZodOptional<z.ZodObject<{
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
        summary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }, {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    }>>;
}, "strip", z.ZodTypeAny, {
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
    path?: string;
    validation?: {
        validator?: string;
        validated?: boolean;
    };
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    ratings?: {
        sum?: number;
        count?: number;
    };
    en?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    es?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    fr?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    de?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    pl?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    pt?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
}, {
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
    path?: string;
    validation?: {
        validator?: string;
        validated?: boolean;
    };
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    ratings?: {
        sum?: number;
        count?: number;
    };
    en?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    es?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    fr?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    de?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    pl?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
    pt?: {
        media?: {
            type?: "img" | "video";
            url?: string;
        };
        summary?: string;
    };
}>;
export type PosiFormData = z.infer<typeof posiFormData>;
export declare const content: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    type: z.ZodLiteral<"action">;
    data: z.ZodEffects<z.ZodObject<{
        location: z.ZodOptional<z.ZodObject<{
            id: z.ZodOptional<z.ZodString>;
            structuredFormatting: z.ZodOptional<z.ZodObject<{
                mainText: z.ZodOptional<z.ZodString>;
                secondaryText: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                mainText?: string;
                secondaryText?: string;
            }, {
                mainText?: string;
                secondaryText?: string;
            }>>;
            terms: z.ZodOptional<z.ZodArray<z.ZodObject<{
                offset: z.ZodOptional<z.ZodNumber>;
                value: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                offset?: number;
                value?: string;
            }, {
                offset?: number;
                value?: string;
            }>, "many">>;
            types: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
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
        path: z.ZodOptional<z.ZodString>;
        validation: z.ZodOptional<z.ZodObject<{
            validator: z.ZodString;
            validated: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            validator?: string;
            validated?: boolean;
        }, {
            validator?: string;
            validated?: boolean;
        }>>;
        locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
        createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
        ratings: z.ZodObject<{
            sum: z.ZodNumber;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            sum?: number;
            count?: number;
        }, {
            sum?: number;
            count?: number;
        }>;
        en: z.ZodOptional<z.ZodObject<{
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
            summary: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }>>;
        es: z.ZodOptional<z.ZodObject<{
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
            summary: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }>>;
        fr: z.ZodOptional<z.ZodObject<{
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
            summary: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }>>;
        de: z.ZodOptional<z.ZodObject<{
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
            summary: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }>>;
        pl: z.ZodOptional<z.ZodObject<{
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
            summary: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }>>;
        pt: z.ZodOptional<z.ZodObject<{
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
            summary: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }, {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
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
        path?: string;
        validation?: {
            validator?: string;
            validated?: boolean;
        };
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        ratings?: {
            sum?: number;
            count?: number;
        };
        en?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        es?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        fr?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        de?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        pl?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        pt?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
    }, {
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
        path?: string;
        validation?: {
            validator?: string;
            validated?: boolean;
        };
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: any;
        ratings?: {
            sum?: number;
            count?: number;
        };
        en?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        es?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        fr?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        de?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        pl?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        pt?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
    }>, {
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
        path?: string;
        validation?: {
            validator?: string;
            validated?: boolean;
        };
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        ratings?: {
            sum?: number;
            count?: number;
        };
        en?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        es?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        fr?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        de?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        pl?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        pt?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
    }, unknown>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    type?: "action";
    data?: {
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
        path?: string;
        validation?: {
            validator?: string;
            validated?: boolean;
        };
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        ratings?: {
            sum?: number;
            count?: number;
        };
        en?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        es?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        fr?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        de?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        pl?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
        pt?: {
            media?: {
                type?: "img" | "video";
                url?: string;
            };
            summary?: string;
        };
    };
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    type?: "action";
    data?: unknown;
}>, z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    type: z.ZodLiteral<"testimonial">;
    data: z.ZodEffects<z.ZodObject<{
        path: z.ZodOptional<z.ZodString>;
        locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
        createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
        rating: z.ZodNumber;
        videoUrl: z.ZodOptional<z.ZodString>;
        byMember: z.ZodString;
        forInitiative: z.ZodString;
        forAction: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        rating?: number;
        videoUrl?: string;
        byMember?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    }, {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: any;
        rating?: number;
        videoUrl?: string;
        byMember?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    }>, {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        rating?: number;
        videoUrl?: string;
        byMember?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    }, unknown>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    type?: "testimonial";
    data?: {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        rating?: number;
        videoUrl?: string;
        byMember?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    };
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    type?: "testimonial";
    data?: unknown;
}>]>;
export type Content = z.infer<typeof content>;
export declare const sponsorshipLevel: z.ZodEnum<["admirer", "fan", "lover", "custom"]>;
export type SponsorshipLevel = z.infer<typeof sponsorshipLevel>;
declare const paymentPlanMonthlyStatus: z.ZodEnum<["active", "incomplete", "canceled", "incomplete_expired"]>;
export type PaymentPlanMonthlyStatus = z.infer<typeof paymentPlanMonthlyStatus>;
export declare const sponsorship: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    version: z.ZodEnum<["0.0.1", "0.0.2"]>;
    paymentPlan: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"monthly">;
        id: z.ZodOptional<z.ZodString>;
        billingCycleAnchor: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
        status: z.ZodEnum<["active", "incomplete", "canceled", "incomplete_expired"]>;
        item: z.ZodString;
        price: z.ZodString;
        applicationFeePercent: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type?: "monthly";
        id?: string;
        billingCycleAnchor?: Date;
        status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
        item?: string;
        price?: string;
        applicationFeePercent?: number;
    }, {
        type?: "monthly";
        id?: string;
        billingCycleAnchor?: any;
        status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
        item?: string;
        price?: string;
        applicationFeePercent?: number;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"oneTime">;
        status: z.ZodEnum<["active", "incomplete"]>;
        applicationFeeAmount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type?: "oneTime";
        status?: "active" | "incomplete";
        applicationFeeAmount?: number;
    }, {
        type?: "oneTime";
        status?: "active" | "incomplete";
        applicationFeeAmount?: number;
    }>]>;
    paymentsStarted: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    total: z.ZodNumber;
    sponsorshipLevel: z.ZodEnum<["admirer", "fan", "lover", "custom"]>;
    customAmount: z.ZodOptional<z.ZodNumber>;
    tipPercentage: z.ZodNumber;
    denyStripeFee: z.ZodOptional<z.ZodBoolean>;
    initiative: z.ZodString;
    member: z.ZodString;
    memberPublishable: z.ZodOptional<z.ZodBoolean>;
    currency: z.ZodEnum<["cop", "usd", "eur", "gbp"]>;
    canceledAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    oneWeAmount: z.ZodNumber;
    initiativeAmount: z.ZodNumber;
    stripeFeeAmount: z.ZodNumber;
    destinationAccount: z.ZodUnion<[z.ZodString, z.ZodEnum<["legacy"]>]>;
    status: z.ZodOptional<z.ZodEnum<["active", "incomplete", "canceled", "incomplete_expired"]>>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    version?: "0.0.1" | "0.0.2";
    paymentPlan?: {
        type?: "monthly";
        id?: string;
        billingCycleAnchor?: Date;
        status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
        item?: string;
        price?: string;
        applicationFeePercent?: number;
    } | {
        type?: "oneTime";
        status?: "active" | "incomplete";
        applicationFeeAmount?: number;
    };
    paymentsStarted?: Date;
    total?: number;
    sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
    customAmount?: number;
    tipPercentage?: number;
    denyStripeFee?: boolean;
    initiative?: string;
    member?: string;
    memberPublishable?: boolean;
    currency?: "cop" | "usd" | "eur" | "gbp";
    canceledAt?: Date;
    oneWeAmount?: number;
    initiativeAmount?: number;
    stripeFeeAmount?: number;
    destinationAccount?: string;
    status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    version?: "0.0.1" | "0.0.2";
    paymentPlan?: {
        type?: "monthly";
        id?: string;
        billingCycleAnchor?: any;
        status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
        item?: string;
        price?: string;
        applicationFeePercent?: number;
    } | {
        type?: "oneTime";
        status?: "active" | "incomplete";
        applicationFeeAmount?: number;
    };
    paymentsStarted?: any;
    total?: number;
    sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
    customAmount?: number;
    tipPercentage?: number;
    denyStripeFee?: boolean;
    initiative?: string;
    member?: string;
    memberPublishable?: boolean;
    currency?: "cop" | "usd" | "eur" | "gbp";
    canceledAt?: any;
    oneWeAmount?: number;
    initiativeAmount?: number;
    stripeFeeAmount?: number;
    destinationAccount?: string;
    status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
}>;
export type Sponsorship = z.infer<typeof sponsorship>;
export declare const incubatee: z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    initiativePath: z.ZodOptional<z.ZodString>;
    initializeWith: z.ZodOptional<z.ZodObject<Pick<{
        type: z.ZodEnum<["individual", "organization"]>;
        name: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        incubator: z.ZodOptional<z.ZodObject<{
            path: z.ZodString;
            connectedAccount: z.ZodOptional<z.ZodEnum<["incubateeRequested", "pendingIncubateeApproval", "allAccepted"]>>;
        }, "strip", z.ZodTypeAny, {
            path?: string;
            connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
        }, {
            path?: string;
            connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
        }>>;
        locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
        createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
        organizationType: z.ZodOptional<z.ZodEnum<["nonprofit", "religious", "unincorporated", "profit", "incubator"]>>;
        pic: z.ZodOptional<z.ZodString>;
        connectedAccount: z.ZodOptional<z.ZodObject<{
            ownerMemberPath: z.ZodString;
            stripeAccountId: z.ZodString;
            status: z.ZodEnum<["onboarding", "active"]>;
            title: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            ownerMemberPath?: string;
            stripeAccountId?: string;
            status?: "active" | "onboarding";
            title?: string;
        }, {
            ownerMemberPath?: string;
            stripeAccountId?: string;
            status?: "active" | "onboarding";
            title?: string;
        }>>;
        ratings: z.ZodObject<{
            sum: z.ZodNumber;
            count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            sum?: number;
            count?: number;
        }, {
            sum?: number;
            count?: number;
        }>;
        en: z.ZodOptional<z.ZodObject<{
            presentationVideo: z.ZodOptional<z.ZodString>;
            howToSupport: z.ZodOptional<z.ZodObject<{
                contact: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                contact?: string;
            }, {
                contact?: string;
            }>>;
            about: z.ZodOptional<z.ZodString>;
            validationProcess: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }>>;
        es: z.ZodOptional<z.ZodObject<{
            presentationVideo: z.ZodOptional<z.ZodString>;
            howToSupport: z.ZodOptional<z.ZodObject<{
                contact: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                contact?: string;
            }, {
                contact?: string;
            }>>;
            about: z.ZodOptional<z.ZodString>;
            validationProcess: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }>>;
        fr: z.ZodOptional<z.ZodObject<{
            presentationVideo: z.ZodOptional<z.ZodString>;
            howToSupport: z.ZodOptional<z.ZodObject<{
                contact: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                contact?: string;
            }, {
                contact?: string;
            }>>;
            about: z.ZodOptional<z.ZodString>;
            validationProcess: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }>>;
        de: z.ZodOptional<z.ZodObject<{
            presentationVideo: z.ZodOptional<z.ZodString>;
            howToSupport: z.ZodOptional<z.ZodObject<{
                contact: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                contact?: string;
            }, {
                contact?: string;
            }>>;
            about: z.ZodOptional<z.ZodString>;
            validationProcess: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }>>;
        pl: z.ZodOptional<z.ZodObject<{
            presentationVideo: z.ZodOptional<z.ZodString>;
            howToSupport: z.ZodOptional<z.ZodObject<{
                contact: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                contact?: string;
            }, {
                contact?: string;
            }>>;
            about: z.ZodOptional<z.ZodString>;
            validationProcess: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }>>;
        pt: z.ZodOptional<z.ZodObject<{
            presentationVideo: z.ZodOptional<z.ZodString>;
            howToSupport: z.ZodOptional<z.ZodObject<{
                contact: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                contact?: string;
            }, {
                contact?: string;
            }>>;
            about: z.ZodOptional<z.ZodString>;
            validationProcess: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }, {
            presentationVideo?: string;
            howToSupport?: {
                contact?: string;
            };
            about?: string;
            validationProcess?: string;
        }>>;
    }, "type" | "name" | "incubator" | "organizationType" | "ratings">, "strip", z.ZodTypeAny, {
        type?: "individual" | "organization";
        name?: string;
        incubator?: {
            path?: string;
            connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
        };
        organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
        ratings?: {
            sum?: number;
            count?: number;
        };
    }, {
        type?: "individual" | "organization";
        name?: string;
        incubator?: {
            path?: string;
            connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
        };
        organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
        ratings?: {
            sum?: number;
            count?: number;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    initiativePath?: string;
    initializeWith?: {
        type?: "individual" | "organization";
        name?: string;
        incubator?: {
            path?: string;
            connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
        };
        organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
        ratings?: {
            sum?: number;
            count?: number;
        };
    };
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    initiativePath?: string;
    initializeWith?: {
        type?: "individual" | "organization";
        name?: string;
        incubator?: {
            path?: string;
            connectedAccount?: "incubateeRequested" | "pendingIncubateeApproval" | "allAccepted";
        };
        organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
        ratings?: {
            sum?: number;
            count?: number;
        };
    };
}>;
export type Incubatee = z.infer<typeof incubatee>;
export declare const fromTypes: z.ZodEnum<["testimonial", "sponsorship", "like"]>;
export type FromType = z.infer<typeof fromTypes>;
export declare const from: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    type: z.ZodLiteral<"testimonial">;
    data: z.ZodObject<{
        path: z.ZodOptional<z.ZodString>;
        locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
        createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
        rating: z.ZodNumber;
        videoUrl: z.ZodOptional<z.ZodString>;
        byMember: z.ZodString;
        forInitiative: z.ZodString;
        forAction: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        rating?: number;
        videoUrl?: string;
        byMember?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    }, {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: any;
        rating?: number;
        videoUrl?: string;
        byMember?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    }>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    type?: "testimonial";
    data?: {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        rating?: number;
        videoUrl?: string;
        byMember?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    };
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    type?: "testimonial";
    data?: {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: any;
        rating?: number;
        videoUrl?: string;
        byMember?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    };
}>, z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    type: z.ZodLiteral<"sponsorship">;
    data: z.ZodObject<{
        path: z.ZodOptional<z.ZodString>;
        locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
        createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
        version: z.ZodEnum<["0.0.1", "0.0.2"]>;
        paymentPlan: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
            type: z.ZodLiteral<"monthly">;
            id: z.ZodOptional<z.ZodString>;
            billingCycleAnchor: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
            status: z.ZodEnum<["active", "incomplete", "canceled", "incomplete_expired"]>;
            item: z.ZodString;
            price: z.ZodString;
            applicationFeePercent: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type?: "monthly";
            id?: string;
            billingCycleAnchor?: Date;
            status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
            item?: string;
            price?: string;
            applicationFeePercent?: number;
        }, {
            type?: "monthly";
            id?: string;
            billingCycleAnchor?: any;
            status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
            item?: string;
            price?: string;
            applicationFeePercent?: number;
        }>, z.ZodObject<{
            type: z.ZodLiteral<"oneTime">;
            status: z.ZodEnum<["active", "incomplete"]>;
            applicationFeeAmount: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type?: "oneTime";
            status?: "active" | "incomplete";
            applicationFeeAmount?: number;
        }, {
            type?: "oneTime";
            status?: "active" | "incomplete";
            applicationFeeAmount?: number;
        }>]>;
        paymentsStarted: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
        total: z.ZodNumber;
        sponsorshipLevel: z.ZodEnum<["admirer", "fan", "lover", "custom"]>;
        customAmount: z.ZodOptional<z.ZodNumber>;
        tipPercentage: z.ZodNumber;
        denyStripeFee: z.ZodOptional<z.ZodBoolean>;
        initiative: z.ZodString;
        member: z.ZodString;
        memberPublishable: z.ZodOptional<z.ZodBoolean>;
        currency: z.ZodEnum<["cop", "usd", "eur", "gbp"]>;
        canceledAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
        oneWeAmount: z.ZodNumber;
        initiativeAmount: z.ZodNumber;
        stripeFeeAmount: z.ZodNumber;
        destinationAccount: z.ZodUnion<[z.ZodString, z.ZodEnum<["legacy"]>]>;
        status: z.ZodOptional<z.ZodEnum<["active", "incomplete", "canceled", "incomplete_expired"]>>;
    }, "strip", z.ZodTypeAny, {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        version?: "0.0.1" | "0.0.2";
        paymentPlan?: {
            type?: "monthly";
            id?: string;
            billingCycleAnchor?: Date;
            status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
            item?: string;
            price?: string;
            applicationFeePercent?: number;
        } | {
            type?: "oneTime";
            status?: "active" | "incomplete";
            applicationFeeAmount?: number;
        };
        paymentsStarted?: Date;
        total?: number;
        sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
        customAmount?: number;
        tipPercentage?: number;
        denyStripeFee?: boolean;
        initiative?: string;
        member?: string;
        memberPublishable?: boolean;
        currency?: "cop" | "usd" | "eur" | "gbp";
        canceledAt?: Date;
        oneWeAmount?: number;
        initiativeAmount?: number;
        stripeFeeAmount?: number;
        destinationAccount?: string;
        status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
    }, {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: any;
        version?: "0.0.1" | "0.0.2";
        paymentPlan?: {
            type?: "monthly";
            id?: string;
            billingCycleAnchor?: any;
            status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
            item?: string;
            price?: string;
            applicationFeePercent?: number;
        } | {
            type?: "oneTime";
            status?: "active" | "incomplete";
            applicationFeeAmount?: number;
        };
        paymentsStarted?: any;
        total?: number;
        sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
        customAmount?: number;
        tipPercentage?: number;
        denyStripeFee?: boolean;
        initiative?: string;
        member?: string;
        memberPublishable?: boolean;
        currency?: "cop" | "usd" | "eur" | "gbp";
        canceledAt?: any;
        oneWeAmount?: number;
        initiativeAmount?: number;
        stripeFeeAmount?: number;
        destinationAccount?: string;
        status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
    }>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    type?: "sponsorship";
    data?: {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
        version?: "0.0.1" | "0.0.2";
        paymentPlan?: {
            type?: "monthly";
            id?: string;
            billingCycleAnchor?: Date;
            status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
            item?: string;
            price?: string;
            applicationFeePercent?: number;
        } | {
            type?: "oneTime";
            status?: "active" | "incomplete";
            applicationFeeAmount?: number;
        };
        paymentsStarted?: Date;
        total?: number;
        sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
        customAmount?: number;
        tipPercentage?: number;
        denyStripeFee?: boolean;
        initiative?: string;
        member?: string;
        memberPublishable?: boolean;
        currency?: "cop" | "usd" | "eur" | "gbp";
        canceledAt?: Date;
        oneWeAmount?: number;
        initiativeAmount?: number;
        stripeFeeAmount?: number;
        destinationAccount?: string;
        status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
    };
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    type?: "sponsorship";
    data?: {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: any;
        version?: "0.0.1" | "0.0.2";
        paymentPlan?: {
            type?: "monthly";
            id?: string;
            billingCycleAnchor?: any;
            status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
            item?: string;
            price?: string;
            applicationFeePercent?: number;
        } | {
            type?: "oneTime";
            status?: "active" | "incomplete";
            applicationFeeAmount?: number;
        };
        paymentsStarted?: any;
        total?: number;
        sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
        customAmount?: number;
        tipPercentage?: number;
        denyStripeFee?: boolean;
        initiative?: string;
        member?: string;
        memberPublishable?: boolean;
        currency?: "cop" | "usd" | "eur" | "gbp";
        canceledAt?: any;
        oneWeAmount?: number;
        initiativeAmount?: number;
        stripeFeeAmount?: number;
        destinationAccount?: string;
        status?: "active" | "canceled" | "incomplete" | "incomplete_expired";
    };
}>, z.ZodObject<{
    path: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
    createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    type: z.ZodLiteral<"like">;
    data: z.ZodObject<{
        path: z.ZodOptional<z.ZodString>;
        locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr", "de", "pl", "pt"]>>;
        createdAt: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    }, "strip", z.ZodTypeAny, {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
    }, {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: any;
    }>;
}, "strip", z.ZodTypeAny, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: Date;
    type?: "like";
    data?: {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: Date;
    };
}, {
    path?: string;
    locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
    createdAt?: any;
    type?: "like";
    data?: {
        path?: string;
        locale?: "en" | "es" | "fr" | "de" | "pl" | "pt";
        createdAt?: any;
    };
}>]>;
export type From = z.infer<typeof from>;
export {};
