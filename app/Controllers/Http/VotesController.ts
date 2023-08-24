import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Association from 'App/Models/Association'
import Vote from 'App/Models/Vote'
import Year from 'App/Models/Year'

export default class VotesController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const qs = request.qs()

    const votes = await Vote.filter(qs)
      .preload('participation', (loader) => {
        loader
          .select('id', 'associationId', 'yearId')
          .preload('year', (loader) => loader.select('year'))
          .preload('association', (loader) => loader.select('name', 'slug'))
      })
      .paginate(page, limit)

    votes.baseUrl('/votes')
    votes.queryString(qs)

    const associations = await Association.query().select('name', 'id').orderBy('name', 'asc')
    const years = await Year.query().select('year', 'id').orderBy('year', 'asc')

    return view.render('votes/index', {
      votes,
      associations: associations.map((s) => {
        return { value: s.id, label: s.name }
      }),
      years: years.map((s) => {
        return { value: s.id, label: s.year }
      }),
    })
  }

  public async checkEmail({ view }: HttpContextContract) {
    return view.render('votes/vote', {
      title: 'Pense à valider ta voix',
      subtitle:
        "Merci d'avoir voté ! Tu vas recevoir d'ici quelques instants un mail pour valider ta voix. Pense à regarder dans tes spams.",
    })
  }

  public async validated({ view }: HttpContextContract) {
    return view.render('votes/vote', {
      title: 'Ta voix est confirmée',
      subtitle: 'Merci ! Suis-nous sur les réseaux pour ne rien rater du Classement !',
    })
  }

  public async invalidated({ view }: HttpContextContract) {
    return view.render('votes/vote', {
      title: "Ce lien n'est pas valide",
      subtitle:
        "Tu peux réessayer en retournant sur la page de la participation de l'association !",
    })
  }

  public async alreadyVoted({ view }: HttpContextContract) {
    return view.render('votes/vote', {
      title: 'Tu as déjà voté cette année',
      subtitle:
        'Mais tu peux continuer à suivre le Classement sur ses réseaux et partager la plateforme !',
    })
  }

  public async disabled({ view }: HttpContextContract) {
    return view.render('votes/vote', {
      title: 'Le vote est désactivé',
      subtitle: 'Désolé ! Nous mettons tout en oeuvre pour le réactiver au plus vite !',
    })
  }

  public async closed({ view }: HttpContextContract) {
    return view.render('votes/vote', {
      title: 'Le vote est fermé',
      subtitle: 'Désolé, il est trop tard pour voter cette année !',
    })
  }

  public async limited({ view }: HttpContextContract) {
    return view.render('votes/vote', {
      title: 'Tu ne peux plus essayer de voter',
      subtitle:
        "Si tu penses que c'est une erreur, tu peux changer de connexion internet (passer du Wifi à la 4G ou inversement). Sinon, reviens un peu plus tard !",
    })
  }
}
