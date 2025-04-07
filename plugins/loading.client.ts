export default defineNuxtPlugin((nuxtApp) => {
  const loading = useState('loading', () => false)

  console.log('[PLUGIN] Loaded loading.client.ts') 

  nuxtApp.hook('page:start', () => {
    console.log('[PLUGIN] Page start')
    loading.value = true
  })

  nuxtApp.hook('page:finish', () => {
    console.log('[PLUGIN] Page finish')
    setTimeout(() => {
      loading.value = false
    }, 100) 
  })
})
