import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import School from 'App/Models/School'
import SchoolStoreValidator from 'App/Validators/SchoolStoreValidator'

export default class SchoolsController {
  public async index({ view }: HttpContextContract) {
    const schools = await School.all()

    return view.render('schools/index', { schools })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('schools/create')
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(SchoolStoreValidator)

    const school = await School.create(data)

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
  public async update({ request, response }: HttpContextContract, school: School) {
    const data = await request.validate(SchoolStoreValidator)

    school.merge(data)
    await school.save()

    return response.redirect().toRoute('SchoolsController.show', { id: school.slug })
  }

  @bind()
  public async destroy({ response }: HttpContextContract, school: School) {
    await school.delete()

    return response.redirect().toRoute('SchoolsController.index')
  }
}
