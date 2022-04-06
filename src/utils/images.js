import CUST from '@/assets/images/slide-captures/custome_slide.png'
import INTRO1 from '@/assets/images/slide-captures/depuy.png'
import INTR_PPH from '@/assets/images/slide-captures/partnership-proposal-hub.png'
import INTR1 from '@/assets/images/slide-captures/aboutJandJ.png'

import INTR2 from '@/assets/images/slide-captures/aboutDePuySynthes.png'
import INTR3 from '@/assets/images/slide-captures/aboutDePuySynthes2.png'
import INTR4 from '@/assets/images/slide-captures/traumaChallange.png'

import INTR5 from '@/assets/images/slide-captures/traumaCare1.png'
import INTR6 from '@/assets/images/slide-captures/traumaCare2.png'
import INTR7 from '@/assets/images/slide-captures/traumaCare3.png'
import INTR8 from '@/assets/images/slide-captures/traumaCare4.png'

import CS1 from '@/assets/images/slide-captures/CS1.png'
import SRG1 from '@/assets/images/slide-captures/synthes-trauma.png'
import SRG2 from '@/assets/images/slide-captures/sergeon-plan.png'

import SAV3 from '@/assets/images/slide-captures/sav3.png'
import SAV4 from '@/assets/images/slide-captures/sav4.png'
import SAV5 from '@/assets/images/slide-captures/slideProceduralEfficiency.png'
import SAV6 from '@/assets/images/slide-captures/sav6.png'

import SAV8 from '@/assets/images/slide-captures/sav8.png'
import SAV2 from '@/assets/images/slide-captures/SAV2.png'
import SAV14 from '@/assets/images/slide-captures/sav14.png'
import SAV15 from '@/assets/images/slide-captures/sav15.png'
import SAV9 from '@/assets/images/slide-captures/sav9.png'

import SAV10 from '@/assets/images/slide-captures/sav10.png'
import SAV11 from '@/assets/images/slide-captures/sav11.png'
import SAV12 from '@/assets/images/slide-captures/sav12.png'
import SAV13 from '@/assets/images/slide-captures/sav13.png'
import SAV21 from '@/assets/images/slide-captures/sav21.png'
import SAV22 from '@/assets/images/slide-captures/sav22.png'
import SAV23 from '@/assets/images/slide-captures/sav23.png'
import SAV24 from '@/assets/images/slide-captures/savings-summary.png'
import SAV25 from '@/assets/images/slide-captures/sav25.png'
import SAV26 from '@/assets/images/slide-captures/sav26.png'
import SAV27 from '@/assets/images/slide-captures/sav27.png'
import SAV28 from '@/assets/images/slide-captures/sav28.png'

import QOC1 from '@/assets/images/slide-captures/instrumentWarranty.png'
import QOC6 from '@/assets/images/slide-captures/whatIsAO.png'
import QOC7 from '@/assets/images/slide-captures/ResearchInnovationandEducation.png'
import QOC3 from '@/assets/images/slide-captures/hip-fracture-care.png'
import QOC4 from '@/assets/images/slide-captures/hip-fracture-care-program.png'

import EDU1 from '@/assets/images/slide-captures/professionalEducation.png'
import EDU2 from '@/assets/images/slide-captures/EDU2.png'
import EDU3 from '@/assets/images/slide-captures/training-plan.png'

import PORT1 from '@/assets/images/slide-captures/port1.png'
import APPD1 from '@/assets/images/slide-captures/appd1.png'
import APPD2 from '@/assets/images/slide-captures/appd2.png'
import PORT4 from '@/assets/images/slide-captures/port4.png'
import PORT7 from '@/assets/images/slide-captures/port7.png'
import PORT5 from '@/assets/images/slide-captures/port5.png'
import PORT6 from '@/assets/images/slide-captures/port6.png'

import APDX1 from '@/assets/images/slide-captures/slide60.png'
import APDX2 from '@/assets/images/slide-captures/slide61.png'

const slidesCaptionImage = {
  CUST,
  INTRO1,
  INTR2,
  INTR3,
  INTR4,
  INTR5,
  INTR6,
  INTR7,
  INTR8,
  INTR_PPH,
  CS_PPH: INTR_PPH,
  SRG_PPH: INTR_PPH,
  SAV_PPH: INTR_PPH,
  QOC_PPH: INTR_PPH,
  EDU_PPH: INTR_PPH,
  PORT_PPH: INTR_PPH,
  INTR1,
  CS1,
  SRG1,
  SRG2,
  SAV3,
  SAV4,
  SAV5,
  SAV6,
  SAV8,
  SAV2,
  SAV14,
  SAV15,
  SAV9,
  SAV10,
  SAV11,
  SAV12,
  SAV13,
  SAV21,
  SAV22,
  SAV23,
  SAV24,
  SAV25,
  SAV26,
  SAV27,
  SAV28,
  QOC1,
  QOC6,
  QOC7,
  QOC3,
  QOC4,
  EDU1,
  EDU2,
  EDU3,
  PORT1,
  APPD1,
  APPD2,
  PORT4,
  PORT7,
  PORT5,
  PORT6,
  APDX1,
  APDX2,
}

export const getSlideImage = (name) => {
  return slidesCaptionImage[name]
}
