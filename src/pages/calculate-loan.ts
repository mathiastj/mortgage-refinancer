import { BasicLoanInfo, CalculatedLoan } from './types'
import { municipalityTaxes } from './municipality-tax-2023'

const DEDUCTABLE_SINGLE = 50000
const DEDUCTABLE_COUPLE = 2 * DEDUCTABLE_SINGLE

const EXTRA_DEDUCTABLE_PERCENT_BELOW_LIMIT = 8

const QUARTERS_PER_YEAR = 4

type YearlyPayment = {
  yearlyExtraCharge: number
  yearlyInterest: number
  yearlyInstalment: number
  yearlyPricePreTax: number
}

export const calculateLoan = (loanInfo: BasicLoanInfo): CalculatedLoan => {
  return calculateAnnuityLoan(loanInfo)
}

const calculateAnnuityLoan = (loanInfo: BasicLoanInfo): CalculatedLoan => {
  const calculatedLoan: CalculatedLoan = []
  for (let years = 0; years < loanInfo.yearsLeft; years++) {
    let yearlyPayments = {
      yearlyExtraCharge: 0,
      yearlyInterest: 0,
      yearlyInstalment: 0,
      yearlyPricePreTax: 0
    }

    const principalLeft = calculatedLoan.length
      ? calculatedLoan[years - 1].principal - calculatedLoan[years - 1].instalment
      : loanInfo.principal

    // Calculate payments per quarter/term
    for (let quarters = 0; quarters < QUARTERS_PER_YEAR; quarters++) {
      const quarterlyTermsLeft = (loanInfo.yearsLeft - years) * QUARTERS_PER_YEAR - quarters
      yearlyPayments = calculateQuarterlyPayments(loanInfo, quarterlyTermsLeft, principalLeft, yearlyPayments)
    }

    const taxDeduction = calculateTaxDeductionForYear(
      yearlyPayments.yearlyInterest,
      yearlyPayments.yearlyExtraCharge,
      loanInfo
    )

    const pricePostTax = yearlyPayments.yearlyPricePreTax - taxDeduction
    calculatedLoan.push({
      principal: principalLeft,
      extraCharge: yearlyPayments.yearlyExtraCharge,
      interest: yearlyPayments.yearlyInterest,
      instalment: yearlyPayments.yearlyInstalment,
      pricePreTax: yearlyPayments.yearlyPricePreTax,
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

function calculateQuarterlyPayments(
  loanInfo: BasicLoanInfo,
  quarterlyTermsLeft: number,
  principalLeft: number,
  yearlyPayments: {
    yearlyExtraCharge: number
    yearlyInterest: number
    yearlyInstalment: number
    yearlyPricePreTax: number
  }
): YearlyPayment {
  const interestPercent = loanInfo.interest / 100
  const extraChargePercent = loanInfo.extraCharge / 100
  const principalLeftForQuarter = principalLeft - yearlyPayments.yearlyInstalment

  const interest = (principalLeftForQuarter * interestPercent) / QUARTERS_PER_YEAR
  const pricePreTaxPreExtra =
    (principalLeftForQuarter * interestPercent) /
    QUARTERS_PER_YEAR /
    (1 - Math.pow(1 + interestPercent / QUARTERS_PER_YEAR, -quarterlyTermsLeft))
  const instalment = pricePreTaxPreExtra - interest
  const extraCharge = (principalLeftForQuarter * extraChargePercent) / QUARTERS_PER_YEAR
  const pricePreTax = pricePreTaxPreExtra + extraCharge

  return {
    yearlyExtraCharge: yearlyPayments.yearlyExtraCharge + extraCharge,
    yearlyInterest: yearlyPayments.yearlyInterest + interest,
    yearlyInstalment: yearlyPayments.yearlyInstalment + instalment,
    yearlyPricePreTax: yearlyPayments.yearlyPricePreTax + pricePreTax
  }
}

function calculateTaxDeductionForYear(yearlyInterest: number, yearlyExtraCharge: number, loanInfo: BasicLoanInfo) {
  const deductableLeft = getDeductableLeft(loanInfo)
  const baseTax = getBaseTax(loanInfo)

  const taxDeductable = yearlyInterest + yearlyExtraCharge
  const deductableBelowLimit = Math.min(taxDeductable, deductableLeft)
  const deductableAboveLimit = Math.max(0, taxDeductable - deductableLeft)
  const taxDeductionBelowLimit = deductableBelowLimit * ((baseTax + EXTRA_DEDUCTABLE_PERCENT_BELOW_LIMIT) / 100)
  const taxDeductionAboveLimit = deductableAboveLimit * (baseTax / 100)
  const taxDeduction = taxDeductionBelowLimit + taxDeductionAboveLimit
  return taxDeduction
}
