import { z } from 'zod'

/** Only the fields we rely on. Listmonk returns many more; unknown keys are dropped. */

export const envelope = <T extends z.ZodTypeAny>(data: T) => z.object({ data })

export const paged = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.object({
      results: z.array(item),
      total: z.number(),
      per_page: z.union([z.number(), z.string()]).optional(),
      page: z.number().optional(),
    }),
  })

export const subscriptionSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  subscription_status: z.enum(['unconfirmed', 'confirmed', 'unsubscribed']).optional(),
  subscription_updated_at: z.string().optional(),
})

export const subscriberSchema = z.object({
  id: z.number(),
  uuid: z.string().optional(),
  email: z.string(),
  name: z.string().optional().default(''),
  status: z.enum(['enabled', 'disabled', 'blocklisted']),
  attribs: z.record(z.string(), z.unknown()).nullish().transform((v) => v ?? {}),
  lists: z.array(subscriptionSchema).nullish().transform((v) => v ?? []),
  updated_at: z.string().optional(),
})
export type ListmonkSubscriber = z.infer<typeof subscriberSchema>

export const listSchema = z.object({
  id: z.number(),
  uuid: z.string().optional(),
  name: z.string(),
  type: z.string().optional(),
  optin: z.string().optional(),
  status: z.string().optional(),
  subscriber_count: z.number().optional(),
})
export type ListmonkList = z.infer<typeof listSchema>

export const templateSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  is_default: z.boolean().optional(),
  body: z.string().optional(),
})
export type ListmonkTemplate = z.infer<typeof templateSchema>

export const campaignStatusSchema = z.enum(['draft', 'scheduled', 'running', 'paused', 'cancelled', 'finished'])
export type ListmonkCampaignStatus = z.infer<typeof campaignStatusSchema>

export const campaignSchema = z.object({
  id: z.number(),
  uuid: z.string().optional(),
  name: z.string().optional(),
  subject: z.string().optional(),
  status: campaignStatusSchema,
  to_send: z.number().optional().default(0),
  sent: z.number().optional().default(0),
  views: z.number().optional().default(0),
  clicks: z.number().optional().default(0),
  bounces: z.number().optional().default(0),
  send_at: z.string().nullish(),
  started_at: z.string().nullish(),
  updated_at: z.string().optional(),
})
export type ListmonkCampaign = z.infer<typeof campaignSchema>

export const bounceSchema = z.object({
  id: z.number(),
  type: z.string(),
  source: z.string().optional(),
  email: z.string(),
  subscriber_id: z.number().optional(),
  created_at: z.string().optional(),
  campaign: z.object({ id: z.number().optional(), name: z.string().optional() }).nullish(),
})
export type ListmonkBounce = z.infer<typeof bounceSchema>

export const analyticsRowSchema = z.object({
  campaign_id: z.number().optional(),
  count: z.number(),
  timestamp: z.string().optional(),
  url: z.string().optional(),
})
