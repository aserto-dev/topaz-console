import { z } from 'zod'

import userAvatar from '../../assets/generic-user-avatar.svg'
import { V3ObjectProperties } from './directory'

const UserPropertiesSchema = z.object({
  email: z.string().optional(),
  picture: z
    .string()
    .optional()
    .default(userAvatar)
    .transform((v) => (v === '' ? userAvatar : v)),
})

type UserProperties = z.infer<typeof UserPropertiesSchema>

export type Ds0UserObject = {
  display_name?: string;
  email?: string;
  id?: string;
} & {
  properties: UserProperties
}

export const parseAsUserProperties = (target: V3ObjectProperties = {}): UserProperties =>
  UserPropertiesSchema.parse(target || {})
