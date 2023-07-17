import { MunicipalityType } from './municipality-tax-2023'

export type BasicLoanInfo = {
  principal: number
  yearsLeft: number
  extraCharge: number
  interest: number
  otherInterestPerYear: number
  instalmentFreeYearsLeft: number
  single: boolean
  churchTax: boolean
  municipality: MunicipalityType
}

export type AllLoanInfo = {
  principal: number
  yearsLeft: number
  extraCharge: number
  interest: number
  instalmentFreeYearsLeft: number
  estimatedPrice: number
  otherInterestPerYear: number
  currentPrice: number
  single: boolean
  churchTax: boolean
  newLoanInstalmentFree: boolean
  municipality: MunicipalityType
  customerKroner: boolean
  feesNewLoan: number
  interestNewLoan: number
  currentPriceNewLoan: number
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

export type LoanDifference =
  | {
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
      extraChargeOldLoan: number
      extraChargeNewLoan: number
      extraChargeDifference: number
      totalPaymentPreTaxOldLoan: number
      totalPaymentPreTaxNewLoan: number
      totalPaymentPreTaxDifference: number
      totalPaymentPostTaxOldLoan: number
      totalPaymentPostTaxNewLoan: number
      totalPaymentPostTaxDifference: number
      breakevenPrincipalAfterYears: number
      breakevenPaymentsPostTaxAfterYears: number
      breakevenTotalPaymentsPostTaxAfterYears: number
    }
  | undefined

export type TotalCalculation = {
  oldCalculatedLoan: CalculatedLoan
  newCalculatedLoan: CalculatedLoan
  loanDifference: LoanDifference
}
