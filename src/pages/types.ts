import { MunicipalityType } from './municipality-tax-2023'

export type BasicLoanInfo = {
  principal: number
  yearsLeft: number
  extraCharge: number
  interest: number
  estimatedPrice: number
  otherInterestPerYear: number
  currentPrice: number
  single: boolean
  churchTax: boolean
  municipality: MunicipalityType
}

export type CalculatedLoan = {
  principal: number
  extraCharge: number
  interest: number
  instalment: number
  pricePreTax: number
  taxDeduction: number
  pricePostTax: number
}[]

export type LoanDifference = {
  principalOldLoan: number
  principalNewLoan: number
  principalDifference: number
  pricePostTaxOldLoan: number
  pricePostTaxNewLoan: number
  pricePostTaxDifference: number
  pricePreTaxOldLoan: number
  pricePreTaxNewLoan: number
  pricePreTaxDifference: number
  instalmentOldLoan: number
  instalmentNewLoan: number
  instalmentDifference: number
}
