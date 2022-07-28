import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VoteStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string([
      rules.trim(),
      rules.maxLength(255),
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
        gmailRemoveSubaddress: true,
        icloudRemoveSubaddress: true,
        outlookdotcomRemoveSubaddress: true,
        yahooRemoveSubaddress: true,
      }),
      rules.unique({
        table: 'votes',
        column: 'email',
      }),
    ]),
    acceptClassement: schema.boolean.optional(),
    acceptActivities: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'association_id.exists': "Cette association n'existe pas",
    'email.required': 'Un email est requis',
    'email.maxLength': "L'email ne doit pas dépasser 255 caractères",
    'email.email': "Cet email n'est pas valide",
    'email.unique': 'Cet email est déjà utilisé',
    'accept_classement.boolean': 'Cette option doit être un booléen',
    'accept_activities.boolean': 'Cette option doit être un booléen',
  }
}
