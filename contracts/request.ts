declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    hasBotFieldEmpty(field?: string): boolean
  }
}
