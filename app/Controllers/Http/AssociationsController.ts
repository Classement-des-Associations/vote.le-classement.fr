import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Association from 'App/Models/Association'
import School from 'App/Models/School'
import Year from 'App/Models/Year'
import StoreAssociationValidator from 'App/Validators/StoreAssociationValidator'
import UpdateAssociationValidator from 'App/Validators/UpdateAssociationValidator'

export default class AssociationsController {
  public async index({ request, view }: HttpContextContract) {
    const associations = await Association.filter(request.qs())
      .withCount('participations')
      .preload('school')

    const schools = await School.query().orderBy('name', 'asc')

    return view.render('associations/index', {
      associations,
      schools: schools.map((s) => {
        return { value: s.id, label: s.name }
      }),
    })
  }

  public async create({ view }: HttpContextContract) {
    const schools = await School.query().orderBy('name', 'asc')

    return view.render('associations/create', {
      schools: schools.map((s) => {
        return { value: s.id, label: s.name }
      }),
    })
  }

  public async store({ request, response, logger }: HttpContextContract) {
    const data = await request.validate(StoreAssociationValidator)

    const association = new Association()

    association.merge(data)
    await association.save()

    logger.info('New association created', association.slug)

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async show({ view }: HttpContextContract, association: Association) {
    await association.load((loader) => {
      loader.preload('school')
      loader.preload('participations', (loader) => loader.preload('year').preload('association'))
    })

    const currentYear = await Year.query().orderBy('year', 'desc').firstOrFail()

    return view.render('associations/show', {
      association,
      year: currentYear,
    })
  }

  @bind()
  public async edit({ view }: HttpContextContract, association: Association) {
    const schools = await School.query().orderBy('name', 'asc')

    return view.render('associations/edit', {
      association,
      schools: schools.map((s) => {
        return {
          value: s.id,
          label: s.name,
        }
      }),
    })
  }

  @bind()
  public async update(
    { request, response, logger }: HttpContextContract,
    association: Association
  ) {
    const data = await request.validate(UpdateAssociationValidator)

    association.merge(data)
    await association.save()

    logger.info('Association updated', association.slug)

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async destroy({ response, logger }: HttpContextContract, association: Association) {
    await association.delete()

    logger.info('Association deleted', association.slug)

    return response.redirect().toRoute('AssociationsController.index')
  }
}
