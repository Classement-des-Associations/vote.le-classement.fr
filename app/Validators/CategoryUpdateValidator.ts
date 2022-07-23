import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [
      rules.required(),
      rules.maxLength(255),
      rules.unique({ table: 'categories', column: 'name', whereNot: { slug: this.ctx.params.id } }),
    ]),
  })

  public messages: CustomMessages = {}
}
