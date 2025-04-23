import { Factory } from 'fishery'

import { faker } from '@faker-js/faker'

import { V3Object } from '../../types/directory'

export const ObjectFactory = Factory.define<V3Object>((params) => ({
  display_name: params.params.display_name || faker.person.fullName(),
  id: params.params.id || faker.string.uuid(),
  properties: params.params.properties || {},
  type: params.params.type || faker.word.sample(),
}))
