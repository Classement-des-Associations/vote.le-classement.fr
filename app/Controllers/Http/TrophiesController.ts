import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Trophy from 'App/Models/Trophy'
import StoreTrophyValidator from 'App/Validators/StoreTrophyValidator'
import UpdateTrophyValidator from 'App/Validators/UpdateTrophyValidator'

export default class TrophiesController {
  public async index({ view }: HttpContextContract) {
    const trophies = await Trophy.query().orderBy('name', 'asc')

    return view.render('trophies/index', { trophies })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('trophies/create')
  }

  public async store({ request, response, logger }: HttpContextContract) {
    const data = await request.validate(StoreTrophyValidator)

    const trophy = await Trophy.create(data)

    logger.info('New trophy created', trophy.slug)

    return response.redirect().toRoute('TrophiesController.show', { id: trophy.slug })
  }

  @bind()
  public async show({ view }: HttpContextContract, trophy: Trophy) {
    return view.render('trophies/show', { trophy })
  }

  @bind()
  public async edit({ view }: HttpContextContract, trophy: Trophy) {
    return view.render('trophies/edit', { trophy })
  }

  @bind()
  public async update({ request, response, logger }: HttpContextContract, trophy: Trophy) {
    const data = await request.validate(UpdateTrophyValidator)

    trophy.merge(data)
    await trophy.save()

    logger.info('Trophy updated', trophy.slug)

    return response.redirect().toRoute('TrophiesController.show', { id: trophy.slug })
  }

  @bind()
  public async destroy({ response, logger }: HttpContextContract, trophy: Trophy) {
    await trophy.delete()

    logger.info('Trophy deleted', trophy.slug)

    return response.redirect().toRoute('TrophiesController.index')
  }
}
