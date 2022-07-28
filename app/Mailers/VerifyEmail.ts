import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'

export default class VerifyEmail extends BaseMailer {
  constructor(private email: string, private signedUrl: string) {
    super()
  }

  public async prepare(message: MessageContract) {
    const html = await View.render('emails/verify-email', { signedUrl: this.signedUrl })

    message
      .subject('Valide ton vote - Le Classement des Associations ✨')
      .from('no-reply@le-classement.fr')
      .to(this.email)
      .html(html)
  }
}
