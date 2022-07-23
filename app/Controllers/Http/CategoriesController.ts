import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import CategoryStoreValidator from 'App/Validators/CategoryStoreValidator'
import CategoryUpdateValidator from 'App/Validators/CategoryUpdateValidator'

export default class CategoriesController {
  public async index({ view }: HttpContextContract) {
    const categories = await Category.all()

    return view.render('categories/index', { categories })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('categories/create')
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(CategoryStoreValidator)

    const category = await Category.create(data)

    return response.redirect().toRoute('CategoriesController.show', { id: category.slug })
  }

  @bind()
  public async show({ view }: HttpContextContract, category: Category) {
    return view.render('categories/show', { category })
  }

  @bind()
  public async edit({ view }: HttpContextContract, category: Category) {
    return view.render('categories/edit', { category })
  }

  @bind()
  public async update({ request, response }: HttpContextContract, category: Category) {
    const data = await request.validate(CategoryUpdateValidator)

    category.merge(data)
    await category.save()

    return response.redirect().toRoute('CategoriesController.show', { id: category.slug })
  }

  @bind()
  public async destroy({ response }: HttpContextContract, category: Category) {
    await category.delete()

    return response.redirect().toRoute('CategoriesController.index')
  }
}
