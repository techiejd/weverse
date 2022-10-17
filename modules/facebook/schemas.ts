// Facebook Schemas based off of what we see and use.
// This is not in any way exhaustive!!!
// Because docs are exhaustive, we do rely on them (developers.facebook.com).
import {z} from 'zod';

const paging = z.object({
  cursors: z.object({
    before: z.string(),
    after: z.string(),
  }).optional(),
  previous: z.string().optional(),
  next: z.string().optional(),
});

// TODO(techiejd): Fix paginatedData to paginatedFor(TYPE);
export const paginatedData = z.object({
  data: z.record(z.unknown()).array(),
  paging: paging.optional(),
});

export type PaginatedData = z.infer<typeof paginatedData>;

const from = z.object({
  name: z.string(),
  id: z.string(),
});

export const comment = z.object({
  id: z.string(),
  message: z.string().optional(),
  from: from.optional(),
  parent: z.any(),
});

export type Comment = z.infer<typeof comment>;

const paginatedComments = z.object({
  data: comment.array(),
  paging: paging.optional(),
});

// export type Paging = z.infer<typeof paging>;

const reactionEnum = z.enum(
    ['NONE', 'LIKE', 'LOVE', 'WOW', 'HAHA', 'SORRY', 'ANGRY', 'CARE']);

const paginatedReactions = z.object({
  paging: paging.optional(),
  data: z.object({
    id: z.string(),
    name: z.string(), // TODO(techiejd): Should be optional?
    type: reactionEnum,
  }).array(),
});

const mediaObject = z.object({
  image: z.object({
    height: z.number(),
    width: z.number(),
    src: z.string(),
  }).optional(),
  source: z.string().optional(),
});

const subattachment = z.object({
  media: mediaObject.optional(),
  media_type: z.string().optional(),
  type: z.string(),
});

const paginatedSubattachments = z.object({
  data: subattachment.array(),
  paging: paging.optional(),
});

export const attachment = subattachment.extend({
  subattachments: paginatedSubattachments.optional(),
});

const paginatedAttachments = z.object({
  data: attachment.array(),
  paging: paging.optional(),
});


const facebookPost = z.object({
  message: z.string().optional(),
  id: z.string(),
  reactions: paginatedReactions.optional(),
  from: from.optional(),
  comments: paginatedComments.optional(),
  attachments: paginatedAttachments.optional(),
});
export type Post = z.infer<typeof facebookPost>;

export const feed = facebookPost.array();
export type Feed = z.infer<typeof feed>;

const optedInMember = z.object({
  name: z.string(),
  id: z.string(),
});
export const optedInMembers = optedInMember.array();

export const tokenResponse = z.object({
  access_token: z.string(),
  expires_in: z.number().optional(),
});
export type TokenResponseType = z.infer<typeof tokenResponse>;

// TODO(techiejd): Clean by abstracting away Messenger.
export namespace Messenger {
  const quickReply = z.object({
    content_type: z.enum(['text', 'user_phone_number', 'user_email']),
    title: z.string(),
    payload: z.string(),
    image_url: z.string().optional(),
  });
  
  export type QuickReply = z.infer<typeof quickReply>;
  
  export const message = z.object({
    text: z.string().optional(),
    attachment: z.object({}).optional(),
    quick_replies: quickReply.array().optional(),
  });
  
  export type Message = z.infer<typeof message>;
  
  const MessageBody = z.object({
    messaging_type: z.enum(['RESPONSE', 'UPDATE', 'MESSAGE_TAG']),
    recipient: z.object({
      id: z.string().optional(),
      notification_messages_token: z.string().optional(),
    }),
    message: message,
  });
  
  export type MessageBody = z.infer<typeof MessageBody>;
  
  const messageEvent = z.object({
    mid: z.string(),
    text: z.string().optional(),
    quick_reply: z.object({
      payload: z.string(),
    }).optional(),
    reply_to: z.object({
      mid: z.string(),
    }).optional(),
    // TODO(techiejd): Flesh out the attachments. Could be useful for PoHW.
    attachments: z.object({}).array().optional(),
  });
  
  export type MessageEvent = z.infer<typeof messageEvent>;
  
  export const optInEvent = z.object({
    type: z.enum(['notification_messages']),
    // payload is string definable by us and only have one value at the moment
    payload: z.enum(['Accept.Notifications']),
    notification_messages_timezone: z.enum(['UTC']),
    token_expiry_timestamp: z.number(),
    notification_messages_token: z.string(),
    // Also 'WEEKLY', 'MONTHLY' possible and only have one value at the moment
    notification_messages_frequency: z.enum(['DAILY']),
    user_token_status: z.enum(['REFRESHED', 'NOT_REFRESHED']),
    notification_messages_status:
      z.enum(['STOP NOTIFICATIONS', 'RESUME NOTIFICATIONS']).optional(),
  });
  
  export type OptInEvent = z.infer<typeof optInEvent>;
  
  const postbackEvent = z.object({
    title: z.string(),
    payload: z.string(),
  });
  
  export type PostbackEvent = z.infer<typeof postbackEvent>;
  
  export const event = z.object({
    sender: z.object({
      id: z.string(),
    }),
    recipient: z.object({
      id: z.string(),
    }),
    timestamp: z.number(),
    message: messageEvent.optional(),
    postback: postbackEvent.optional(),
    optin: optInEvent.optional(),
  });
  
  export type Event = z.infer<typeof event>;
}

export namespace WhatsApp {
  export const message = z.object({
    body: z.string(),
  });
  export type Message = z.infer<typeof message>;
  export const messageBody = z.object({
    messaging_product: z.literal("whatsapp"),
    to: z.string(),
    text: message
  })
  export type MessageBody = z.infer<typeof messageBody>;
}


export const reqBody = z.object({
  object: z.string(),
  entry: z.object({
    id: z.string(),
    time: z.number(),
    messaging: Messenger.event.array().optional(),
  }).array(),
});

export type ReqBody = z.infer<typeof reqBody>;

export const asidResBody = z.object({
  data: z.object({
    id: z.string(),
    app: z.object({
      // All of the following are free form strings.
      // But since we're parsing for our app only,
      // we use enums of our values.
      category: z.enum(['Games']),
      link: z.enum(['https://onewe.tech/']),
      name: z.enum(['OneWe Test App']),
      id: z.enum(['344615061200701']),
    }),
  }).array(),
});

export const facebookResponse = z.object({
  data: z.any(),
})

/** Utils class for dealing with fb <-> dialogflow */
export class DialogFlow {
  private static _originalRequest = z.object({
    payload: z.object({
      data: Messenger.event,
    }),
  });

  /**
   *
   * @param {unknown} originalRequestJSON
   * @return {string} The user's senderID
   */
  static parseForSenderID = (originalRequestJSON: unknown) => {
    const fbOGRequest = DialogFlow._originalRequest.parse(originalRequestJSON);
    const senderID = fbOGRequest.payload.data.sender.id;
    return senderID;
  };
}
