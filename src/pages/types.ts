export type BasicLoanInfo = {
  principal: number
  termsLeft: number
  extraCharge: number
  interest: number
  estimatedPrice: number
  otherInterestPerYear: number
  currentPrice: number
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
