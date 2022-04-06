<template>
  <router-link
    v-if="pageNumber == 7"
    :to="link"
    class="py-2 border border-solid border-red-500 text-center rounded-lg font-bold w-full"
    :class="
      currentStep >= 7 ? 'bg-red-500 text-white' : 'bg-white text-red-500'
    "
  >
    {{ list.pageName }}
  </router-link>
  <router-link v-else :to="link" class="flex items-center">
    <div :class="currentStep == pageNumber ? 'round_1' : 'round'">
      <input
        type="checkbox"
        disabled
        :checked="currentStep == pageNumber ? false : inputProgress"
      />
      <label class="border-solid border-4 border-light-blue-500"></label>
    </div>
    <p
      class="pl-3"
      :class="
        inputProgress || currentStep == pageNumber
          ? 'text-blue-800'
          : 'text-gray-300'
      "
    >
      {{ list.pageName }}
    </p>
  </router-link>
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    list: { type: Object, required: true },
  },
  setup(props) {
    const route = useRoute()
    const store = useStore()
    const pageNumber = computed(() => props.list.pageNumber)
    const currentStep = computed(() => {
      if (route.name == 'update-presentation') return route.params.step
      else if (route.name == 'builder') return 9
      else return 1
    })
    const presentationId = computed(() => route.params.presentationId || 'new')

    const wizardSteps = [
      'update_PRESENTATION',
      'internal_USER',
      'stakeholders',
      'discovery',
      'contract',
      'slideSelection',
      'overview',
      'slide_INFOS',
      'builders',
      'link',
    ]

    const inputProgress = computed(() =>
      store.getters['rfps/getInputProgressByPresentationId'](
        presentationId.value,
        wizardSteps[pageNumber.value - 1],
      ),
    )

    const link = computed(() =>
      pageNumber.value < 9
        ? {
            name: 'update-presentation',
            params: {
              presentationId: presentationId.value,
              step: pageNumber.value,
            },
          }
        : pageNumber.value == 10
        ? {
            name: 'create-link',
            params: {
              presentationId: presentationId.value,
            },
          }
        : {
            name: 'builder',
            params: {
              presentationId: presentationId.value,
              slideId: 'INTRO1',
            },
          },
    )

    return {
      currentStep,
      pageNumber,
      link,
      inputProgress,
    }
  },
}
</script>

<style scoped>
.round {
  position: relative;
  height: 15px;
  margin-bottom: 3px;
}

.round label {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  height: 16px;
  left: 0;
  position: absolute;
  top: 0;
  width: 16px;
}

.round label:after {
  border: 2px solid #fff;
  border-top: none;
  border-right: none;
  content: '';
  height: 7px;
  left: 2px;
  opacity: 0;
  position: absolute;
  top: 2px;
  transform: rotate(-45deg);
  width: 10px;
}

.round input[type='checkbox'] {
  visibility: hidden;
}
.round_1 label {
  background-color: white;
  border: 1px solid #005cc8;
  border-radius: 50%;
  cursor: pointer;
  height: 16px;
  left: 0;
  position: absolute;
  top: 0;
  width: 16px;
}

.round_1 label:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #005cc8;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}
.round input[type='checkbox']:checked + label {
  background-color: #4caf50;
  border-color: #4caf50;
}

.round input[type='checkbox']:checked + label:after {
  opacity: 1;
}

.round_1 {
  position: relative;
  height: 15px;
  margin-bottom: 3px;
}

.round_1 input[type='checkbox'] {
  visibility: hidden;
}

.round_1 input[type='checkbox']:checked + label {
  background-color: #4caf50;
  border-color: #4caf50;
}

.round_1 input[type='checkbox']:checked + label:after {
  opacity: 1;
}
</style>
