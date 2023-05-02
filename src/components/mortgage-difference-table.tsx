import React from 'react'
import { LoanDifference } from '../lib/types'

export default function MortgageDifferenceTable({ loanDifference }: { loanDifference?: LoanDifference }) {
  if (!loanDifference) {
    return null
  }

  // Hide breakevens if they are never reached, or reached in the first year
  const hideBreakevenPrincipalAfterYears = [-1, 1].includes(loanDifference.breakevenPrincipalAfterYears)
  const hideBreakevenTotalPaymentsPostTaxAfterYears = [-1, 1].includes(
    loanDifference.breakevenTotalPaymentsPostTaxAfterYears
  )
  const hideBreakevenPaymentsPostTaxAfterYears = [-1, 1].includes(loanDifference.breakevenPaymentsPostTaxAfterYears)
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="text-center text-lg pb-4">
        <p>Låneforskel</p>
      </div>
      <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400 border-separate border-spacing-x-4 pb-4">
        <thead>
          <tr>
            <th></th>
            <th>Nuværende lån</th>
            <th>Nyt lån</th>
            <th>Forskel</th>
          </tr>
        </thead>
        <tbody>
          <tr key="1">
            <td className="text-left">
              <b>Restgæld</b>
            </td>
            <td>{loanDifference.principalOldLoan.toFixed(0)}</td>
            <td>{loanDifference.principalNewLoan.toFixed(0)}</td>
            <td>{loanDifference.principalDifference.toFixed(0)}</td>
          </tr>
          <tr key="2">
            <td className="text-left">
              <b>Ydelse før skat første år</b>
            </td>
            <td>{loanDifference.pricePreTaxOldLoan.toFixed(0)}</td>
            <td>{loanDifference.pricePreTaxNewLoan.toFixed(0)}</td>
            <td>{loanDifference.pricePreTaxDifference.toFixed(0)}</td>
          </tr>
          <tr key="3">
            <td className="text-left">
              <b>Ydelse efter skat første år</b>
            </td>
            <td>{loanDifference.pricePostTaxOldLoan.toFixed(0)}</td>
            <td>{loanDifference.pricePostTaxNewLoan.toFixed(0)}</td>
            <td>{loanDifference.pricePostTaxDifference.toFixed(0)}</td>
          </tr>
          <tr key="3">
            <td className="text-left">
              <b>Afdrag første år</b>
            </td>
            <td>{loanDifference.instalmentOldLoan.toFixed(0)}</td>
            <td>{loanDifference.instalmentNewLoan.toFixed(0)}</td>
            <td>{loanDifference.instalmentDifference.toFixed(0)}</td>
          </tr>
          <tr key="4">
            <td className="text-left">
              <b>Total tilbagebetaling før skat</b>
            </td>
            <td>{loanDifference.totalPaymentPreTaxOldLoan.toFixed(0)}</td>
            <td>{loanDifference.totalPaymentPreTaxNewLoan.toFixed(0)}</td>
            <td>{loanDifference.totalPaymentPreTaxDifference.toFixed(0)}</td>
          </tr>
          <tr key="5">
            <td className="text-left">
              <b>Total tilbagebetaling efter skat</b>
            </td>
            <td>{loanDifference.totalPaymentPostTaxOldLoan.toFixed(0)}</td>
            <td>{loanDifference.totalPaymentPostTaxNewLoan.toFixed(0)}</td>
            <td>{loanDifference.totalPaymentPostTaxDifference.toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
      {hideBreakevenPrincipalAfterYears ? null : (
        <div className="text-center pb-2">
          <p>Restgæld breakeven i det {loanDifference.breakevenPrincipalAfterYears}. år</p>
        </div>
      )}
      {hideBreakevenTotalPaymentsPostTaxAfterYears ? null : (
        <div className="text-center pb-2">
          <p>Total ydelse efter skat breakeven i det {loanDifference.breakevenTotalPaymentsPostTaxAfterYears}. år</p>
        </div>
      )}
      {hideBreakevenPaymentsPostTaxAfterYears ? null : (
        <div className="text-center pb-2">
          <p>Ydelse efter skat overstiger i det {loanDifference.breakevenPaymentsPostTaxAfterYears}. år</p>
        </div>
      )}
    </div>
  )
}
