import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([
      rules.required(),
      rules.trim(),
      rules.maxLength(255),
      rules.escape(),
      rules.unique({ table: 'categories', column: 'name' }),
    ]),
  })

  public messages: CustomMessages = {
    'name.required': 'Un nom est requis',
    'name.maxLength': 'Le nom ne doit pas dépasser 255 caractères',
    'name.unique': 'Ce nom est déjà utilisé',
  }
}
