import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssociationImageUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    image: schema.file.optional({
      extnames: ['png', 'jpg', 'jpeg', 'webp'],
    }),
  })

  public messages: CustomMessages = {
    'image.extnames': "L'image doit être une image",
    'image.size': "L'image doit être inférieure à 500 Ko",
  }
}
