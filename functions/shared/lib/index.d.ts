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
export declare const makerType: z.ZodEnum<["individual", "organization"]>;
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
declare const dbBase: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
}, {
    id?: string;
    createdAt?: Date;
}>;
export type DbBase = z.infer<typeof dbBase>;
export declare const maker: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    ownerId: z.ZodUnion<[z.ZodString, z.ZodEnum<["invited"]>]>;
    type: z.ZodEnum<["individual", "organization"]>;
    pic: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    organizationType: z.ZodOptional<z.ZodEnum<["nonprofit", "religious", "unincorporated", "profit", "incubator"]>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    howToSupport: z.ZodOptional<z.ZodObject<{
        contact: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        contact?: string;
    }, {
        contact?: string;
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
    email: z.ZodOptional<z.ZodString>;
    incubator: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    ownerId?: string;
    type?: "individual" | "organization";
    pic?: string;
    name?: string;
    organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
    createdAt?: Date;
    howToSupport?: {
        contact?: string;
    };
    about?: string;
    ratings?: {
        sum?: number;
        count?: number;
    };
    email?: string;
    incubator?: string;
}, {
    id?: string;
    ownerId?: string;
    type?: "individual" | "organization";
    pic?: string;
    name?: string;
    organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit" | "incubator";
    createdAt?: Date;
    howToSupport?: {
        contact?: string;
    };
    about?: string;
    ratings?: {
        sum?: number;
        count?: number;
    };
    email?: string;
    incubator?: string;
}>;
export type Maker = z.infer<typeof maker>;
export declare const member: z.ZodObject<{
    makerId: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
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
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    makerId?: string;
    id?: string;
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
    };
    stripe?: {
        customer?: string;
        subscription?: string;
        billingCycleAnchor?: Date;
        status?: "active" | "canceled" | "incomplete";
    };
    pic?: string;
    name?: string;
}, {
    makerId?: string;
    id?: string;
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
    };
    stripe?: {
        customer?: string;
        subscription?: string;
        billingCycleAnchor?: any;
        status?: "active" | "canceled" | "incomplete";
    };
    pic?: string;
    name?: string;
}>;
export type Member = z.infer<typeof member>;
export declare const like: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
}, {
    id?: string;
    createdAt?: Date;
}>;
export type Like = z.infer<typeof like>;
export declare const socialProof: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    rating: z.ZodNumber;
    videoUrl: z.ZodOptional<z.ZodString>;
    byMaker: z.ZodString;
    forMaker: z.ZodString;
    forAction: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    text: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    rating?: number;
    videoUrl?: string;
    byMaker?: string;
    forMaker?: string;
    forAction?: string;
    createdAt?: Date;
    text?: string;
}, {
    id?: string;
    rating?: number;
    videoUrl?: string;
    byMaker?: string;
    forMaker?: string;
    forAction?: string;
    createdAt?: Date;
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
export declare const posiFormData: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    summary: z.ZodString;
    howToIdentifyImpactedPeople: z.ZodOptional<z.ZodString>;
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
    validation?: {
        validator?: string;
        validated?: boolean;
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
    validation?: {
        validator?: string;
        validated?: boolean;
    };
}>;
export type PosiFormData = z.infer<typeof posiFormData>;
export declare const content: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    type: z.ZodLiteral<"action">;
    data: z.ZodEffects<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        summary: z.ZodString;
        howToIdentifyImpactedPeople: z.ZodOptional<z.ZodString>;
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
        validation?: {
            validator?: string;
            validated?: boolean;
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
        validation?: {
            validator?: string;
            validated?: boolean;
        };
    }>, {
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
        validation?: {
            validator?: string;
            validated?: boolean;
        };
    }, unknown>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
    type?: "action";
    data?: {
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
        validation?: {
            validator?: string;
            validated?: boolean;
        };
    };
}, {
    id?: string;
    createdAt?: Date;
    type?: "action";
    data?: unknown;
}>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    type: z.ZodLiteral<"socialProof">;
    data: z.ZodEffects<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        rating: z.ZodNumber;
        videoUrl: z.ZodOptional<z.ZodString>;
        byMaker: z.ZodString;
        forMaker: z.ZodString;
        forAction: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodOptional<z.ZodDate>;
        text: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id?: string;
        rating?: number;
        videoUrl?: string;
        byMaker?: string;
        forMaker?: string;
        forAction?: string;
        createdAt?: Date;
        text?: string;
    }, {
        id?: string;
        rating?: number;
        videoUrl?: string;
        byMaker?: string;
        forMaker?: string;
        forAction?: string;
        createdAt?: Date;
        text?: string;
    }>, {
        id?: string;
        rating?: number;
        videoUrl?: string;
        byMaker?: string;
        forMaker?: string;
        forAction?: string;
        createdAt?: Date;
        text?: string;
    }, unknown>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
    type?: "socialProof";
    data?: {
        id?: string;
        rating?: number;
        videoUrl?: string;
        byMaker?: string;
        forMaker?: string;
        forAction?: string;
        createdAt?: Date;
        text?: string;
    };
}, {
    id?: string;
    createdAt?: Date;
    type?: "socialProof";
    data?: unknown;
}>]>;
export type Content = z.infer<typeof content>;
export declare const sponsorshipLevel: z.ZodEnum<["admirer", "fan", "lover", "custom"]>;
export type SponsorshipLevel = z.infer<typeof sponsorshipLevel>;
export declare const sponsorship: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    stripeSubscriptionItem: z.ZodUnion<[z.ZodString, z.ZodEnum<["incomplete"]>]>;
    stripePrice: z.ZodString;
    paymentsStarted: z.ZodOptional<z.ZodEffects<z.ZodAny, Date, any>>;
    total: z.ZodNumber;
    sponsorshipLevel: z.ZodEnum<["admirer", "fan", "lover", "custom"]>;
    customAmount: z.ZodOptional<z.ZodNumber>;
    tipAmount: z.ZodNumber;
    denyFee: z.ZodOptional<z.ZodBoolean>;
    maker: z.ZodString;
    member: z.ZodString;
    memberPublishable: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
    stripeSubscriptionItem?: string;
    stripePrice?: string;
    paymentsStarted?: Date;
    total?: number;
    sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
    customAmount?: number;
    tipAmount?: number;
    denyFee?: boolean;
    maker?: string;
    member?: string;
    memberPublishable?: boolean;
}, {
    id?: string;
    createdAt?: Date;
    stripeSubscriptionItem?: string;
    stripePrice?: string;
    paymentsStarted?: any;
    total?: number;
    sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
    customAmount?: number;
    tipAmount?: number;
    denyFee?: boolean;
    maker?: string;
    member?: string;
    memberPublishable?: boolean;
}>;
export type Sponsorship = z.infer<typeof sponsorship>;
export declare const incubatee: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodOptional<z.ZodDate>;
    acceptedInvite: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
    acceptedInvite?: boolean;
}, {
    id?: string;
    createdAt?: Date;
    acceptedInvite?: boolean;
}>;
export type Incubatee = z.infer<typeof incubatee>;
export {};
