import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Participation from 'App/Models/Participation'
import Association from 'App/Models/Association'
import Year from 'App/Models/Year'
import StoreParticipationValidator from 'App/Validators/StoreParticipationValidator'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import UpdateParticipationValidator from 'App/Validators/UpdateParticipationValidator'
import UpdateParticipationImageValidator from 'App/Validators/UpdateParticipationImageValidator'
import UpdateParticipationDocumentValidator from 'App/Validators/UpdateParticipationDocumentValidator'
import Trophy from 'App/Models/Trophy'
import Category from 'App/Models/Category'

export default class ParticipationsController {
  public async index({ view, request }) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const qs = request.qs()

    // TODO: filters using years and associations

    const participations = await Participation.query()
      .select('id', 'description', 'yearId', 'associationId', 'image')
      .preload('year', (loader) => loader.select('year'))
      .preload('association', (loader) =>
        loader.select('name', 'schoolId').preload('school', (loader) => loader.select('name'))
      )
      .paginate(page, limit)

    participations.baseUrl('/participations')
    participations.queryString(qs)

    return view.render('participations/index', {
      participations,
    })
  }

  public async create({ view }: HttpContextContract) {
    const associations = await Association.query().orderBy('name', 'asc')
    const years = await Year.query().orderBy('year', 'asc')
    const trophies = await Trophy.query().orderBy('name', 'asc')
    const categories = await Category.query().orderBy('name', 'asc')

    return view.render('participations/create', {
      associations: associations.map((a) => {
        return { value: a.id, label: a.name }
      }),
      years: years.map((y) => {
        return { value: y.id, label: y.year }
      }),
      trophies: trophies.map((t) => {
        return { value: t.id, label: t.name }
      }),
      categories: categories.map((c) => {
        return { value: c.id, label: c.name }
      }),
    })
  }

  public async store({ request, response, logger }: HttpContextContract) {
    const { image, document, categoriesIds, ...data } = await request.validate(
      StoreParticipationValidator
    )

    const participation = new Participation()

    participation.merge(data)

    if (image) participation.image = Attachment.fromFile(image)
    if (document) participation.document = Attachment.fromFile(document)

    await participation.save()

    await participation.related('categories').sync(categoriesIds)

    logger.info('Participation stored', participation.id)

    return response.redirect().toRoute('ParticipationsController.show', { id: participation.id })
  }

  public async show({ view, request }: HttpContextContract) {
    const id = request.param('id')
    const participation = await Participation.findOrFail(id)

    await participation.load('association')
    await participation.load('year')

    await participation.loadCount('votes')

    return view.render('participations/show', {
      participation,
    })
  }

  public async edit({ view, request }: HttpContextContract) {
    const id = request.param('id')
    const participation = await Participation.query()
      .preload('categories')
      .where('id', id)
      .firstOrFail()

    await participation.load('association', (loader) => loader.select('name'))
    await participation.load('year', (loader) => loader.select('year'))

    const associations = await Association.query().orderBy('name', 'asc')
    const years = await Year.query().orderBy('year', 'asc')
    const trophies = await Trophy.query().orderBy('name', 'asc')
    const categories = await Category.query().orderBy('name', 'asc')

    return view.render('participations/edit', {
      participation,
      associations: associations.map((a) => {
        return { value: a.id, label: a.name }
      }),
      years: years.map((y) => {
        return { value: y.id, label: y.year }
      }),
      trophies: trophies.map((t) => {
        return { value: t.id, label: t.name }
      }),
      categories: categories.map((c) => {
        return { value: c.id, label: c.name }
      }),
    })
  }

  public async update({ request, response, logger }: HttpContextContract) {
    const id = request.param('id')
    const participation = await Participation.findOrFail(id)

    const { categoriesIds, ...data } = await request.validate(UpdateParticipationValidator)

    participation.merge(data)
    await participation.save()

    await participation.related('categories').sync(categoriesIds)

    logger.info('Participation updated', participation.id)

    return response.redirect().toRoute('ParticipationsController.show', { id: participation.id })
  }

  public async editImage({ request, view, logger }: HttpContextContract) {
    const id = request.param('id')
    const participation = await Participation.findOrFail(id)

    await participation.load('association')
    await participation.load('year')

    logger

    return view.render('participations/edit-image', { participation })
  }

  public async updateImage({ request, response, logger }: HttpContextContract) {
    const { image } = await request.validate(UpdateParticipationImageValidator)

    const id = request.param('id')
    const participation = await Participation.findOrFail(id)

    participation.image = image ? Attachment.fromFile(image) : null
    await participation.save()

    logger.info('Participation image updated', participation.id)

    return response.redirect().toRoute('ParticipationsController.show', { id: participation.id })
  }

  public async editDocument({ request, view }: HttpContextContract) {
    const id = request.param('id')
    const participation = await Participation.findOrFail(id)

    await participation.load('association')
    await participation.load('year')

    return view.render('participations/edit-document', { participation })
  }

  public async updateDocument({ request, response, logger }: HttpContextContract) {
    const { document } = await request.validate(UpdateParticipationDocumentValidator)

    const id = request.param('id')
    const participation = await Participation.findOrFail(id)

    participation.document = document ? Attachment.fromFile(document) : null
    await participation.save()

    logger.info('Participation document updated', participation.id)

    return response.redirect().toRoute('ParticipationsController.show', { id: participation.id })
  }

  public async destroy({ request, response, logger }: HttpContextContract) {
    const id = request.param('id')
    const participation = await Participation.findOrFail(id)

    await participation.delete()

    logger.info('Participation deleted', participation.id)

    return response.redirect().toRoute('ParticipationsController.idnex')
  }
}
