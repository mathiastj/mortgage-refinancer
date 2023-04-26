import { BasicLoanInfo, CalculatedLoan } from './types'
import { municipalityTaxes } from './municipality-tax-2023'

const DEDUCTABLE_SINGLE = 50000
const DEDUCTABLE_COUPLE = 2 * DEDUCTABLE_SINGLE

const EXTRA_DEDUCTABLE_PERCENT_BELOW_LIMIT = 8

export const calculateLoan = (loanInfo: BasicLoanInfo): CalculatedLoan => {
  return calculateAnnuityLoan(loanInfo)
}

const calculateAnnuityLoan = (loanInfo: BasicLoanInfo): CalculatedLoan => {
  const deductableLeft = getDeductableLeft(loanInfo)
  const baseTax = getBaseTax(loanInfo)

  const interestTransformed = loanInfo.interest / 100
  const extraChargedTransformed = loanInfo.extraCharge / 100

  const calculatedLoan: CalculatedLoan = []
  for (let i = 0; i < loanInfo.termsLeft; i++) {
    const principalLeft = calculatedLoan.length
      ? calculatedLoan[i - 1].principal - calculatedLoan[i - 1].instalment
      : loanInfo.principal

    const interest = principalLeft * interestTransformed
    const pricePreTaxPreExtra =
      (principalLeft * interestTransformed) / (1 - Math.pow(1 + interestTransformed, -(loanInfo.termsLeft - i)))
    const instalment = pricePreTaxPreExtra - interest
    const extraCharge = principalLeft * extraChargedTransformed
    const pricePreTax = pricePreTaxPreExtra + extraCharge

    const taxDeductable = interest + extraCharge
    const deductableBelowLimit = Math.min(taxDeductable, deductableLeft)
    const deductableAboveLimit = Math.max(0, taxDeductable - deductableLeft)
    const taxDeductionBelowLimit = deductableBelowLimit * ((baseTax + EXTRA_DEDUCTABLE_PERCENT_BELOW_LIMIT) / 100)
    const taxDeductionAboveLimit = deductableAboveLimit * (baseTax / 100)

    const taxDeduction = taxDeductionBelowLimit + taxDeductionAboveLimit
    const pricePostTax = pricePreTax - taxDeduction
    calculatedLoan.push({
      principal: principalLeft,
      extraCharge,
      interest,
      instalment,
      pricePreTax,
      taxDeduction,
      pricePostTax
    })
  }
  calculatedLoan.push({
    principal: 0,
    extraCharge: 0,
    interest: 0,
    instalment: 0,
    pricePreTax: 0,
    taxDeduction: 0,
    pricePostTax: 0
  })
  return calculatedLoan
}
const getDeductableLeft = (loanInfo: BasicLoanInfo) => {
  const deductable = loanInfo.single ? DEDUCTABLE_SINGLE : DEDUCTABLE_COUPLE
  return Math.max(0, deductable - loanInfo.otherInterestPerYear)
}

const getBaseTax = (loanInfo: BasicLoanInfo) => {
  const municipalityTaxRate = municipalityTaxes[loanInfo.municipality]
  return loanInfo.churchTax ? municipalityTaxRate.churchTax + municipalityTaxRate.tax : municipalityTaxRate.tax
}
