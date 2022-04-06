/*eslint-env node, jest, amd*/
import store from './setupStore.js'
import mockResources from '@/data/resources.json'

describe('resource store spec', () => {
  it('should get the default resources', () => {
    const storeResources = store.getters['resources/getResources']
    expect(storeResources).toEqual(JSON.parse(JSON.stringify(storeResources)))
  })
  it('should get the default downloaded state', () => {
    const downloaded = store.getters['resources/getDownload']
    expect(downloaded).toEqual([])
  })
  it('should get the default resourcesPerTag', () => {
    const tag = 'Map Stakeholders'
    const downloaded = store.getters['resources/resourcesPerTag'](tag)
    const all = JSON.parse(JSON.stringify(mockResources))
    const res = [].concat(
      ...all.map((folder) =>
        folder.data.map((resource) => ({
          ...resource,
          folderID: folder.folderID,
        })),
      ),
    )
    const perTag = res.filter((r) => r.tags?.includes(tag))
    expect(downloaded).toEqual(perTag)
  })

  it('should get resources PerUrls', () => {
    const urls = ['update-presentation']
    const downloaded = store.getters['resources/resourcesPerUrls'](urls)
    const all = JSON.parse(JSON.stringify(mockResources))
    const res = [].concat(
      ...all.map((folder) =>
        folder.data.map((resource) => ({
          ...resource,
          folderID: folder.folderID,
        })),
      ),
    )
    const perUrl = res
      .filter((resource) => resource.displayInUrls?.length > 0)
      .filter((resource) => {
        let urlFound = true
        resource.displayInUrls.forEach((displayInUrl) => {
          if (!urls.includes(displayInUrl)) urlFound = false
        })
        return urlFound
      })
    expect(downloaded).toEqual(perUrl)
  })
  it('should set download', () => {
    const payload = {
      folder_id: 1,
      downloaded: {
        id: '2',
        filename: 'Optimizer',
        externalUrl: 'https://optimizer.jnj.com/Optimizer/#/home',
        favorite: false,
      },
    }
    store.commit('resources/setDownload', payload)
    const download = store.getters['resources/getDownload']
    expect(download).toEqual([payload])
    // its should not add twice
    store.commit('resources/setDownload', payload)
    const downloadTwice = store.getters['resources/getDownload']
    expect(downloadTwice).toEqual([payload])
  })
  it('should setFavorite', () => {
    const payload = {
      folder_id: 0,
      file_id: 1,
    }
    const resources = store.getters['resources/getResources']
    const folder = resources.find((f) => f.folderID == payload.folder_id + 1)
    const data = folder.data.find((d) => d.id === payload.file_id + 1 + '')
    expect(data.favorite).toEqual(false)

    store.commit('resources/setFavorite', payload)

    expect(data.favorite).toEqual(true)
  })
})
