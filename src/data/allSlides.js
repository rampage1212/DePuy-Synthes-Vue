import { getSlideImage } from '@/utils/images'

const allSlidesRaw = [
  {
    slideTitle: 'Title Slide',
    subTitle: 'Introduction',
    slideCategory: 'INTRODUCTION',
    slideNumber: 1,
    slideInfoId: 'intro',
    slideType: 'DYNAMIC',
    slideCode: 'INTRO1',
  },
  {
    slideTitle: 'Partnership Proposal Hub', // page 5
    slideCategory: 'INTRODUCTION',
    slideNumber: 2,
    slideCode: 'INTR_PPH',
  },
  {
    slideTitle: 'About Johnson & Johnson', // 6
    slideCategory: 'INTRODUCTION',
    slideNumber: 3,
    slideCode: 'INTR1',
  },
  {
    slideTitle: 'About DPS', // 7
    overviewTitle: 'About DePuy Synthes',
    slideCategory: 'INTRODUCTION',
    slideNumber: 4,
    slideCode: 'INTR2',
  },
  {
    slideTitle: 'Trauma table by site of care',
    overviewTitle: 'About DePuy Synthes 2',
    slideCategory: 'INTRODUCTION',
    slideNumber: 5,
    slideCode: 'INTR3',
  },
  {
    slideTitle: 'Trauma Challenges',
    slideCategory: 'INTRODUCTION',
    slideNumber: 6,
    slideCode: 'INTR4',
  },
  {
    slideTitle: 'Trauma Care 1',
    slideCategory: 'INTRODUCTION',
    slideNumber: 7,
    slideCode: 'INTR5',
  },
  {
    slideTitle: 'Trauma Care 2',
    slideCategory: 'INTRODUCTION',
    slideNumber: 8,
    slideCode: 'INTR6',
  },
  {
    slideTitle: 'Trauma Care 3',
    slideCategory: 'INTRODUCTION',
    slideNumber: 9,
    slideCode: 'INTR7',
  },
  {
    slideTitle: 'Trauma Care 4',
    slideCategory: 'INTRODUCTION',
    slideNumber: 10,
    slideCode: 'INTR8',
  },
  {
    slideTitle: 'Partnership Proposal Hub',
    slideCategory: 'CUSTOMER_SERVICE',
    slideNumber: 11,
    slideCode: 'CS_PPH',
  },
  {
    slideTitle: 'Sales Consultant Service',
    slideNumber: 12,
    slideCategory: 'CUSTOMER_SERVICE',
    slideCode: 'CS1',
    slideInfoId: 'industryField',
  },
  {
    slideTitle: 'Partnership Proposal Hub',
    slideCategory: 'SURGEON_SATISFACTION',
    slideNumber: 13,
    slideCode: 'SRG_PPH',
  },
  {
    slideTitle: 'Net Promoter Score',
    slideNumber: 14,
    slideCategory: 'SURGEON_SATISFACTION',
    slideCode: 'SRG1',
  },
  {
    slideTitle: 'Surgeon Plan',
    slideNumber: 15,
    slideCategory: 'SURGEON_SATISFACTION',
    slideInfoId: 'surgeonPlan',
    slideType: 'DYNAMIC',
    slideCode: 'SRG2',
  },
  {
    slideTitle: 'Partnership Proposal Hub',
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideNumber: 16,
    slideCode: 'SAV_PPH',
  },
  {
    slideTitle: 'Stories from third party data', // sav3
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideNumber: 17,
    slideCode: 'SAV3',
  },
  {
    slideTitle: 'Orthopedic Trauma Spend Analysis', // sav4
    slideNumber: 18,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV4',
  },
  {
    slideTitle: 'Savings Through Procedural Efficiency', // sav 5
    slideNumber: 19,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV5',
  },
  {
    slideTitle: 'Advantages of a Simplified Portfolio', // sav 6
    slideNumber: 20,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV6',
  },
  {
    slideTitle: 'Trauma Analysis Tool Demo', // sav8
    slideNumber: 21,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV8',
  },
  {
    slideTitle: 'Trauma Analysis Tool Output', // sav2
    slideNumber: 22,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV2',
  },
  {
    slideTitle: 'CSSR Table 1',
    slideNumber: 23,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV25',
    slideType: 'DYNAMIC',
  },
  {
    slideTitle: 'CSSR Table 2',
    slideNumber: 24,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV26',
    slideType: 'DYNAMIC',
  },
  {
    slideTitle: 'CSSR Table 3',
    slideNumber: 25,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV27',
    slideType: 'DYNAMIC',
  },
  {
    slideTitle: 'CSSR Table 4',
    slideNumber: 26,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV28',
    slideType: 'DYNAMIC',
  },
  {
    slideTitle: 'TPS Solutions', // sav 14
    overviewTitle: 'Proposed Solutions',
    slideNumber: 27,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV14',
  },
  {
    slideTitle: 'A suite of solutions', // sav 15
    slideNumber: 28,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV15',
  },
  {
    slideTitle: 'Sterile Containers', // sav 9
    // overviewTitle: 'Reusable Sterilization Container System',
    slideNumber: 29,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV9',
  },
  {
    slideTitle: 'Sterile Containers 2', // sav 10
    slideNumber: 30,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideInfoId: 'reusableSystem',
    slideType: 'DYNAMIC',
    slideCode: 'SAV10',
  },
  {
    slideTitle: 'Universal Small Frag', // sav 11
    overviewTitle: 'Universal Small Fragment System',
    slideNumber: 31,
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideCode: 'SAV11',
  },
  {
    slideTitle: 'Universal Small Frag 2', // sav 12
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideNumber: 32,
    slideCode: 'SAV12',
    slideInfoId: 'fragmentSystem',
  },
  {
    slideTitle: 'eSIMS', // sav 13
    overviewTitle: 'DePuy Synthes Inventory Management System (eSIMS)',
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideNumber: 33,
    slideCode: 'SAV13',
  },
  {
    slideTitle: 'Saving with Biologics, Power', // sav 21
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideNumber: 34,
    slideCode: 'SAV21',
  },
  {
    slideTitle: 'Saving with Biologics, Power 2', // sav 22
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideNumber: 35,
    slideCode: 'SAV22',
  },
  {
    slideTitle: 'Rebates/ Overlay/ NBI', // sav 23
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideNumber: 36,
    slideCode: 'SAV23',
  },
  {
    slideTitle: 'Savings Summary', // sav 24
    slideCategory: 'DELIVER_ACTUAL_SAVINGS',
    slideNumber: 37,
    slideInfoId: 'savingsSummary',
    slideType: 'DYNAMIC',
    slideCode: 'SAV24',
  },
  {
    slideTitle: 'Partnership Proposal Hub',
    slideCategory: 'QUALITY_OF_CARE',
    slideNumber: 38,
    slideCode: 'QOC_PPH',
  },
  {
    slideTitle: 'Instrument Warranty',
    slideNumber: 39,
    slideCategory: 'QUALITY_OF_CARE',
    slideCode: 'QOC1',
  },
  {
    slideTitle: 'AOTC',
    overviewTitle: 'What is the AO',
    slideNumber: 40,
    slideCategory: 'QUALITY_OF_CARE',
    slideCode: 'QOC6',
  },
  {
    slideTitle: 'Research, Innovation and Education',
    slideNumber: 41,
    slideCategory: 'QUALITY_OF_CARE',
    slideCode: 'QOC7',
  },
  {
    slideTitle: 'Hip Fracture Care',
    slideNumber: 42,
    slideCategory: 'QUALITY_OF_CARE',
    slideCode: 'QOC3',
  },
  {
    slideTitle: 'Hip Fracture Care Program',
    slideNumber: 43,
    slideCategory: 'QUALITY_OF_CARE',
    slideCode: 'QOC4',
  },
  {
    slideTitle: 'Partnership Proposal Hub',
    slideCategory: 'TRAINING_SUPPORT',
    slideNumber: 44,
    slideCode: 'EDU_PPH',
  },
  {
    slideTitle: 'Prof Education Overview',
    slideNumber: 45,
    slideCategory: 'TRAINING_SUPPORT',
    slideCode: 'EDU1',
  },
  {
    slideTitle: 'Future Leaders',
    slideCategory: 'TRAINING_SUPPORT',
    slideNumber: 46,
    slideCode: 'EDU2',
  },
  {
    slideTitle: 'Customized Training Plan',
    slideNumber: 47,
    slideCategory: 'TRAINING_SUPPORT',
    slideInfoId: 'trainingPlan',
    slideType: 'DYNAMIC',
    slideCode: 'EDU3',
  },
  {
    slideTitle: 'Partnership Proposal Hub',
    slideCategory: 'COMPREHENSIVE_PORTFOLIO',
    slideNumber: 48,
    slideCode: 'PORT_PPH',
  },
  {
    slideTitle: 'Trauma Portfolio Procedure Overview',
    slideNumber: 49,
    slideCategory: 'COMPREHENSIVE_PORTFOLIO',
    slideCode: 'PORT1',
  },
  {
    slideTitle: 'Product Portfolio - Ready for Anything',
    slideNumber: 50,
    slideCategory: 'COMPREHENSIVE_PORTFOLIO',
    slideCode: 'APPD1',
  },
  {
    slideTitle: 'Product Portfolio - Complete Solution',
    slideNumber: 51,
    slideCategory: 'COMPREHENSIVE_PORTFOLIO',
    slideCode: 'APPD2',
  },
  {
    slideTitle: 'Investment In Innovation',
    slideNumber: 52,
    slideCategory: 'COMPREHENSIVE_PORTFOLIO',
    slideCode: 'PORT4',
  },
  {
    slideTitle: 'NPI Launch',
    // overviewTitle: 'Innovation Timeline',
    slideNumber: 53,
    slideCategory: 'COMPREHENSIVE_PORTFOLIO',
    slideCode: 'PORT7',
  },
  {
    slideTitle: 'DePuy Synthes Pro-Pak® Constructs',
    slideNumber: 54,
    slideCategory: 'COMPREHENSIVE_PORTFOLIO',
    slideCode: 'PORT5',
  },
  {
    slideTitle: 'What is DePuy Synthes Pro-Pak®?',
    slideNumber: 55,
    slideCategory: 'COMPREHENSIVE_PORTFOLIO',
    slideCode: 'PORT6',
  },
  {
    slideTitle: 'Decisions Resource Group',
    slideNumber: 56,
    slideCategory: 'APPENDIX',
    slideCode: 'APDX1',
  },
  {
    slideTitle: "DRG's Price Track",
    slideNumber: 57,
    slideCategory: 'APPENDIX',
    slideCode: 'APDX2',
  },
]

const allSlides = allSlidesRaw.map((slide) => ({
  prePopulatedSlide: slide.slideCode,
  ...slide.slide,
  ...slide,
  isEnabled: false,
  selected: false,
  draftContent: slide.slideType === 'DYNAMIC' ? {} : null,
  slide: {
    prePopulatedSlide: slide.slideCode,
    ...slide.slide,
  },
  fullImgSrc: getSlideImage(slide.slideCode),
}))

export default allSlides

export function slideDetails({
  slideType,
  slideContent,
  prePopulatedSlide,
  slideCode,
}) {
  if (slideType === 'CUSTOM') {
    const slideContentProcessed =
      typeof slideContent === 'string'
        ? JSON.parse(slideContent || '{}')
        : slideContent

    return {
      ...slideContentProcessed,
      fullImgSrc: getSlideImage('CUST'),
    }
  } else {
    return allSlides.find(
      (slide) => slide.slideCode === (slideCode || prePopulatedSlide),
    )
  }
}

export function groupSlides(slides, groupBy = 'slideCategory') {
  const sortedSlides = [...slides].sort(
    (slideA, slideB) =>
      (!isNaN(slideA.slideNumber)
        ? slideA.slideNumber
        : slideA.pageNumber - 0.5) -
      (!isNaN(slideB.slideNumber)
        ? slideB.slideNumber
        : slideB.pageNumber - 0.5),
  )

  const groupedSlides = {}

  sortedSlides.forEach((slide) => {
    const groupName = slide[groupBy]
    groupedSlides[groupName] = [...(groupedSlides[groupName] || []), slide]
  })
  return groupedSlides
}
