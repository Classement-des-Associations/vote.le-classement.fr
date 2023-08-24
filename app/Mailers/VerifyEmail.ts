import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application'
import View from '@ioc:Adonis/Core/View'
import Env from '@ioc:Adonis/Core/Env'
import mjml2html from 'mjml'

export default class VerifyEmail extends BaseMailer {
  constructor(private email: string, private associationName: string, private signedUrl: string) {
    super()
  }

  public async prepare(message: MessageContract) {
    const mjml = await View.render('emails/verify-email', {
      signedUrl: this.signedUrl,
      associationName: this.associationName,
    })
    const html = mjml2html(mjml).html

    message
      .embed(Application.publicPath('images/mail_logo_classement.png'), 'mail_logo_classement')
      .embed(Application.publicPath('images/mail_linkedin.png'), 'mail_linkedin')
      .embed(Application.publicPath('images/mail_instagram.png'), 'mail_instagram')
      .subject('Valide ta voix - Le Classement des Associations')
      .from(
        Env.get('MAILER_EMAIL_ADDRESS') || 'no-reply@le-classement.fr',
        'Vote - Classement des Associations'
      )
      .replyTo('contact@le-classement.fr', 'Classement des Associations')
      .to(this.email)
      .html(html)
  }
}
