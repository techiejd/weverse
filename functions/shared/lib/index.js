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
exports.incubatee = exports.sponsorship = exports.sponsorshipLevel = exports.content = exports.posiFormData = exports.actionPresentationExtension = exports.socialProof = exports.like = exports.member = exports.phoneNumber = exports.maker = exports.createNestedLocalizedSchema = exports.locale = exports.ratings = exports.organizationType = exports.makerType = exports.media = exports.mediaType = exports.formUrl = exports.timeStamp = void 0;
const zod_1 = require("zod");
exports.timeStamp = zod_1.z.any().transform((val, ctx) => {
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
exports.makerType = zod_1.z.enum(["individual", "organization"]);
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
exports.ratings = zod_1.z.object({ sum: zod_1.z.number(), count: zod_1.z.number() });
exports.locale = zod_1.z.enum(["en", "es", "fr"]);
const dbBase = zod_1.z.object({
    id: zod_1.z.string().optional(),
    locale: exports.locale.optional(),
    createdAt: zod_1.z.date().optional(), // from db iff exists
});
const makerPresentationExtension = zod_1.z.object({
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
    });
}
exports.createNestedLocalizedSchema = createNestedLocalizedSchema;
exports.maker = dbBase
    .extend({
    ownerId: zod_1.z.string().or(zod_1.z.enum(["invited"])),
    type: exports.makerType,
    organizationType: exports.organizationType.optional(),
    name: zod_1.z.string().min(1),
    pic: exports.formUrl.optional(),
    email: zod_1.z.string().optional(),
    incubator: zod_1.z.string().optional(),
    ratings: exports.ratings.optional(),
})
    .merge(createNestedLocalizedSchema(makerPresentationExtension.optional()));
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
const stripe = zod_1.z.object({
    customer: zod_1.z.string().min(1),
    subscription: zod_1.z.string().min(1).optional(),
    billingCycleAnchor: exports.timeStamp.optional(),
    status: zod_1.z.enum(["active", "incomplete", "canceled"]),
});
exports.phoneNumber = zod_1.z.object({
    countryCallingCode: zod_1.z.string().min(1),
    nationalNumber: zod_1.z.string().min(1),
});
exports.member = dbBase.extend({
    makerId: zod_1.z.string(),
    customer: customer.optional(),
    stripe: stripe.optional(),
    pic: exports.formUrl.optional(),
    name: zod_1.z.string().min(1),
    phoneNumber: exports.phoneNumber,
});
// This is an edge.
exports.like = dbBase;
exports.socialProof = dbBase.extend({
    rating: zod_1.z.number(),
    videoUrl: exports.formUrl.optional(),
    byMaker: zod_1.z.string(),
    forMaker: zod_1.z.string(),
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
// TODO(techiejd): Reshape db. It should go posi
// {action: Action, impacts: Impact[], makerId}
exports.actionPresentationExtension = zod_1.z.object({
    media: exports.media,
    summary: zod_1.z.string().min(1),
});
exports.posiFormData = dbBase
    .extend({
    makerId: zod_1.z.string(),
    location: location.optional(),
    ratings: exports.ratings.optional(),
    validation: validation.optional(),
    // retired - howToIdentifyImpactedPeople: z.string().min(1).optional(),
})
    .merge(createNestedLocalizedSchema(exports.actionPresentationExtension.optional()));
const parseDBInfo = (zAny) => zod_1.z.preprocess((val) => {
    const _a = zod_1.z.object({}).passthrough().parse(val), { createdAt } = _a, others = __rest(_a, ["createdAt"]);
    return Object.assign({ createdAt: createdAt ? createdAt.toDate() : undefined }, others);
}, zAny);
const actionContent = dbBase.extend({
    type: zod_1.z.literal("action"),
    data: parseDBInfo(exports.posiFormData),
});
const socialProofContent = dbBase.extend({
    type: zod_1.z.literal("socialProof"),
    data: parseDBInfo(exports.socialProof),
});
exports.content = zod_1.z.discriminatedUnion("type", [
    actionContent,
    socialProofContent,
]);
exports.sponsorshipLevel = zod_1.z.enum(["admirer", "fan", "lover", "custom"]);
exports.sponsorship = dbBase.extend({
    stripeSubscriptionItem: zod_1.z.string().or(zod_1.z.enum(["incomplete"])),
    stripePrice: zod_1.z.string(),
    paymentsStarted: exports.timeStamp.optional(),
    total: zod_1.z.number(),
    sponsorshipLevel: exports.sponsorshipLevel,
    customAmount: zod_1.z.number().optional(),
    tipAmount: zod_1.z.number(),
    denyFee: zod_1.z.boolean().optional(),
    maker: zod_1.z.string(),
    member: zod_1.z.string(),
    memberPublishable: zod_1.z.boolean().optional(),
    currency: currency,
});
exports.incubatee = dbBase.extend({
    acceptedInvite: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=index.js.map