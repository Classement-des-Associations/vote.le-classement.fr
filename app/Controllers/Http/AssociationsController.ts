import { bind } from '@adonisjs/route-model-binding'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import Association from 'App/Models/Association'
import Category from 'App/Models/Category'
import School from 'App/Models/School'
import AssociationDocumentUpdateValidator from 'App/Validators/AssociationDocumentUpdateValidator'
import AssociationImageUpdateValidator from 'App/Validators/AssociationImageUpdateValidator'
import AssociationStoreValidator from 'App/Validators/AssociationStoreValidator'
import AssociationUpdateValidator from 'App/Validators/AssociationUpdateValidator'
import VoteStoreValidator from 'App/Validators/VoteStoreValidator'

export default class AssociationsController {
  public async index({ request, view }: HttpContextContract) {
    const associations = await Association.filter(request.qs())
      .withCount('votes')
      .preload('category')
      .preload('school')

    const categories = await Category.query().orderBy('name', 'asc')
    const schools = await School.query().orderBy('name', 'asc')

    return view.render('associations/index', {
      associations,
      categories: categories.map((c) => {
        return { value: c.id, label: c.name }
      }),
      schools: schools.map((s) => {
        return { value: s.id, label: s.name }
      }),
    })
  }

  public async create({ view }: HttpContextContract) {
    const categories = await Category.all()
    const schools = await School.all()

    return view.render('associations/create', { schools, categories })
  }

  public async store({ request, response }: HttpContextContract) {
    const { image, document, ...data } = await request.validate(AssociationStoreValidator)

    const association = new Association()

    association.merge(data)

    if (image) association.image = Attachment.fromFile(image)
    if (document) association.document = Attachment.fromFile(document)

    await association.save()

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async show({ view }: HttpContextContract, association: Association) {
    await association.load((loader) => {
      loader.preload('category')
      loader.preload('school')
    })

    await association.loadCount('votes')

    const relatedAssociations = await Association.query()
      .where('category_id', association.categoryId ?? 0)
      .where('id', '!=', association.id)
      .preload('school')
      .limit(3)
    return view.render('associations/show', { association, relatedAssociations })
  }

  @bind()
  public async edit({ view }: HttpContextContract, association: Association) {
    const categories = await Category.all()
    const schools = await School.all()

    return view.render('associations/edit', { association, schools, categories })
  }

  @bind()
  public async update({ request, response }: HttpContextContract, association: Association) {
    const data = await request.validate(AssociationUpdateValidator)

    association.merge(data)
    await association.save()

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async editImage({ view }: HttpContextContract, association: Association) {
    return view.render('associations/edit-image', { association })
  }

  @bind()
  public async updateImage({ request, response }: HttpContextContract, association: Association) {
    const { image } = await request.validate(AssociationImageUpdateValidator)

    association.image = image ? Attachment.fromFile(image) : null
    await association.save()

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async editDocument({ view }: HttpContextContract, association: Association) {
    return view.render('associations/edit-document', { association })
  }

  @bind()
  public async updateDocument(
    { request, response }: HttpContextContract,
    association: Association
  ) {
    const { document } = await request.validate(AssociationDocumentUpdateValidator)

    association.document = document ? Attachment.fromFile(document) : null
    await association.save()

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async destroy({ response }: HttpContextContract, association: Association) {
    await association.delete()

    return response.redirect().toRoute('AssociationsController.index')
  }

  @bind()
  public async sendEmailVote({ request, view }: HttpContextContract, association: Association) {
    const { email, acceptClassement, acceptActivities } = await request.validate(VoteStoreValidator)

    const signedUrl = Route.makeSignedUrl(
      'AssociationsController.vote',
      { id: association.slug, email },
      {
        qs: { acceptClassement, acceptActivities },
      }
    )

    await new VerifyEmail(email, signedUrl).sendLater()

    return view.render('vote/index', {
      title: 'Pense à valider ton vote',
      subtitle:
        "Merci d'avoir voté ! Tu vas recevoir d'ici quelques instant un mail pour valider ton vote.",
    })
  }

  @bind()
  public async vote(
    { request, params, view, logger }: HttpContextContract,
    association: Association
  ) {
    if (request.hasValidSignature()) {
      const { email } = params
      const { acceptClassement, acceptActivities } = request.qs()

      try {
        await association.related('votes').create({
          email,
          acceptClassement,
          acceptActivities,
        })
      } catch (error) {
        logger.error(error)
        logger.error(email)
        return view.render('vote/index', {
          title: 'Vous avez déjà voté pour cette association',
          subtitle: 'Mais tu peux continuer à suivre le Classement sur ses réseaux !',
        })
      }

      return view.render('vote/index', {
        title: 'Votre voix a été prise en compte',
        subtitle:
          "Merci d'avoir voté. Tu peux continuer à suivre le Classement via ses réseaux si tu le souhaites !",
      })
    }

    return view.render('vote/index', {
      title: "Ce lien n'est pas valide",
      subtitle: 'Tu peux réessayer en retournant sur la page de ton association !',
    })
  }
}
