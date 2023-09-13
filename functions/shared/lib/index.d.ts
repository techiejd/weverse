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
export declare const locale: z.ZodEnum<["en", "es", "fr"]>;
export type Locale = z.infer<typeof locale>;
declare const dbBase: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
}, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
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
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    en: ItemType;
    es: ItemType;
    fr: ItemType;
}>, (undefined extends ItemType["_output"] ? never : "en") | (undefined extends ItemType["_output"] ? never : "es") | (undefined extends ItemType["_output"] ? never : "fr")> extends infer T ? { [k_1 in keyof T]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    en: ItemType;
    es: ItemType;
    fr: ItemType;
}>, (undefined extends ItemType["_output"] ? never : "en") | (undefined extends ItemType["_output"] ? never : "es") | (undefined extends ItemType["_output"] ? never : "fr")>[k_1]; } : never, z.baseObjectInputType<{
    en: ItemType;
    es: ItemType;
    fr: ItemType;
}> extends infer T_1 ? { [k_2 in keyof T_1]: z.baseObjectInputType<{
    en: ItemType;
    es: ItemType;
    fr: ItemType;
}>[k_2]; } : never>;
export declare const initiative: z.ZodObject<{
    type: z.ZodEnum<["individual", "organization"]>;
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    incubator: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    ownerId: z.ZodUnion<[z.ZodString, z.ZodEnum<["invited"]>]>;
    organizationType: z.ZodOptional<z.ZodEnum<["nonprofit", "religious", "unincorporated", "profit", "incubator"]>>;
    pic: z.ZodOptional<z.ZodString>;
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
}, "strip", z.ZodTypeAny, {
    type?: "individual" | "organization";
    id?: string;
    name?: string;
    email?: string;
    incubator?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    ownerId?: string;
    organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
    pic?: string;
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
}, {
    type?: "individual" | "organization";
    id?: string;
    name?: string;
    email?: string;
    incubator?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    ownerId?: string;
    organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
    pic?: string;
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
}>;
export type Initiative = z.infer<typeof initiative>;
declare const currency: z.ZodEnum<["cop", "usd", "eur", "gbp"]>;
export type Currency = z.infer<typeof currency>;
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
    id: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    initiativeId: z.ZodString;
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
        customer: z.ZodString;
        subscription: z.ZodOptional<z.ZodString>;
        billingCycleAnchor: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
        status: z.ZodEnum<["active", "incomplete", "canceled"]>;
    }, "strip", z.ZodTypeAny, {
        customer?: string;
        subscription?: string;
        billingCycleAnchor?: Date;
        status?: "active" | "canceled" | "incomplete";
    }, {
        customer?: string;
        subscription?: string;
        billingCycleAnchor?: any;
        status?: "active" | "canceled" | "incomplete";
    }>>;
    pic: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    settings: z.ZodOptional<z.ZodObject<{
        locales: z.ZodArray<z.ZodEnum<["en", "es", "fr"]>, "many">;
    }, "strip", z.ZodTypeAny, {
        locales?: ("en" | "es" | "fr")[];
    }, {
        locales?: ("en" | "es" | "fr")[];
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
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    initiativeId?: string;
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
        customer?: string;
        subscription?: string;
        billingCycleAnchor?: Date;
        status?: "active" | "canceled" | "incomplete";
    };
    pic?: string;
    name?: string;
    settings?: {
        locales?: ("en" | "es" | "fr")[];
    };
    phoneNumber?: {
        countryCallingCode?: string;
        nationalNumber?: string;
    };
}, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    initiativeId?: string;
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
        customer?: string;
        subscription?: string;
        billingCycleAnchor?: any;
        status?: "active" | "canceled" | "incomplete";
    };
    pic?: string;
    name?: string;
    settings?: {
        locales?: ("en" | "es" | "fr")[];
    };
    phoneNumber?: {
        countryCallingCode?: string;
        nationalNumber?: string;
    };
}>;
export type Member = z.infer<typeof member>;
export declare const like: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
}, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
}>;
export type Like = z.infer<typeof like>;
export declare const socialProof: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    rating: z.ZodNumber;
    videoUrl: z.ZodOptional<z.ZodString>;
    byInitiative: z.ZodString;
    forInitiative: z.ZodString;
    forAction: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    rating?: number;
    videoUrl?: string;
    byInitiative?: string;
    forInitiative?: string;
    forAction?: string;
    text?: string;
}, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    rating?: number;
    videoUrl?: string;
    byInitiative?: string;
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
    id: z.ZodOptional<z.ZodString>;
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
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
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
    initiativeId: z.ZodString;
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
    id?: string;
    validation?: {
        validator?: string;
        validated?: boolean;
    };
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    ratings?: {
        sum?: number;
        count?: number;
    };
    initiativeId?: string;
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
    id?: string;
    validation?: {
        validator?: string;
        validated?: boolean;
    };
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    ratings?: {
        sum?: number;
        count?: number;
    };
    initiativeId?: string;
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
}>;
export type PosiFormData = z.infer<typeof posiFormData>;
export declare const content: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
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
        id: z.ZodOptional<z.ZodString>;
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
        locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
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
        initiativeId: z.ZodString;
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
        id?: string;
        validation?: {
            validator?: string;
            validated?: boolean;
        };
        locale?: "en" | "es" | "fr";
        createdAt?: Date;
        ratings?: {
            sum?: number;
            count?: number;
        };
        initiativeId?: string;
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
        id?: string;
        validation?: {
            validator?: string;
            validated?: boolean;
        };
        locale?: "en" | "es" | "fr";
        createdAt?: Date;
        ratings?: {
            sum?: number;
            count?: number;
        };
        initiativeId?: string;
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
        id?: string;
        validation?: {
            validator?: string;
            validated?: boolean;
        };
        locale?: "en" | "es" | "fr";
        createdAt?: Date;
        ratings?: {
            sum?: number;
            count?: number;
        };
        initiativeId?: string;
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
    }, unknown>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    locale?: "en" | "es" | "fr";
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
        id?: string;
        validation?: {
            validator?: string;
            validated?: boolean;
        };
        locale?: "en" | "es" | "fr";
        createdAt?: Date;
        ratings?: {
            sum?: number;
            count?: number;
        };
        initiativeId?: string;
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
    };
}, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    type?: "action";
    data?: unknown;
}>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    type: z.ZodLiteral<"socialProof">;
    data: z.ZodEffects<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
        createdAt: z.ZodOptional<z.ZodDate>;
        rating: z.ZodNumber;
        videoUrl: z.ZodOptional<z.ZodString>;
        byInitiative: z.ZodString;
        forInitiative: z.ZodString;
        forAction: z.ZodOptional<z.ZodString>;
        text: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string;
        locale?: "en" | "es" | "fr";
        createdAt?: Date;
        rating?: number;
        videoUrl?: string;
        byInitiative?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    }, {
        id?: string;
        locale?: "en" | "es" | "fr";
        createdAt?: Date;
        rating?: number;
        videoUrl?: string;
        byInitiative?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    }>, {
        id?: string;
        locale?: "en" | "es" | "fr";
        createdAt?: Date;
        rating?: number;
        videoUrl?: string;
        byInitiative?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    }, unknown>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    type?: "socialProof";
    data?: {
        id?: string;
        locale?: "en" | "es" | "fr";
        createdAt?: Date;
        rating?: number;
        videoUrl?: string;
        byInitiative?: string;
        forInitiative?: string;
        forAction?: string;
        text?: string;
    };
}, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    type?: "socialProof";
    data?: unknown;
}>]>;
export type Content = z.infer<typeof content>;
export declare const sponsorshipLevel: z.ZodEnum<["admirer", "fan", "lover", "custom"]>;
export type SponsorshipLevel = z.infer<typeof sponsorshipLevel>;
export declare const sponsorship: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    stripeSubscriptionItem: z.ZodUnion<[z.ZodString, z.ZodEnum<["incomplete"]>]>;
    stripePrice: z.ZodString;
    paymentsStarted: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    total: z.ZodNumber;
    sponsorshipLevel: z.ZodEnum<["admirer", "fan", "lover", "custom"]>;
    customAmount: z.ZodOptional<z.ZodNumber>;
    tipAmount: z.ZodNumber;
    denyFee: z.ZodOptional<z.ZodBoolean>;
    initiative: z.ZodString;
    member: z.ZodString;
    memberPublishable: z.ZodOptional<z.ZodBoolean>;
    currency: z.ZodEnum<["cop", "usd", "eur", "gbp"]>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    stripeSubscriptionItem?: string;
    stripePrice?: string;
    paymentsStarted?: Date;
    total?: number;
    sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
    customAmount?: number;
    tipAmount?: number;
    denyFee?: boolean;
    initiative?: string;
    member?: string;
    memberPublishable?: boolean;
    currency?: "cop" | "usd" | "eur" | "gbp";
}, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    stripeSubscriptionItem?: string;
    stripePrice?: string;
    paymentsStarted?: any;
    total?: number;
    sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
    customAmount?: number;
    tipAmount?: number;
    denyFee?: boolean;
    initiative?: string;
    member?: string;
    memberPublishable?: boolean;
    currency?: "cop" | "usd" | "eur" | "gbp";
}>;
export type Sponsorship = z.infer<typeof sponsorship>;
export declare const incubatee: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    locale: z.ZodOptional<z.ZodEnum<["en", "es", "fr"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    acceptedInvite: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    acceptedInvite?: boolean;
}, {
    id?: string;
    locale?: "en" | "es" | "fr";
    createdAt?: Date;
    acceptedInvite?: boolean;
}>;
export type Incubatee = z.infer<typeof incubatee>;
export {};
