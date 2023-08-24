import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StoreVoteValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string([
      rules.trim(),
      rules.maxLength(255),
      rules
        .email
        // @see https://github.com/adonisjs/validator/issues/154
        (),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
        gmailRemoveSubaddress: true,
        gmailConvertGooglemaildotcom: true,
        outlookdotcomRemoveSubaddress: true,
        yahooRemoveSubaddress: true,
        icloudRemoveSubaddress: true,
      }),
      rules.unique({
        table: 'votes',
        column: 'email',
        where: {
          year_id: this.ctx.resources.year.id,
        },
      }),
    ]),
    acceptClassement: schema.boolean.optional(),
    acceptPartners: schema.boolean.optional(),
  })

  public messages: CustomMessages = {
    'association_id.exists': "Cette association n'existe pas",
    'email.required': 'Un email est requis',
    'email.maxLength': "L'email ne doit pas dépasser 255 caractères",
    'email.email': "Cet email n'est pas valide",
    'email.unique': 'Vous avez déjà voté cette année',
    'accept_classement.boolean': 'Cette option doit être un booléen',
    'accept_activities.boolean': 'Cette option doit être un booléen',
  }
}
