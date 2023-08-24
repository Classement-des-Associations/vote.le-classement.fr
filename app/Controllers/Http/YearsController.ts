import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Year from 'App/Models/Year'
import StoreYearValidator from 'App/Validators/StoreYearValidator'
import UpdateYearValidator from 'App/Validators/UpdateYearValidator'

export default class YearsController {
  public async index({ view }: HttpContextContract) {
    const years = await Year.query().orderBy('year', 'desc')

    return view.render('years/index', { years })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('years/create')
  }

  public async store({ request, response, logger }: HttpContextContract) {
    const data = await request.validate(StoreYearValidator)

    const year = await Year.create(data)

    logger.info('New year created', year.slug)

    return response.redirect().toRoute('YearsController.show', { id: year.slug })
  }

  @bind()
  public async show({ view }: HttpContextContract, year: Year) {
    return view.render('years/show', { year })
  }

  @bind()
  public async edit({ view }: HttpContextContract, year: Year) {
    return view.render('years/edit', { year })
  }

  @bind()
  public async update({ request, response, logger }: HttpContextContract, year: Year) {
    const data = await request.validate(UpdateYearValidator)

    year.merge(data)
    await year.save()

    logger.info('Year updated', year.slug)

    return response.redirect().toRoute('YearsController.show', { id: year.slug })
  }

  @bind()
  public async destroy({ response, logger }: HttpContextContract, year: Year) {
    await year.delete()

    logger.info('Year deleted', year.slug)

    return response.redirect().toRoute('YearsController.index')
  }
}
