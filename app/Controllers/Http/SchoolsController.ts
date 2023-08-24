import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import School from 'App/Models/School'
import SchoolStoreValidator from 'App/Validators/SchoolStoreValidator'

export default class SchoolsController {
  public async index({ view }: HttpContextContract) {
    const schools = await School.query().orderBy('name', 'asc')

    return view.render('schools/index', { schools })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('schools/create')
  }

  public async store({ request, response, logger }: HttpContextContract) {
    const data = await request.validate(SchoolStoreValidator)

    const school = await School.create(data)

    logger.info('New school created', school.slug)

    return response.redirect().toRoute('SchoolsController.show', { id: school.slug })
  }

  @bind()
  public async show({ view }: HttpContextContract, school: School) {
    return view.render('schools/show', { school })
  }

  @bind()
  public async edit({ view }: HttpContextContract, school: School) {
    return view.render('schools/edit', { school })
  }

  @bind()
  public async update({ request, response, logger }: HttpContextContract, school: School) {
    const data = await request.validate(SchoolStoreValidator)

    school.merge(data)
    await school.save()

    logger.info('School updated', school.slug)

    return response.redirect().toRoute('SchoolsController.show', { id: school.slug })
  }

  @bind()
  public async destroy({ response, logger }: HttpContextContract, school: School) {
    await school.delete()

    logger.info('School deleted', school.slug)

    return response.redirect().toRoute('SchoolsController.index')
  }
}
