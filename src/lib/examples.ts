import { Institute } from './extra-charges'
import { Municipality } from './municipality-tax-2023'
import { AllLoanInfo } from './types'

export const getLoanInfoFromExample = (example: string): AllLoanInfo => {
  switch (example) {
    case '1':
      return convertUp
    case '2':
      return convertDown
    default:
      return convertUp
  }
}

// Converting up from 1% to 4%
const convertUp = {
  principal: 2100000,
  yearsLeft: 27,
  extraCharge: 0.74,
  interest: 1,
  estimatedPrice: 3400000,
  otherInterestPerYear: 0,
  currentPrice: 74,
  single: false,
  churchTax: false,
  municipality: Municipality.ALBERTSLUND,
  customerKroner: true,
  currentPriceNewLoan: 95,
  feesNewLoan: 15000,
  interestNewLoan: 4,
  newLoanInstalmentFree: false,
  instalmentFreeYearsLeft: 0,
  institute: Institute.TOTALKREDIT,
  rdQuarterlyPayments: false
}

// Converting down from 4% to 2%
const convertDown = {
  principal: 1600000,
  yearsLeft: 27,
  extraCharge: 0.49,
  interest: 4,
  estimatedPrice: 3400000,
  otherInterestPerYear: 0,
  currentPrice: 100,
  single: false,
  churchTax: false,
  municipality: Municipality.ALBERTSLUND,
  customerKroner: true,
  currentPriceNewLoan: 98,
  feesNewLoan: 15000,
  interestNewLoan: 2,
  newLoanInstalmentFree: false,
  instalmentFreeYearsLeft: 0,
  institute: Institute.TOTALKREDIT,
  rdQuarterlyPayments: false
}
