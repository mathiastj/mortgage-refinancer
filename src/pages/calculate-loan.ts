import { BasicLoanInfo, CalculatedLoan } from './types'

export const calculateLoan = (loanInfo: BasicLoanInfo): CalculatedLoan => {
  return calculateAnnuityLoan(loanInfo)

  return [
    {
      principal: loanInfo.principal,
      extraCharge: loanInfo.extraCharge,
      interest: loanInfo.interest,
      instalment: 0,
      pricePreTax: 0,
      taxDeduction: 0,
      pricePostTax: 0
    }
  ]
}

const calculateAnnuityLoan = (loanInfo: BasicLoanInfo): CalculatedLoan => {
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
    const taxDeduction = 0
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
  return calculatedLoan
}
