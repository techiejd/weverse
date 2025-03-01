"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.from = exports.fromTypes = exports.incubatee = exports.sponsorship = exports.sponsorshipLevel = exports.content = exports.posiFormData = exports.actionPresentationExtension = exports.socialProof = exports.like = exports.member = exports.phoneNumber = exports.initiative = exports.createNestedLocalizedSchema = exports.dbBase = exports.locale = exports.ratings = exports.zeroRatings = exports.organizationType = exports.initiativeType = exports.media = exports.mediaType = exports.formUrl = exports.timeStamp = void 0;
const zod_1 = require("zod");
exports.timeStamp = zod_1.z.any().transform((val, ctx) => {
    if (val == null) {
        return undefined; // When the field is null it means it exists locally only and not on the server.
    }
    if (val instanceof Date) {
        return val;
    }
    if (typeof val.toDate === "function") {
        return val.toDate();
    }
    ctx.addIssue({
        code: zod_1.z.ZodIssueCode.custom,
        message: "Not a firestore timestamp or date.",
    });
    return zod_1.z.NEVER;
});
// TODO(techiejd): Check all urls are with our hosting.
exports.formUrl = zod_1.z.string().url();
exports.mediaType = zod_1.z.enum(["video", "img"]);
exports.media = zod_1.z.object({
    type: exports.mediaType,
    url: exports.formUrl,
});
exports.initiativeType = zod_1.z.enum(["individual", "organization"]);
exports.organizationType = zod_1.z.enum([
    "nonprofit",
    "religious",
    "unincorporated",
    "profit",
    "incubator",
]);
const howToSupport = zod_1.z.object({
    contact: zod_1.z.string().max(500).optional(),
});
// TODO(techiejd): Look into initializing ratings to zero a different way.
exports.zeroRatings = { sum: 0, count: 0 };
exports.ratings = zod_1.z.object({ sum: zod_1.z.number(), count: zod_1.z.number() });
exports.locale = zod_1.z.enum(["en", "es", "fr", "de", "pl", "pt"]);
exports.dbBase = zod_1.z.object({
    //deprecated: id: z.string().optional(),
    path: zod_1.z.string().min(1).optional(),
    locale: exports.locale.optional(),
    createdAt: exports.timeStamp.optional(), // from db iff exists
});
const initiativePresentationExtension = zod_1.z.object({
    presentationVideo: exports.formUrl.optional(),
    howToSupport: howToSupport.optional(),
    about: zod_1.z.string().optional(),
    validationProcess: zod_1.z.string().optional(),
});
function createNestedLocalizedSchema(itemSchema) {
    // Look into a way to make these keys programmaticly
    return zod_1.z.object({
        en: itemSchema,
        es: itemSchema,
        fr: itemSchema,
        de: itemSchema,
        pl: itemSchema,
        pt: itemSchema,
    });
}
exports.createNestedLocalizedSchema = createNestedLocalizedSchema;
const accountStatus = zod_1.z.enum(["onboarding", "active"]);
// deprecated: maker
exports.initiative = exports.dbBase
    .extend({
    type: exports.initiativeType,
    organizationType: exports.organizationType.optional(),
    name: zod_1.z.string().min(1),
    pic: exports.formUrl.optional(),
    email: zod_1.z.string().optional(),
    incubator: zod_1.z
        .object({
        path: zod_1.z.string().min(1),
        connectedAccount: zod_1.z
            .enum([
            "incubateeRequested",
            "pendingIncubateeApproval",
            "allAccepted",
        ])
            .optional(),
    })
        .optional(),
    ratings: exports.ratings,
    connectedAccount: zod_1.z
        .object({
        ownerMemberPath: zod_1.z.string(),
        stripeAccountId: zod_1.z.string(),
        status: accountStatus,
        title: zod_1.z.string(),
    })
        .optional(),
})
    .merge(createNestedLocalizedSchema(initiativePresentationExtension.optional()));
const paymentPlanOptions = zod_1.z.enum(["monthly", "oneTime"]);
const currency = zod_1.z.enum(["cop", "usd", "eur", "gbp"]);
const customer = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(1),
    address: zod_1.z.object({
        postalCode: zod_1.z.string().min(1),
        country: zod_1.z.string().min(1),
        countryCode: zod_1.z.string().min(1),
    }),
    currency: currency,
});
const accounts = zod_1.z.record(zod_1.z.string().min(1), zod_1.z.object({
    title: zod_1.z.string().min(1),
    initiatives: zod_1.z.array(zod_1.z.string().min(1)),
    status: accountStatus,
}));
const stripe = zod_1.z.object({
    customer: zod_1.z
        .object({
        id: zod_1.z.string().min(1),
        status: zod_1.z.enum(["incomplete", "confirmed"]),
        paymentMethod: zod_1.z.string().min(1).optional(),
    })
        .optional(),
    // deprecated: subscription: z.string().min(1).optional(), // TODO(techiejd): Not unique.
    // deprecated: billingCycleAnchor: timeStamp.optional(), // TODO(techiejd): Not unique.
    // deprecated: status: z.enum(["active", "incomplete", "canceled"]).optional(), // TODO(techiejd): Not unique. Look into optionality.
    accounts: accounts.optional(),
});
const contentSettings = zod_1.z.object({
    locales: exports.locale.array(),
});
exports.phoneNumber = zod_1.z.object({
    countryCallingCode: zod_1.z.string().min(1),
    nationalNumber: zod_1.z.string().min(1),
});
exports.member = exports.dbBase.extend({
    // deprecated: makerId: z.string().optional(),
    // deprecated: initiativeId: z.string(),
    customer: customer.optional(),
    stripe: stripe.optional(),
    pic: exports.formUrl.optional(),
    name: zod_1.z.string().min(1),
    settings: contentSettings.optional(),
    phoneNumber: exports.phoneNumber,
});
// This is an edge.
exports.like = exports.dbBase;
exports.socialProof = exports.dbBase.extend({
    rating: zod_1.z.number(),
    videoUrl: exports.formUrl.optional(),
    // deprecated: byMaker: z.string().optional(),
    // deprecated: byInitiative: z.string(),
    byMember: zod_1.z.string(),
    // deprecated: forMaker: z.string().optional(),
    forInitiative: zod_1.z.string(),
    forAction: zod_1.z.string().optional(),
    text: zod_1.z.string().optional(),
});
// related to
// / <reference types="google.maps" />
const location = zod_1.z
    .object({
    /**
     * A place ID that can be used to retrieve details about this place using
     * the place details service (see {@link
     * google.maps.places.PlacesService.getDetails}).
     */
    id: zod_1.z.string(),
    /**
     * Structured information about the place's description, divided into a
     * main text and a secondary text. We remove lots of google info.
     * (see {@link google.maps.places.StructuredFormatting}).
     */
    structuredFormatting: zod_1.z.object({
        mainText: zod_1.z.string(),
        secondaryText: zod_1.z.string(),
    }),
    /**
     * Information about individual terms in the above description, from most to
     * least specific. For example, "Taco Bell", "TOWN",
     * and "STATE".
     */
    terms: zod_1.z
        .object({
        /**
         * The offset, in unicode characters, of the start of this term in the
         * description of the place. AKA first term's offset = 0.
         */
        offset: zod_1.z.number(),
        /**
         * The value of this term, for example,"Taco Bell".
         */
        value: zod_1.z.string(),
    })
        .array(),
    /**
     * An array of types that the prediction belongs to, for example
     * <code>'establishment'</code> or <code>'geocode'</code>.
     */
    types: zod_1.z.string().array(),
})
    .deepPartial(); // TODO(techiejd): Look into this error.
const validation = zod_1.z.object({
    validator: zod_1.z.string(),
    validated: zod_1.z.boolean(),
});
exports.actionPresentationExtension = zod_1.z.object({
    media: exports.media,
    summary: zod_1.z.string().min(1),
});
exports.posiFormData = exports.dbBase
    .extend({
    // deprecated: makerId: z.string().optional(),
    // deprecated: initiativeId: z.string(),
    location: location.optional(),
    ratings: exports.ratings,
    validation: validation.optional(),
    // retired - howToIdentifyImpactedPeople: z.string().min(1).optional(),
})
    .merge(createNestedLocalizedSchema(exports.actionPresentationExtension.optional()));
const parseDBInfo = (zAny) => zod_1.z.preprocess((val) => {
    const _a = zod_1.z.object({}).passthrough().parse(val), { createdAt } = _a, others = __rest(_a, ["createdAt"]);
    return Object.assign({ createdAt: createdAt ? createdAt.toDate() : undefined }, others);
}, zAny);
const actionContent = exports.dbBase.extend({
    type: zod_1.z.literal("action"),
    data: parseDBInfo(exports.posiFormData),
});
const socialProofContent = exports.dbBase.extend({
    type: zod_1.z.literal("testimonial"),
    data: parseDBInfo(exports.socialProof),
});
exports.content = zod_1.z.discriminatedUnion("type", [
    actionContent,
    socialProofContent,
]);
exports.sponsorshipLevel = zod_1.z.enum(["admirer", "fan", "lover", "custom"]);
const paymentPlanMonthlyStatus = zod_1.z.enum([
    "active",
    "incomplete",
    "canceled",
    "incomplete_expired",
]); //TODO(techiejd): Look into removing incomplete_expired.
exports.sponsorship = exports.dbBase.extend({
    version: zod_1.z.enum(["0.0.1", "0.0.2"]),
    paymentPlan: zod_1.z.discriminatedUnion("type", [
        zod_1.z.object({
            type: zod_1.z.literal("monthly"),
            id: zod_1.z.string().min(1).optional(),
            billingCycleAnchor: exports.timeStamp.optional(),
            status: paymentPlanMonthlyStatus,
            item: zod_1.z.string().min(1),
            price: zod_1.z.string().min(1),
            applicationFeePercent: zod_1.z.number(), // Number between 0 and 100.
        }),
        zod_1.z.object({
            type: zod_1.z.literal("oneTime"),
            status: zod_1.z.enum(["active", "incomplete"]),
            applicationFeeAmount: zod_1.z.number(), // Amount paid, no decimal
        }),
    ]),
    // deprecated: stripeSubscription: z.string().optional(),
    // deprecated: stripePrice: z.string(), // Stripe's price id.
    paymentsStarted: exports.timeStamp.optional(),
    total: zod_1.z.number(),
    sponsorshipLevel: exports.sponsorshipLevel,
    customAmount: zod_1.z.number().optional(),
    // deprecated: tipAmount: z.number(),
    tipPercentage: zod_1.z.number(),
    // deprecated: denyFee: z.boolean().optional(),
    denyStripeFee: zod_1.z.boolean().optional(),
    // deprecated: maker: z.string()
    initiative: zod_1.z.string(),
    member: zod_1.z.string(),
    memberPublishable: zod_1.z.boolean().optional(),
    currency: currency,
    canceledAt: exports.timeStamp.optional(),
    oneWeAmount: zod_1.z.number(),
    initiativeAmount: zod_1.z.number(),
    stripeFeeAmount: zod_1.z.number(),
    destinationAccount: zod_1.z.string().or(zod_1.z.enum(["legacy"])),
    status: zod_1.z
        .enum(["active", "incomplete", "canceled", "incomplete_expired"])
        .optional(),
});
exports.incubatee = exports.dbBase.extend({
    initiativePath: zod_1.z.string().optional(),
    initializeWith: exports.initiative
        .pick({
        name: true,
        type: true,
        organizationType: true,
        incubator: true,
        ratings: true,
    })
        .optional(),
});
exports.fromTypes = zod_1.z.enum(["testimonial", "sponsorship", "like"]);
// This is are all edges from the member to the initiative or action. The id is the path of the initiative or action where we replaced "/" with "_".
// Watch out! If you update({type, data}), data will be overwritten given Firestore's API. So you need to use set({type, data}, {merge: true}) instead.
// TODO(techiejd): Refactor out updates vs set({merge: true}), so that it's less of a headache for developer.
exports.from = zod_1.z.discriminatedUnion("type", [
    exports.dbBase.extend({ type: zod_1.z.literal("testimonial"), data: exports.socialProof }),
    exports.dbBase.extend({ type: zod_1.z.literal("sponsorship"), data: exports.sponsorship }),
    exports.dbBase.extend({ type: zod_1.z.literal("like"), data: exports.like }),
]);
//# sourceMappingURL=index.js.map