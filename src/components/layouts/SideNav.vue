<template>
  <div
    v-if="!sideMenuShown"
    class="flex-none w-70 bg-white p-6 mb-4"
    :class="isBuilder ? 'absolute z-30 w-60 mt-0 ml-0 shadow' : 'mt-8 ml-8'"
  >
    <SideNavStep
      v-for="step in steps"
      :key="step"
      :step-info="step.stepInfo"
      :page-name="step.pageLinkLists"
    />
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from '@vue/runtime-core'
import SideNavStep from '@/components/dashboard/SideNavStep.vue'

const steps = [
  {
    stepInfo: {
      stepNumber: 'Step 1',
      stepName: 'Collaboration',
    },
    pageLinkLists: [
      {
        pageNumber: 1,
        pageName: 'Customer Information',
      },
      {
        pageNumber: 2,
        pageName: 'The Team',
      },
      {
        pageNumber: 3,
        pageName: 'The Customer',
      },
      {
        pageNumber: 4,
        pageName: 'The Discovery',
      },
      {
        pageNumber: 5,
        pageName: 'The Contract',
      },
    ],
  },
  {
    stepInfo: {
      stepNumber: 'Step 2',
      stepName: 'Slide Preperation',
    },
    pageLinkLists: [
      {
        pageNumber: 6,
        pageName: 'The Presentation',
      },
      {
        pageNumber: 7,
        pageName: 'Overview',
      },
    ],
  },
  {
    stepInfo: {
      stepNumber: 'Step 3',
      stepName: 'Slide Selection',
    },
    pageLinkLists: [
      {
        pageNumber: 8,
        pageName: 'Slide Selection',
      },
    ],
  },
  {
    stepInfo: {
      stepNumber: 'Step 4',
      stepName: 'Slide Builder',
    },
    pageLinkLists: [
      {
        pageNumber: 9,
        pageName: 'Edit Slide',
      },
    ],
  },
  {
    stepInfo: {
      stepNumber: 'Step 5',
      stepName: 'Generate Link',
    },
    pageLinkLists: [
      {
        pageNumber: 10,
        pageName: 'Edit Link',
      },
    ],
  },
]

export default {
  components: {
    SideNavStep,
  },
  setup() {
    const route = useRoute()
    const sideMenuShown = computed(
      () =>
        route.name !== 'builder' &&
        route.name !== 'new-presentation' &&
        route.name !== 'update-presentation',
    )
    const isBuilder = computed(() => route.name == 'builder')

    return {
      isBuilder,
      sideMenuShown,
      steps,
    }
  },
}
</script>
