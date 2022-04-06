<template>
  <router-link
    v-slot="{ isActive }"
    class="menu-item"
    active-class="menu-item-active"
    :to="{ name: `${item.pathName}` }"
  >
    <div
      :class="isActive ? 'border-theme-primary rounded-r-md' : 'border-white'"
      class="flex border-2"
    />
    <div class="flex py-2 px-5">
      <div class="tooltip-box" :class="!sideMenuShown ? 'mb-1' : ''">
        <SvgIcon
          class="w-5 h-5 mr-1"
          :class="isActive ? 'text-theme-primary' : 'text-gray-425'"
          :name="item.icon"
        />
        <div
          v-if="!sideMenuShown"
          class="tooltip"
          :class="!sideMenuShown ? 'py-0' : ''"
        >
          {{ item.title }}
        </div>
      </div>
      <p v-if="sideMenuShown" class="pl-5">{{ item.title }}</p>
    </div>
  </router-link>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const route = useRoute()
    const sideMenuShown = computed(
      () =>
        route.name !== 'builder' &&
        route.name !== 'new-presentation' &&
        route.name !== 'update-presentation',
    )

    return {
      sideMenuShown,
    }
  },
}
</script>

<style lang="postcss" scoped>
.menu-item {
  @apply flex text-gray-900 text-base;
}
.menu-item-active {
  @apply text-theme-primary font-bold;
}

.tooltip-box {
  position: relative;
  display: inline-block;
}

.tooltip {
  @apply w-max px-1;
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  border-radius: 2px;
  bottom: 15%;
  left: 200%;
  margin-left: -20px;
  opacity: 0;
  transition: opacity 1s;
  position: absolute;
  z-index: 50;
  background: #39383a;
}
.tooltip-box:hover .tooltip {
  opacity: 0.7;
}

.tooltip::after {
  content: ' ';
  position: absolute;
  display: flex;
  /* top: 0; */
  left: 0;
  bottom: 20%;
  margin-left: -10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent #39383a transparent transparent;
}
</style>
