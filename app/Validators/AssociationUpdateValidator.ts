import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AssociationUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([
      rules.required(),
      rules.trim(),
      rules.maxLength(255),
      rules.unique({
        table: 'associations',
        column: 'name',
        whereNot: {
          slug: this.ctx.params.id,
        },
      }),
    ]),
    description: schema.string.nullable([rules.trim(), rules.maxLength(4096)]),
    facebook: schema.string.nullable([rules.trim(), rules.maxLength(255), rules.url()]),
    twitter: schema.string.nullable([rules.trim(), rules.maxLength(255), rules.url()]),
    instagram: schema.string.nullable([rules.trim(), rules.maxLength(255), rules.url()]),
    linkedin: schema.string.nullable([rules.trim(), rules.maxLength(255), rules.url()]),
    tiktok: schema.string.nullable([rules.trim(), rules.maxLength(255), rules.url()]),
    youtube: schema.string.nullable([rules.trim(), rules.maxLength(255), rules.url()]),
    website: schema.string.nullable([rules.trim(), rules.maxLength(255), rules.url()]),
    schoolId: schema.number.optional([rules.exists({ table: 'schools', column: 'id' })]),
    categoryId: schema.number.optional([rules.exists({ table: 'categories', column: 'id' })]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'name.required': 'Le nom est requis',
    'name.maxLength': 'Le nom ne doit pas dépasser 255 caractères',
    'name.unique': 'Ce nom est déjà utilisé',
    'description.maxLength': 'La description ne doit pas dépasser 4096 caractères',
    'facebook.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'twitter.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'instagram.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'linkedin.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'website.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'schoolId.exists': "Cette école n'existe pas",
    'categoryId.exists': "Cette catégorie n'existe pas",
  }
}
