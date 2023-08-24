import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateYearValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    year: schema.string([
      rules.trim(),
      rules.maxLength(255),
      rules.escape(),
      rules.unique({ table: 'years', column: 'year', whereNot: { slug: this.ctx.params.id } }),
    ]),
  })

  public messages: CustomMessages = {
    'year.required': 'Un nom est requis',
    'year.maxLength': 'Le nom ne doit pas dépasser 255 caractères',
    'year.unique': 'Ce nom est déjà utilisé',
  }
}
