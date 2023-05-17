"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.posiFormData = exports.socialProof = exports.member = exports.maker = exports.ratings = exports.organizationLabels = exports.organizationType = exports.media = exports.mediaType = exports.formUrl = void 0;
const zod_1 = require("zod");
// TODO(techiejd): Check all urls are with our hosting.
exports.formUrl = zod_1.z.string().url();
exports.mediaType = zod_1.z.enum(["video", "img"]);
exports.media = zod_1.z.object({
    type: exports.mediaType,
    url: exports.formUrl,
});
const makerType = zod_1.z.enum(["individual", "organization"]);
exports.organizationType = zod_1.z.enum([
    "nonprofit",
    "religious",
    "governmental",
    "unincorporated",
    "profit",
]);
exports.organizationLabels = {
    [exports.organizationType.Enum.nonprofit]: "Fundación u otra ONG",
    [exports.organizationType.Enum.religious]: "Organización Religiosa",
    [exports.organizationType.Enum.governmental]: "Organización Gubermental",
    [exports.organizationType.Enum.unincorporated]: "Voluntarios",
    [exports.organizationType.Enum.profit]: "Organización comercial",
};
const howToSupport = zod_1.z.object({
    contact: zod_1.z.string().max(500).optional(),
    finance: zod_1.z.string().max(500).optional(),
});
exports.ratings = zod_1.z.object({ sum: zod_1.z.number(), count: zod_1.z.number() });
exports.maker = zod_1.z.object({
    id: zod_1.z.string().optional(),
    ownerId: zod_1.z.string(),
    type: makerType,
    pic: exports.formUrl.optional(),
    name: zod_1.z.string().min(1),
    organizationType: exports.organizationType.optional(),
    createdAt: zod_1.z.date().optional(),
    howToSupport: howToSupport.optional(),
    about: zod_1.z.string().min(5).max(1000).optional(),
    ratings: exports.ratings.optional(),
});
exports.member = zod_1.z.object({
    makerId: zod_1.z.string(),
    id: zod_1.z.string().optional(),
    createdAt: zod_1.z.date().optional(),
});
exports.socialProof = zod_1.z.object({
    id: zod_1.z.string().optional(),
    rating: zod_1.z.number(),
    videoUrl: exports.formUrl.optional(),
    byMaker: zod_1.z.string(),
    forMaker: zod_1.z.string(),
    forAction: zod_1.z.string().optional(),
    createdAt: zod_1.z.date().optional(),
});
// related to
// / <reference types="google.maps" />
const location = zod_1.z.object({
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
});
// TODO(techiejd): Reshape db. It should go posi
// {action: Action, impacts: Impact[], makerId}
exports.posiFormData = zod_1.z.object({
    id: zod_1.z.string().optional(),
    summary: zod_1.z.string().min(1),
    howToIdentifyImpactedPeople: zod_1.z.string().min(1).optional(),
    location: location.optional(),
    media: exports.media,
    makerId: zod_1.z.string(),
    createdAt: zod_1.z.date().optional(),
    ratings: exports.ratings.optional(),
});
//# sourceMappingURL=index.js.map