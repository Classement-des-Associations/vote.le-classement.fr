import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssociationDocumentUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    document: schema.file.optional({
      extnames: ['pdf'],
    }),
  })

  public messages: CustomMessages = {
    'document.extnames': 'Le document doit être un fichier PDF',
  }
}
