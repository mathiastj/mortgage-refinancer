import { Institute } from './extra-charges'
import { Municipality } from './municipality-tax-2023'
import { AllLoanInfo } from './types'

export const loanInfoToQueryParam: { [key in keyof AllLoanInfo]: string } = {
  principal: 'principal',
  yearsLeft: 'terms_left',
  extraCharge: 'extra_charge',
  interest: 'interest',
  estimatedPrice: 'estimated_price',
  otherInterestPerYear: 'other_interest_per_year',
  currentPrice: 'current_price',
  single: 'single',
  churchTax: 'church_tax',
  customerKroner: 'customer_kroner',
  currentPriceNewLoan: 'current_price_new_loan',
  feesNewLoan: 'fees_new_loan',
  interestNewLoan: 'interest_new_loan',
  municipality: 'municipality',
  newLoanInstalmentFree: 'new_loan_instalment_free',
  instalmentFreeYearsLeft: 'instalment_free_years_left',
  institute: 'institute'
} as const

export const loanInfoToTypes: { [key in keyof AllLoanInfo]: string } = {
  principal: 'number',
  yearsLeft: 'number',
  extraCharge: 'number',
  interest: 'number',
  estimatedPrice: 'number',
  otherInterestPerYear: 'number',
  currentPrice: 'number',
  single: 'boolean',
  churchTax: 'boolean',
  customerKroner: 'boolean',
  currentPriceNewLoan: 'number',
  feesNewLoan: 'number',
  interestNewLoan: 'number',
  municipality: 'municipality',
  newLoanInstalmentFree: 'boolean',
  instalmentFreeYearsLeft: 'number',
  institute: 'institute'
} as const

export const defaultValuesFromQueryParams = {
  principal: undefined,
  yearsLeft: undefined,
  extraCharge: undefined,
  interest: undefined,
  estimatedPrice: undefined,
  otherInterestPerYear: undefined,
  currentPrice: undefined,
  single: false,
  churchTax: false,
  customerKroner: false,
  municipality: Municipality.KØBENHAVN,
  currentPriceNewLoan: undefined,
  feesNewLoan: undefined,
  interestNewLoan: undefined,
  newLoanInstalmentFree: false,
  instalmentFreeYearsLeft: 0,
  institute: Institute.TOTALKREDIT
}
