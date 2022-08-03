/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'

Mail.monitorQueue((error, result) => {
  if (error) {
    Logger.error('Unable to send email')
    Logger.error(error.name + ': ' + error.message)
    return
  }

  Logger.info(`Email sent to ${result?.response?.envelope?.to}`)
})
