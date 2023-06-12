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
export declare const makerType: z.ZodEnum<["individual", "organization"]>;
export declare const organizationType: z.ZodEnum<["nonprofit", "religious", "unincorporated", "profit"]>;
export type OrganizationType = z.infer<typeof organizationType>;
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
    ownerId: z.ZodString;
    type: z.ZodEnum<["individual", "organization"]>;
    pic: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    organizationType: z.ZodOptional<z.ZodEnum<["nonprofit", "religious", "unincorporated", "profit"]>>;
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
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    ownerId?: string;
    type?: "individual" | "organization";
    pic?: string;
    name?: string;
    organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit";
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
    email?: string;
}, {
    id?: string;
    ownerId?: string;
    type?: "individual" | "organization";
    pic?: string;
    name?: string;
    organizationType?: "nonprofit" | "religious" | "unincorporated" | "profit";
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
    email?: string;
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
        subscription: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        customer?: string;
        subscription?: string;
    }, {
        customer?: string;
        subscription?: string;
    }>>;
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
    };
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
    };
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
    sponsorshipPrice: z.ZodString;
    total: z.ZodNumber;
    sponsorshipLevel: z.ZodEnum<["admirer", "fan", "lover", "custom"]>;
    customAmount: z.ZodOptional<z.ZodNumber>;
    tipAmount: z.ZodOptional<z.ZodNumber>;
    denyFee: z.ZodOptional<z.ZodBoolean>;
    paid: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id?: string;
    createdAt?: Date;
    sponsorshipPrice?: string;
    total?: number;
    sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
    customAmount?: number;
    tipAmount?: number;
    denyFee?: boolean;
    paid?: boolean;
}, {
    id?: string;
    createdAt?: Date;
    sponsorshipPrice?: string;
    total?: number;
    sponsorshipLevel?: "custom" | "admirer" | "fan" | "lover";
    customAmount?: number;
    tipAmount?: number;
    denyFee?: boolean;
    paid?: boolean;
}>;
export {};
