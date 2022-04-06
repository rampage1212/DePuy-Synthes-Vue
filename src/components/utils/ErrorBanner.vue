<template>
  <section v-if="message" class="px-2.5 py-2 bg-red-200 flex">
    <div>
      <header class="px-2 py-0.5 bg-red-500 text-white text-sm mr-2">
        {{ status }}
      </header>
    </div>
    <p class="break-normal">
      {{ message }}
    </p>
  </section>
</template>

<script>
export default {
  props: {
    status: {
      type: [String, Number],
      default: 'ERROR',
    },
    message: {
      type: [String],
      default: '',
    },
  },
}
</script>
