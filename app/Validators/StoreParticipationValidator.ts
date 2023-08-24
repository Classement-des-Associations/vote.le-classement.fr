import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'

export default class StoreParticipationValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    associationId: schema.number([rules.exists({ table: 'associations', column: 'id' })]),
    yearId: schema.number([rules.exists({ table: 'years', column: 'id' })]),
    trophyId: schema.number.optional([rules.exists({ table: 'trophies', column: 'id' })]),
    categoriesIds: schema
      .array([rules.distinct('*')])
      .members(schema.number([rules.exists({ table: 'categories', column: 'id' })])),
    description: schema.string([rules.trim(), rules.maxLength(4096)]),
    image: schema.file({
      extnames: ['png', 'jpg', 'jpeg', 'webp'],
    }),
    document: schema.file({
      extnames: ['pdf'],
    }),
  })

  public messages: CustomMessages = {
    'associationId.required': "L'association est requise",
    'associationId.exists': "Cette association n'existe pas",
    'yearId.required': "L'année est requise",
    'yearId.exists': "Cette année n'existe pas",
    'trophyId.exists': "Ce trophée n'existe pas",
    'description.required': 'La description est requise',
    'description.maxLength': 'La description ne doit pas dépasser 4096 caractères',
    'image.required': "L'image est requise",
    'image.extnames': "L'image doit être une image",
    'image.size': "L'image doit être inférieure à 500 Ko",
    'document.required': 'Le document est requis',
    'document.extnames': 'Le document doit être un fichier PDF',
    'categoriesIds.distinct': 'Toutes les catégories doivent être différentes',
    'categoriesIds.required': 'Les catégories sont requises',
    'categoriesIds.array': 'Les catégories doivent être un tableau',
    'categoriesIds.*.exists': "Une des catégories n'existe pas",
  }
}
