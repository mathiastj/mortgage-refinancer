export const Institute = {
  JYSKE: 'Jyske Realkredit',
  TOTALKREDIT: 'Totalkredit',
  RD: 'Realkredit Danmark',
  NORDEA: 'Nordea'
} as const

export type InstituteType = (typeof Institute)[keyof typeof Institute]

export const isInstitute = (value: string): value is InstituteType => {
  return Object.values(Institute).includes(value as InstituteType)
}

// In Danish these are called Bidragssatser, perhaps they could be translated to contribution margins
export const EXTRA_CHARGE_LOAN_INTERVALS: {
  [Key in InstituteType]: {
    from: number
    to: number
    charge: number
    instalmentFreeCharge: number
  }[]
} = {
  // https://www.totalkredit.dk/siteassets/dokumenter/privat/prisblad/prisblad--privat.pdf
  [Institute.TOTALKREDIT]: [
    {
      from: 0,
      to: 0.4,
      charge: 0.45,
      instalmentFreeCharge: 0.55
    },
    {
      from: 0.4,
      to: 0.6,
      charge: 0.85,
      instalmentFreeCharge: 1.15
    },
    {
      from: 0.6,
      to: 0.8,
      charge: 1.2,
      instalmentFreeCharge: 2.0
    }
  ],
  // https://www.jyskebank.dk/privat/priser/bolig
  [Institute.JYSKE]: [
    {
      from: 0,
      to: 0.4,
      charge: 0.325,
      instalmentFreeCharge: 0.475
    },
    {
      from: 0.4,
      to: 0.6,
      charge: 0.8,
      instalmentFreeCharge: 0.95
    },
    {
      from: 0.6,
      to: 0.8,
      charge: 1.0,
      instalmentFreeCharge: 2
    }
  ],
  // https://www.nordea.dk/Images/144-119161/20170105bidragssatser_.pdf
  [Institute.NORDEA]: [
    {
      from: 0,
      to: 0.4,
      charge: 0.375,
      instalmentFreeCharge: 0.525
    },
    {
      from: 0.4,
      to: 0.6,
      charge: 0.825,
      instalmentFreeCharge: 1.125
    },
    {
      from: 0.6,
      to: 0.8,
      charge: 1.125,
      instalmentFreeCharge: 1.825
    }
  ],
  // https://rd.dk/PDF/Privat/prisblad-privat.pdf Added extra of 0.0500 %-point, in case of quaterly payments to compare with other institutes
  [Institute.RD]: [
    {
      from: 0,
      to: 0.4,
      charge: 0.3248,
      instalmentFreeCharge: 0.4248
    },
    {
      from: 0.4,
      to: 0.6,
      charge: 0.8748,
      instalmentFreeCharge: 0.9748
    },
    {
      from: 0.6,
      to: 0.8,
      charge: 1.4,
      instalmentFreeCharge: 2.2
    }
  ]
}
