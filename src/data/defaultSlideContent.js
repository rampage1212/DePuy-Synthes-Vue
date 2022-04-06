import surgeonPlan from '@/data/slideContent/surgeonPlan.json'

const dateToString = (date) =>
  date.getFullYear() +
  '-' +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  '-' +
  ('0' + date.getDate()).slice(-2)

const today = new Date()
const endDay = new Date()
endDay.setDate(endDay.getDate() + 30)

const startDate = dateToString(today)
const endDate = dateToString(endDay)

const milestoneDay1 = new Date()
milestoneDay1.setDate(milestoneDay1.getDate() + 7)

const milestoneDate1 = dateToString(milestoneDay1)

export default {
  INTRO1: {
    title: 'DePuy Synthes Companies Trauma Overview for',
    subTitle: `[Your Name]\n[Your Title],\n[Business Unit, Region, Date]`,
  },
  CS1: {
    address: [
      {
        type: 'AVP',
        name: '',
        contact: '',
      },
      { type: 'RM', name: '', contact: '' },
      { type: 'AD', name: '', contact: '' },
    ],
    consultants: [
      {
        name: '',
        contact: '',
      },
    ],
    experience: '',
  },
  SRG2: {
    'Total available trauma business in hospital':
      surgeonPlan['Total available trauma business in hospital'],
    overviewContent: '',
    rows: surgeonPlan.doctors.map((doctor, i) => ({
      ...doctor,
      display: i === 0,
    })),
  },
  SAV24: {
    procedureSavings: {
      standardization: '',
      offer: '',
      options: '',
    },
    additinalSavings: {
      rigid: 223004,
      usf: 41875,
      esims: null,
      Biologics: null,
      power: null,
      'Rebate or NBI': null,
      Other: null,
    },
  },
  SAV10: {},
  SAV12: {},
  SAV23: {},
  EDU3: {
    header: 'Training plan',
    timelines: [
      {
        title: 'COMMERCIAL',
        startDate: startDate,
        endDate: endDate,
        label: 'Commercial',
        milestones: [{ title: 'Commercial Milestone', date: milestoneDate1 }],
      },
      {
        title: 'PLANNING',
        startDate: startDate,
        endDate: endDate,
        label: 'Planning ',
        milestones: [{ title: 'Planning Milestone', date: milestoneDate1 }],
      },
      {
        title: 'KIT IMPLEMENTATION',
        startDate: startDate,
        endDate: endDate,
        label: 'Kit Implementation',
        milestones: [
          { title: 'Kit Implementation Milestone', date: milestoneDate1 },
        ],
      },
      {
        title: 'TRAINING',
        startDate: startDate,
        endDate: endDate,
        label: 'Training',
        milestones: [{ title: 'Training Milestone', date: milestoneDate1 }],
      },
      {
        title: 'GO LIVE',
        startDate: startDate,
        endDate: endDate,
        label: 'Go Live',
        milestones: [{ title: 'Go Live Milestone', date: milestoneDate1 }],
      },
    ],
  },
  SAV2: {},
  SAV21: {
    biologic: [
      {
        type: 'Vivigen Formable Medium			',
        price: '',
        brand: 'Cellular/Infuse',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'PliaFx Putty Medium',
        price: '',
        brand: 'DBM',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'Fibergraft Putty Medium',
        price: '',
        brand: 'Synthetic Putty',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'Cancellous Chips',
        price: '',
        brand: 'Chips Company',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'Allograft Wedges F/A',
        price: '',
        brand: 'Wedge Company',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'DBX Putty Medium',
        price: '',
        brand: 'DBM #2',
        competitor: '',
        opportunity: '',
      },
    ],
  },
  SAV22: {
    power: [
      {
        type: 'E Pen',
        price: '',
        brand: '',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'Small Power',
        price: '',
        brand: '',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'Racon Power',
        price: '',
        brand: '',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'Large Power',
        price: '',
        brand: '',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'High Speed Power',
        price: '',
        brand: '',
        competitor: '',
        opportunity: '',
      },
      {
        type: 'Air Power',
        price: '',
        brand: '',
        competitor: '',
        opportunity: '',
      },
    ],
  },

  SAV25: {
    element: [
      {
        type: 'Plates & Screws',
        subElement: [
          {
            subTitle: 'Hand & Wrist',
            current: '',
            offers: '',
          },
          {
            subTitle: 'Shoulder & Elbow',
            current: '',
            offers: '',
          },
          {
            subTitle: 'Femur & Elbow',
            current: '',
            offers: '',
          },
          {
            subTitle: 'Foot & Ankle',
            current: '',
            offers: '',
          },
          {
            subTitle: 'Non anatomic',
            current: '',
            offers: '',
          },
        ],
      },
      {
        type: 'IM Nails',
        subElement: [
          {
            subTitle: 'Hip Nails',
            current: '',
            offers: '',
          },
          {
            subTitle: 'Femoral Nails',
            current: '',
            offers: '',
          },
          {
            subTitle: 'Tibial Nails',
            current: '',
            offers: '',
          },
        ],
      },
      {
        type: 'IM Nails',
        subElement: [
          {
            subTitle: 'External Fixtures',
            current: '',
            offers: '',
          },
          {
            subTitle: 'Cannulated screws',
            current: '',
            offers: '',
          },
        ],
      },
      {
        type: 'Other Procedures',
        subElement: [
          {
            subTitle: '',
            current: '',
            offers: '',
          },
        ],
      },
      {
        type: 'Procedure Spend Savings',
        subElement: [
          {
            subTitle: '',
            current: '',
            offers: '',
          },
        ],
      },
    ],
  },

  SAV26: {
    element: [
      {
        type: 'Plates & Screws',
        subElement: [
          {
            subTitle: 'Hand & Wrist',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Shoulder & Elbow',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Femur & Elbow',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Foot & Ankle',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Non anatomic',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
      {
        type: 'IM Nails',
        subElement: [
          {
            subTitle: 'Hip Nails',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Femoral Nails',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Tibial Nails',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
      {
        type: 'IM Nails',
        subElement: [
          {
            subTitle: 'External Fixtures',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Cannulated screws',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
      {
        type: 'Other Procedures',
        subElement: [
          {
            subTitle: '',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
      {
        type: 'Procedure Spend Savings',
        subElement: [
          {
            subTitle: '',
            current: '',
            offers: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
    ],
  },

  SAV27: {
    element: [
      {
        type: 'Plates & Screws',
        subElement: [
          {
            subTitle: 'Hand & Wrist',
            current: '',
            offers: '',
            spend: '',
          },
          {
            subTitle: 'Shoulder & Elbow',
            current: '',
            offers: '',
            spend: '',
          },
          {
            subTitle: 'Femur & Elbow',
            current: '',
            offers: '',
            spend: '',
          },
          {
            subTitle: 'Foot & Ankle',
            current: '',
            offers: '',
            spend: '',
          },
          {
            subTitle: 'Non anatomic',
            current: '',
            offers: '',
            spend: '',
          },
        ],
      },
      {
        type: 'IM Nails',
        subElement: [
          {
            subTitle: 'Hip Nails',
            current: '',
            offers: '',
            spend: '',
          },
          {
            subTitle: 'Femoral Nails',
            current: '',
            offers: '',
            spend: '',
          },
          {
            subTitle: 'Tibial Nails',
            current: '',
            offers: '',
            spend: '',
          },
        ],
      },
      {
        type: 'IM Nails',
        subElement: [
          {
            subTitle: 'External Fixtures',
            current: '',
            offers: '',
            spend: '',
          },
          {
            subTitle: 'Cannulated screws',
            current: '',
            offers: '',
            spend: '',
          },
        ],
      },
      {
        type: 'Other Procedures',
        subElement: [
          {
            subTitle: '',
            current: '',
            offers: '',
            spend: '',
          },
        ],
      },
      {
        type: 'Procedure Spend Savings',
        subElement: [
          {
            subTitle: '',
            current: '',
            offers: '',
            spend: '',
          },
        ],
      },
    ],
  },

  SAV28: {
    element: [
      {
        type: 'Plates & Screws',
        subElement: [
          {
            subTitle: 'Hand & Wrist',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Shoulder & Elbow',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Femur & Elbow',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Foot & Ankle',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Non anatomic',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
      {
        type: 'IM Nails',
        subElement: [
          {
            subTitle: 'Hip Nails',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Femoral Nails',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Tibial Nails',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
      {
        type: 'IM Nails',
        subElement: [
          {
            subTitle: 'External Fixtures',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
          {
            subTitle: 'Cannulated screws',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
      {
        type: 'Other Procedures',
        subElement: [
          {
            subTitle: '',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
      {
        type: 'Procedure Spend Savings',
        subElement: [
          {
            subTitle: '',
            current: '',
            offers: '',
            tech: '',
            spend: '',
            opportunity: '',
          },
        ],
      },
    ],
  },
}
