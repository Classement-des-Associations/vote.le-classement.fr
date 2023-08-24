import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateParticipationValidator {
  constructor(protected ctx: HttpContextContract) {
    console.log(ctx.request.body())
  }

  public schema = schema.create({
    associationId: schema.number([rules.exists({ table: 'associations', column: 'id' })]),
    yearId: schema.number([rules.exists({ table: 'years', column: 'id' })]),
    trophyId: schema.number.optional([rules.exists({ table: 'trophies', column: 'id' })]),
    categoriesIds: schema
      .array([rules.distinct('*')])
      .members(schema.number([rules.exists({ table: 'categories', column: 'id' })])),
    description: schema.string.optional([rules.trim(), rules.maxLength(4096)]),
  })

  public messages: CustomMessages = {
    'associationId.required': "L'association est requise",
    'associationId.exists': "Cette association n'existe pas",
    'yearId.required': "L'année est requise",
    'yearId.exists': "Cette année n'existe pas",
    'trophyId.exists': "Ce trophée n'existe pas",
    'description.maxLength': 'La description ne doit pas dépasser 4096 caractères',
    'categoriesIds.distinct': 'Toutes les catégories doivent être différentes',
    'categoriesIds.required': 'Les catégories sont requises',
    'categoriesIds.array': 'Les catégories doivent être un tableau',
    'categoriesIds.*.exists': "Une des catégories n'existe pas",
  }
}
