export default class ParticipationsController {
  public async index({ view }) {
    return view.render('participations/index')
  }
}
