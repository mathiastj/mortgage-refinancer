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
  municipality: 'municipality'
} as const
