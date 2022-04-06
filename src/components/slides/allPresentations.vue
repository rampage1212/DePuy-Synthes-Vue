<template>
  <component
    :is="slide"
    v-for="(slide, index) in slideComponents"
    :key="index"
    data-background-color="white"
    :is-animated="allowAnimations"
    :is-pdf-view="isPdfView"
  />
  <div v-if="allSlidesAreDisabled" class="flex w-full h-full">
    <p class="m-auto text-3xxl">No Slides Are Enabled In This Presentation</p>
  </div>
</template>

<script>
import IntroductionSlide from '@/components/slides/1.IntroductionSlide.vue'
import AboutDepuySynthes from '@/components/slides/introduction/AboutDePuySynthes.vue'
import AboutDepuySynthesSecond from '@/components/slides/introduction/AboutDepuySynthesSecond.vue'
import TraumaChallanges from '@/components/slides/introduction/TraumaChallenges.vue'
import AboutJandJSlide from '@/components/slides/introduction/AboutJAndJ.vue'
import TrumaTableBySiteOfCare1 from '@/components/slides/introduction/TrumaTableBySiteOfCare1.vue'
import TrumaTableBySiteOfCare2 from '@/components/slides/introduction/TrumaTableBySiteOfCare2.vue'
import TrumaTableBySiteOfCare3 from '@/components/slides/introduction/TrumaTableBySiteOfCare3.vue'
import TrumaTableBySiteOfCare4 from '@/components/slides/introduction/TrumaTableBySiteOfCare4.vue'
import SurgeonPlanSlide from '@/components/slides/2.SurgeonPlan.vue'
import PartnershipSlide from '@/components/slides/3.PartnershipHub.vue'
import TrainingPlanWithCalnder from '@/components/slides/4.TrainingPlanWithCalender.vue'
import SavingSummary from '@/components/slides/5.SavingSummary.vue'
import Esims from '@/components/slides/savings/EsimsSlide.vue'
import TraumaAnalysisToolDemo from '@/components/slides/savings/TraumaAnalysisToolDemo.vue'
import UniversalSmallFrag11 from '@/components/slides/savings/UniversalSmallFrag11.vue'
import SynthesTraumaSlide from '@/components/slides/17.SynthesTrauma.vue'
import ProceduralEfficiencySlide from '@/components/slides/22.ProceduralEfficiency.vue'
import InstrumentWarrantySlide from '@/components/slides/42.InstrumentWarranty.vue'
import WhatIsTheAOSlide from '@/components/slides/43.WhatIsTheAO.vue'
import ResearchInnovationEducationSlide from '@/components/slides/44.ResearchInnovationEducation.vue'
import HipFractureCareSlide from '@/components/slides/45.HipFractureCare.vue'
import HipFractureCareProgramSlide from '@/components/slides/46.HipFractureCareProgram.vue'
import ReadyForAnythingSlide from '@/components/slides/53.ReadyForAnything.vue'
import CompleteSolutionsSlide from '@/components/slides/54.CompleteSolutions.vue'
import BroadPortfolioSlide from '@/components/slides/55.BroadPortfolio.vue'
import InnovationTimelineSlide from '@/components/slides/56.InnovationTimeline.vue'
import DataObsAndPotSav03 from '@/components/slides/DataObsAndPotSav03.vue'
import OrthopedicTraumaSpend04 from '@/components/slides/OrthopedicTraumaSpend04.vue'
import AdvantagesSimplifiedPortfolio06 from '@/components/slides/AdvantagesSimplifiedPortfolio06.vue'
import sav15 from '@/components/slides/sav-15.vue'
import ReusableSterilizationContainer09 from '@/components/slides/ReusableSterilizationContainer09.vue'
import ProposedSolutions14 from '@/components/slides/ProposedSolutions14.vue'
import ProPakSlide from '@/components/slides/57.Pro-PakConstructs.vue'
import DecisionGroupSlide from '@/components/slides/60.DecisionGroup.vue'
import PriceTrackSlide from '@/components/slides/61.PriceTrack.vue'
import SynthesProPakSlide from '@/components/slides/58.SynthesProPak.vue'
import RobustTraumaPortfolioSlide from '@/components/slides/52.RobustTraumaPortfolio.vue'
import FutureLeadersSlide from '@/components/slides/49.FutureLeaders.vue'
import ProfessionalEductionSlide from '@/components/slides/48.ProfessionalEduction.vue'
import IndustryFieldSlide from '@/components/slides/0.IndustryField.vue'
import Sav10Slide from '@/components/slides/sav-10.vue'
import Sav12Slide from '@/components/slides/sav-12.vue'
import Sav21Slide from '@/components/slides/sav-21.vue'
import Sav22Slide from '@/components/slides/sav-22.vue'
import Sav23Slide from '@/components/slides/sav-23.vue'
import Sav25Slide from '@/components/slides/sav-25.vue'
import Sav26Slide from '@/components/slides/sav-26.vue'
import Sav27Slide from '@/components/slides/sav-27.vue'
import Sav28Slide from '@/components/slides/sav-28.vue'
import Sav2Slide from '@/components/slides/sav2/1.sav-2.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CustomSlidePreview from '@/components/newRfp/CustomSlideSteps/builder/CustomSlidePreview.vue'

const allSlides = {
  CUST: CustomSlidePreview, //
  INTRO1: IntroductionSlide, //
  INTR_PPH: PartnershipSlide, //
  INTR1: AboutJandJSlide, //
  INTR2: AboutDepuySynthes, //
  INTR3: AboutDepuySynthesSecond, //
  INTR4: TraumaChallanges, //
  INTR5: TrumaTableBySiteOfCare1, //
  INTR6: TrumaTableBySiteOfCare2, //
  INTR7: TrumaTableBySiteOfCare3, //
  INTR8: TrumaTableBySiteOfCare4, //
  CS_PPH: PartnershipSlide,
  CS1: IndustryFieldSlide, //
  SRG_PPH: PartnershipSlide,
  SRG1: SynthesTraumaSlide, //
  SRG2: SurgeonPlanSlide, //  18
  SAV_PPH: PartnershipSlide,
  SAV3: DataObsAndPotSav03, //  20
  SAV4: OrthopedicTraumaSpend04, //  21
  SAV5: ProceduralEfficiencySlide, //  22
  SAV6: AdvantagesSimplifiedPortfolio06, //  23
  SAV8: TraumaAnalysisToolDemo, //  24
  SAV2: Sav2Slide, //  25
  SAV25: Sav25Slide,
  SAV26: Sav26Slide,
  SAV27: Sav27Slide,
  SAV28: Sav28Slide,
  SAV14: ProposedSolutions14, //  30
  SAV15: sav15, //  31
  SAV9: ReusableSterilizationContainer09, //  32
  SAV10: Sav10Slide, //  33
  SAV11: UniversalSmallFrag11,
  SAV12: Sav12Slide,
  SAV13: Esims,
  SAV21: Sav21Slide,
  SAV22: Sav22Slide,
  SAV23: Sav23Slide,
  SAV24: SavingSummary,
  QOC_PPH: PartnershipSlide,
  QOC1: InstrumentWarrantySlide,
  QOC6: WhatIsTheAOSlide,
  QOC7: ResearchInnovationEducationSlide,
  QOC3: HipFractureCareSlide,
  QOC4: HipFractureCareProgramSlide,
  EDU_PPH: PartnershipSlide,
  EDU1: ProfessionalEductionSlide,
  EDU2: FutureLeadersSlide,
  EDU3: TrainingPlanWithCalnder,
  PORT_PPH: PartnershipSlide,
  PORT1: RobustTraumaPortfolioSlide,
  APPD1: ReadyForAnythingSlide,
  APPD2: CompleteSolutionsSlide,
  PORT4: BroadPortfolioSlide,
  PORT7: InnovationTimelineSlide,
  PORT5: ProPakSlide,
  PORT6: SynthesProPakSlide,
  APDX1: DecisionGroupSlide,
  APDX2: PriceTrackSlide,
}

export default {
  props: {
    allowAnimations: {
      type: Boolean,
      default: true,
    },
    isPdfView: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore()
    const route = useRoute()

    const enabledSlides = computed(() =>
      store.getters['rfps/getDisplayedSlidesByPresentationId']({
        presentationId: route.params.presentationId,
        hyperLink: route.params.hyperLink,
        clientName: route.params.clientName,
      }),
    )

    const slideComponents = computed(() =>
      enabledSlides.value.map((slide) =>
        (slide.slide || slide)?.slideType === 'CUSTOM'
          ? allSlides['CUST']
          : allSlides[(slide.slide || slide)?.prePopulatedSlide],
      ),
    )

    const allSlidesAreDisabled = computed(
      () => enabledSlides.value.length === 0,
    )

    return { slideComponents, allSlidesAreDisabled }
  },
}
</script>
