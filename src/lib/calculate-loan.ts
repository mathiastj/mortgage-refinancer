import { AllLoanInfo, BasicLoanInfo, CalculatedLoan, LoanDifference, TotalCalculation } from './types'
import { municipalityTaxes } from './municipality-tax-2023'
import { EXTRA_CHARGE_LOAN_INTERVALS, Institute } from './extra-charges'

const DEDUCTABLE_SINGLE = 50000
const DEDUCTABLE_COUPLE = 2 * DEDUCTABLE_SINGLE

const EXTRA_DEDUCTABLE_PERCENT_BELOW_LIMIT = 8

const QUARTERS_PER_YEAR = 4
const MONTHS_PER_YEAR = 12

const CUSTOMER_KRONER_EXTRA_CHARGE_REBATE = 0.15
const RD_EXTRA_CHARGE_PERCENTAGE_FOR_QUARTERLY = 0.05

type YearlyPayment = {
  yearlyExtraCharge: number
  yearlyInterest: number
  yearlyInstalment: number
  yearlyPricePreTax: number
}

export const calculateLoan = (loanInfo: AllLoanInfo): TotalCalculation => {
  if (loanInfo.customerKroner) {
    loanInfo.extraCharge -= CUSTOMER_KRONER_EXTRA_CHARGE_REBATE
  }
  const termsPerYear = loanInfo.institute == Institute.RD && !loanInfo.rdQuarterlyPayments ? MONTHS_PER_YEAR : QUARTERS_PER_YEAR

  const oldCalculatedLoan = calculateAnnuityLoan(loanInfo, termsPerYear)

  const newLoanPrincipal = calculateNewPrincipal(loanInfo)
  let newLoanExtraCharge = calculateExtraCharge({ ...loanInfo, principal: newLoanPrincipal })
  if (loanInfo.customerKroner && loanInfo.institute === Institute.TOTALKREDIT) {
    newLoanExtraCharge -= CUSTOMER_KRONER_EXTRA_CHARGE_REBATE
  }
  const newCalculatedLoan = calculateAnnuityLoan({
    extraCharge: newLoanExtraCharge,
    interest: loanInfo.interestNewLoan,
    principal: newLoanPrincipal,
    yearsLeft: loanInfo.yearsLeft,
    otherInterestPerYear: loanInfo.otherInterestPerYear,
    single: loanInfo.single,
    churchTax: loanInfo.churchTax,
    municipality: loanInfo.municipality,
    instalmentFreeYearsLeft: loanInfo.newLoanInstalmentFree ? 10 : 0
  }, termsPerYear)

  const loanDifference = calculateLoanDifference(oldCalculatedLoan, newCalculatedLoan, {
    oldLoan: loanInfo.extraCharge,
    newLoan: newLoanExtraCharge
  })

  return { oldCalculatedLoan, newCalculatedLoan, loanDifference }
}

const calculateLoanDifference = (
  oldCalculatedLoan: CalculatedLoan,
  newCalculatedLoan: CalculatedLoan,
  extraCharges: { oldLoan: number; newLoan: number }
): LoanDifference => {
  const principalDifference = newCalculatedLoan[0].principal - oldCalculatedLoan[0].principal
  const pricePostTaxDifference = newCalculatedLoan[0].pricePostTax - oldCalculatedLoan[0].pricePostTax
  const pricePreTaxDifference = newCalculatedLoan[0].pricePreTax - oldCalculatedLoan[0].pricePreTax
  const instalmentDifference = newCalculatedLoan[0].instalment - oldCalculatedLoan[0].instalment
  const extraChargeDifference = extraCharges.newLoan - extraCharges.oldLoan

  let yearsTilBreakevenPrincipal = -1
  let yearsTilTotalBreakevenPaymentsPostTax = -1
  let yearsTilBreakevenPaymentPostTax = -1
  let sumOldPaymentsPreTax = 0
  let sumNewPaymentsPreTax = 0
  let sumOldPaymentsPostTax = 0
  let sumNewPaymentsPostTax = 0
  for (let i = 0; i < oldCalculatedLoan.length; i++) {
    // Years are not zero indexed
    const currentYear = i + 1
    if (newCalculatedLoan[i].principal > oldCalculatedLoan[i].principal && yearsTilBreakevenPrincipal === -1) {
      yearsTilBreakevenPrincipal = currentYear
    }
    if (
      newCalculatedLoan[i].pricePostTax > oldCalculatedLoan[i].pricePostTax &&
      yearsTilBreakevenPaymentPostTax === -1
    ) {
      yearsTilBreakevenPaymentPostTax = currentYear
    }
    sumOldPaymentsPreTax += oldCalculatedLoan[i].pricePreTax
    sumNewPaymentsPreTax += newCalculatedLoan[i].pricePreTax
    sumOldPaymentsPostTax += oldCalculatedLoan[i].pricePostTax
    sumNewPaymentsPostTax += newCalculatedLoan[i].pricePostTax
    if (sumNewPaymentsPostTax > sumOldPaymentsPostTax && yearsTilTotalBreakevenPaymentsPostTax === -1) {
      yearsTilTotalBreakevenPaymentsPostTax = currentYear
    }
  }
  const totalPaymentPostTaxDifference = sumNewPaymentsPostTax - sumOldPaymentsPostTax
  const totalPaymentPreTaxDifference = sumNewPaymentsPreTax - sumOldPaymentsPreTax

  const loanDifference: LoanDifference = {
    principalOldLoan: oldCalculatedLoan[0].principal,
    principalNewLoan: newCalculatedLoan[0].principal,
    principalDifference,
    pricePostTaxOldLoan: oldCalculatedLoan[0].pricePostTax,
    pricePostTaxNewLoan: newCalculatedLoan[0].pricePostTax,
    pricePostTaxDifference,
    pricePreTaxOldLoan: oldCalculatedLoan[0].pricePreTax,
    pricePreTaxNewLoan: newCalculatedLoan[0].pricePreTax,
    pricePreTaxDifference,
    instalmentOldLoan: oldCalculatedLoan[0].instalment,
    instalmentNewLoan: newCalculatedLoan[0].instalment,
    instalmentDifference,
    extraChargeOldLoan: extraCharges.oldLoan,
    extraChargeNewLoan: extraCharges.newLoan,
    extraChargeDifference,
    breakevenPrincipalAfterYears: yearsTilBreakevenPrincipal,
    breakevenTotalPaymentsPostTaxAfterYears: yearsTilTotalBreakevenPaymentsPostTax,
    breakevenPaymentsPostTaxAfterYears: yearsTilBreakevenPaymentPostTax,
    totalPaymentPreTaxOldLoan: sumOldPaymentsPreTax,
    totalPaymentPreTaxNewLoan: sumNewPaymentsPreTax,
    totalPaymentPreTaxDifference,
    totalPaymentPostTaxOldLoan: sumOldPaymentsPostTax,
    totalPaymentPostTaxNewLoan: sumNewPaymentsPostTax,
    totalPaymentPostTaxDifference
  }
  return loanDifference
}

const calculateNewPrincipal = (loanInfo: AllLoanInfo): number => {
  const currentLoanPrice = loanInfo.principal * (loanInfo.currentPrice / 100)
  const newLoanPrice = 1 + (1 - loanInfo.currentPriceNewLoan / 100)

  return currentLoanPrice * newLoanPrice + loanInfo.feesNewLoan
}

const calculateAnnuityLoan = (loanInfo: BasicLoanInfo, termsPerYear: number): CalculatedLoan => {
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

    // Calculate payments per term
    for (let terms = 0; terms < termsPerYear; terms++) {
      const termsLeft = (loanInfo.yearsLeft - years) * termsPerYear - terms
      yearlyPayments = calculateYearlyPayments(loanInfo, termsPerYear, termsLeft, principalLeft, yearlyPayments)
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
const getDeductableLeft = (loanInfo: BasicLoanInfo): number => {
  const deductable = loanInfo.single ? DEDUCTABLE_SINGLE : DEDUCTABLE_COUPLE
  return Math.max(0, deductable - loanInfo.otherInterestPerYear)
}

const getBaseTax = (loanInfo: BasicLoanInfo): number => {
  const municipalityTaxRate = municipalityTaxes[loanInfo.municipality]
  return loanInfo.churchTax ? municipalityTaxRate.churchTax + municipalityTaxRate.tax : municipalityTaxRate.tax
}

function calculateYearlyPayments(
  loanInfo: BasicLoanInfo,
  termsPerYear: number,
  termsLeft: number,
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
  const principalLeftForTerm = principalLeft - yearlyPayments.yearlyInstalment
  const termsPassed = loanInfo.yearsLeft * termsPerYear - termsLeft
  const instalmentFreeTermsLeft = loanInfo.instalmentFreeYearsLeft * termsPerYear - termsPassed

  const interest = (principalLeftForTerm * interestPercent) / termsPerYear
  const pricePreTaxPreExtra =
    (principalLeftForTerm * interestPercent) /
    termsPerYear /
    (1 - Math.pow(1 + interestPercent / termsPerYear, -termsLeft))
  const instalment = instalmentFreeTermsLeft > 0 ? 0 : pricePreTaxPreExtra - interest
  const extraCharge = (principalLeftForTerm * extraChargePercent) / termsPerYear
  const pricePreTax = instalmentFreeTermsLeft > 0 ? interest + extraCharge : pricePreTaxPreExtra + extraCharge

  return {
    yearlyExtraCharge: yearlyPayments.yearlyExtraCharge + extraCharge,
    yearlyInterest: yearlyPayments.yearlyInterest + interest,
    yearlyInstalment: yearlyPayments.yearlyInstalment + instalment,
    yearlyPricePreTax: yearlyPayments.yearlyPricePreTax + pricePreTax
  }
}

function calculateTaxDeductionForYear(
  yearlyInterest: number,
  yearlyExtraCharge: number,
  loanInfo: BasicLoanInfo
): number {
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

export const calculateExtraCharge = (loanInfo: AllLoanInfo): number => {
  // If the loan is instalment free, use the instalment free charge, otherwise use the normal charge
  const charge = loanInfo.newLoanInstalmentFree ? 'instalmentFreeCharge' : 'charge'
  const loanIntervalsForInstitute = EXTRA_CHARGE_LOAN_INTERVALS[loanInfo.institute]

  const loanPercentageOfPropertyValue = loanInfo.principal / loanInfo.estimatedPrice

  let applicableLoanIntervals = 0
  for (const interval of loanIntervalsForInstitute) {
    if (loanPercentageOfPropertyValue > interval.from) {
      applicableLoanIntervals++
    }
  }
  if (applicableLoanIntervals === 0) {
    // If the loan info is messed up (for instance if somebody entered negative values), just return 0
    return 0
  }

  const extraChargePct = []
  for (let i = 0; i < applicableLoanIntervals; i++) {
    let chargeForCurrentInterval = loanIntervalsForInstitute[i][charge]
    if(loanInfo.institute == Institute.RD && loanInfo.rdQuarterlyPayments) {
      chargeForCurrentInterval += RD_EXTRA_CHARGE_PERCENTAGE_FOR_QUARTERLY
    }
    if (i === applicableLoanIntervals - 1) {
      // Calculate how much of the last interval the loan percentage is, then calculate the extra charge for the remaining percentage
      const extraChargeForInterval =
        ((loanPercentageOfPropertyValue - loanIntervalsForInstitute[i].from) / loanPercentageOfPropertyValue) * chargeForCurrentInterval
      extraChargePct.push(extraChargeForInterval)
      continue
    }
    // Get the extra charge for this interval
    const extraChargeForInterval =
      ((loanIntervalsForInstitute[i].to - loanIntervalsForInstitute[i].from) / loanPercentageOfPropertyValue) * chargeForCurrentInterval
    extraChargePct.push(extraChargeForInterval)
  }

  // Sum up the extra charges
  return extraChargePct.reduce((partialSum, entry) => partialSum + entry, 0)
}
