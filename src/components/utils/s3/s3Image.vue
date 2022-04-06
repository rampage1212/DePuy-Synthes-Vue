<template>
  <img v-if="src" :src="src" class="align-middle" />
</template>

<script>
import { computed, ref } from '@vue/reactivity'
import { getFile } from '@/api/httpClient.js'
import { onMounted, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
  props: {
    s3Directory: {
      type: String,
      required: true,
    },
    s3FileName: {
      type: String,
      required: true,
    },
  },
  emits: ['imageFetched', 'imageNotFound', 'imageLoadError'],
  setup(props, { emit }) {
    const store = useStore()
    const src = ref('')

    const s3Path = computed(() => `${props.s3Directory}${props.s3FileName}`)
    const imageIsUploadedLast = computed(
      () => store.getters['auth/s3LastUploadedPath'] === s3Path.value,
    )

    async function getImage() {
      src.value = ''
      try {
        const { err } = await store.dispatch('auth/fetchUserDetail', false)
        if (err) throw err

        if (!props.s3FileName || !props.s3Directory) return

        const s3File = await getFile(props.s3FileName, props.s3Directory)
        if (typeof s3File === 'string') {
          const s3Response = await fetch(s3File)
          if (s3Response.status !== 200)
            throw { status: s3Response.status, link: s3File }
        }

        src.value = s3File

        if (s3File) emit('imageFetched', src.value)
      } catch (err) {
        if (err.status === 404) {
          emit('imageNotFound')
        } else {
          console.error('get image: ', err)
        }
        emit('imageLoadError')
      }
    }

    onMounted(getImage)

    watch(s3Path, (path, oldPath) => {
      if (path !== oldPath) getImage()
    })

    watch(imageIsUploadedLast, () => {
      if (imageIsUploadedLast.value) getImage()
    })

    return { src, getImage }
  },
}
</script>
