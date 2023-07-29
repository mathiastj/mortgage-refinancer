import { AllLoanInfo, BasicLoanInfo, CalculatedLoan, LoanDifference, TotalCalculation } from './types'
import { municipalityTaxes } from './municipality-tax-2023'
import { EXTRA_CHARGE_LOAN_INTERVALS, Institute } from './extra-charges'

const DEDUCTABLE_SINGLE = 50000
const DEDUCTABLE_COUPLE = 2 * DEDUCTABLE_SINGLE

const EXTRA_DEDUCTABLE_PERCENT_BELOW_LIMIT = 8

const QUARTERS_PER_YEAR = 4

const CUSTOMER_KRONER_EXTRA_CHARGE_REBATE = 0.15

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
  const oldCalculatedLoan = calculateAnnuityLoan(loanInfo)

  const newLoanPrincipal = calculateNewPrincipal(loanInfo)
  let newLoanExtraCharge = calculateExtraCharge({ ...loanInfo, principal: newLoanPrincipal })
  if (loanInfo.customerKroner && loanInfo.institute === Institute.TOTALKREDIT) {
    newLoanExtraCharge -= CUSTOMER_KRONER_EXTRA_CHARGE_REBATE
  }
  const newCalculatedLoan = calculateAnnuityLoan({
    extraCharge: newLoanExtraCharge,
    interest: loanInfo.interestNewLoan,
    principal: newLoanPrincipal,
    yearsLeft: loanInfo.yearsNewLoan,
    otherInterestPerYear: loanInfo.otherInterestPerYear,
    single: loanInfo.single,
    churchTax: loanInfo.churchTax,
    municipality: loanInfo.municipality,
    instalmentFreeYearsLeft: loanInfo.newLoanInstalmentFree ? 10 : 0
  })

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

  let maxYears = Math.max(oldCalculatedLoan.length, newCalculatedLoan.length);
  for (let i = 0; i < maxYears; i++) {
    // Years are not zero indexed
    const currentYear = i + 1

    if(oldCalculatedLoan.length >= currentYear) {
      if (newCalculatedLoan.length >= currentYear && newCalculatedLoan[i].principal > oldCalculatedLoan[i].principal && yearsTilBreakevenPrincipal === -1) {
        yearsTilBreakevenPrincipal = currentYear
      }
      if (
        newCalculatedLoan.length >= currentYear && newCalculatedLoan[i].pricePostTax > oldCalculatedLoan[i].pricePostTax &&
        yearsTilBreakevenPaymentPostTax === -1
      ) {
        yearsTilBreakevenPaymentPostTax = currentYear
      }


      sumOldPaymentsPreTax += oldCalculatedLoan[i].pricePreTax
      sumOldPaymentsPostTax += oldCalculatedLoan[i].pricePostTax
    }

    if(newCalculatedLoan.length >= currentYear) {
      sumNewPaymentsPreTax += newCalculatedLoan[i].pricePreTax
      sumNewPaymentsPostTax += newCalculatedLoan[i].pricePostTax
    }
    

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
      // const quartersPassed = years * QUARTERS_PER_YEAR + quarters
      // const instalmentFreeQuartersLeft = loanInfo.instalmentFreeYearsLeft * QUARTERS_PER_YEAR - quarters
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
const getDeductableLeft = (loanInfo: BasicLoanInfo): number => {
  const deductable = loanInfo.single ? DEDUCTABLE_SINGLE : DEDUCTABLE_COUPLE
  return Math.max(0, deductable - loanInfo.otherInterestPerYear)
}

const getBaseTax = (loanInfo: BasicLoanInfo): number => {
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
  const quartersPassed = loanInfo.yearsLeft * QUARTERS_PER_YEAR - quarterlyTermsLeft
  const instalmentFreeQuartersLeft = loanInfo.instalmentFreeYearsLeft * QUARTERS_PER_YEAR - quartersPassed

  const interest = (principalLeftForQuarter * interestPercent) / QUARTERS_PER_YEAR
  const pricePreTaxPreExtra =
    (principalLeftForQuarter * interestPercent) /
    QUARTERS_PER_YEAR /
    (1 - Math.pow(1 + interestPercent / QUARTERS_PER_YEAR, -quarterlyTermsLeft))
  const instalment = instalmentFreeQuartersLeft > 0 ? 0 : pricePreTaxPreExtra - interest
  const extraCharge = (principalLeftForQuarter * extraChargePercent) / QUARTERS_PER_YEAR
  const pricePreTax = instalmentFreeQuartersLeft > 0 ? interest + extraCharge : pricePreTaxPreExtra + extraCharge

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
    if (i === applicableLoanIntervals - 1) {
      // Calculate how much of the last interval the loan percentage is, then calculate the extra charge for the remaining percentage
      const extraChargeForInterval =
        ((loanPercentageOfPropertyValue - loanIntervalsForInstitute[i].from) / loanPercentageOfPropertyValue) *
        loanIntervalsForInstitute[i][charge]
      extraChargePct.push(extraChargeForInterval)
      continue
    }
    // Get the extra charge for this interval
    const extraChargeForInterval =
      ((loanIntervalsForInstitute[i].to - loanIntervalsForInstitute[i].from) / loanPercentageOfPropertyValue) *
      loanIntervalsForInstitute[i][charge]
    extraChargePct.push(extraChargeForInterval)
  }

  // Sum up the extra charges
  return extraChargePct.reduce((partialSum, entry) => partialSum + entry, 0)
}
