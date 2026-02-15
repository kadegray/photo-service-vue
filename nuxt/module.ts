import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  addComponent,
} from '@nuxt/kit'

export interface ModuleOptions {
  baseUrl: string
  tenantId: string | number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'photo-service-vue',
    configKey: 'photoService',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    baseUrl: '',
    tenantId: '',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.photoService = {
      baseUrl: options.baseUrl,
      tenantId: options.tenantId,
    }

    addPlugin(resolve('./runtime/plugin'))

    nuxt.options.css.push('photo-service-vue/style.css')

    const composables = [
      'usePhotos',
      'usePhoto',
      'useAlbums',
      'useAlbum',
      'useAlbumPhotos',
      'useTaxonomies',
      'useTaxonomy',
      'useTaxonomyTerms',
      'useTerms',
      'useTerm',
      'useTermPhotos',
    ]

    addImports(
      composables.map((name) => ({
        name,
        from: resolve(`./runtime/composables/${name}`),
      })),
    )

    const components = [
      'PhotoGallery',
      'PhotoDetail',
      'AlbumList',
      'AlbumDetail',
      'AlbumPhotos',
      'TaxonomyList',
      'TaxonomyDetail',
      'TaxonomyTerms',
      'TermList',
      'TermDetail',
      'TermPhotos',
    ]

    for (const name of components) {
      addComponent({
        name,
        export: name,
        filePath: 'photo-service-vue',
      })
    }
  },
})
