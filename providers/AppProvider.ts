import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  public static needsApplication = true

  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
    const Request = this.app.container.use('Adonis/Core/Request')

    Request.macro('hasBotFieldEmpty', function (field: string = 'bot-field') {
      return !this.ctx!.request.input(field)
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
