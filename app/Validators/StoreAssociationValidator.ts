import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreAssociationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string([
      rules.trim(),
      rules.maxLength(255),
      rules.unique({
        table: 'associations',
        column: 'name',
      }),
    ]),
    facebook: schema.string.optional([rules.trim(), rules.maxLength(255), rules.url()]),
    twitter: schema.string.optional([rules.trim(), rules.maxLength(255), rules.url()]),
    instagram: schema.string.optional([rules.trim(), rules.maxLength(255), rules.url()]),
    linkedin: schema.string.optional([rules.trim(), rules.maxLength(255), rules.url()]),
    tiktok: schema.string.optional([rules.trim(), rules.maxLength(255), rules.url()]),
    youtube: schema.string.optional([rules.trim(), rules.maxLength(255), rules.url()]),
    website: schema.string.optional([rules.trim(), rules.maxLength(255), rules.url()]),
    schoolId: schema.number([rules.exists({ table: 'schools', column: 'id' })]),
  })

  public messages: CustomMessages = {
    'name.required': 'Le nom est requis',
    'name.maxLength': 'Le nom ne doit pas dépasser 255 caractères',
    'name.unique': 'Ce nom est déjà utilisé',
    'facebook.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'facebook.url': "L'url n'est pas valide",
    'twitter.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'twitter.url': "L'url n'est pas valide",
    'instagram.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'instagram.url': "L'url n'est pas valide",
    'linkedin.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'linkedin.url': "L'url n'est pas valide",
    'website.maxLength': "L'url ne doit pas dépasser 255 caractères",
    'website.url': "L'url n'est pas valide",
    'schoolId.required': "L'école est requise",
    'schoolId.exists': "Cette école n'existe pas",
  }
}
