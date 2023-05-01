import React from 'react'
import { LoanDifference } from './types'

export default function MortgageDifferenceTable({ loanDifference }: { loanDifference?: LoanDifference }) {
  if (!loanDifference) {
    return null
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="text-center">
        <p>Låneforskel</p>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-separate border-spacing-x-4">
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
            <td>
              <b>Restgæld</b>
            </td>
            <td>{loanDifference.principalOldLoan.toFixed(0)}</td>
            <td>{loanDifference.principalNewLoan.toFixed(0)}</td>
            <td>{loanDifference.principalDifference.toFixed(0)}</td>
          </tr>
          <tr key="2">
            <td>
              <b>Ydelse før skat første år</b>
            </td>
            <td>{loanDifference.pricePreTaxOldLoan.toFixed(0)}</td>
            <td>{loanDifference.pricePreTaxNewLoan.toFixed(0)}</td>
            <td>{loanDifference.pricePreTaxDifference.toFixed(0)}</td>
          </tr>
          <tr key="3">
            <td>
              <b>Ydelse efter skat første år</b>
            </td>
            <td>{loanDifference.pricePostTaxOldLoan.toFixed(0)}</td>
            <td>{loanDifference.pricePostTaxNewLoan.toFixed(0)}</td>
            <td>{loanDifference.pricePostTaxDifference.toFixed(0)}</td>
          </tr>
          <tr key="3">
            <td>
              <b>Afdrag første år</b>
            </td>
            <td>{loanDifference.instalmentOldLoan.toFixed(0)}</td>
            <td>{loanDifference.instalmentNewLoan.toFixed(0)}</td>
            <td>{loanDifference.instalmentDifference.toFixed(0)}</td>
          </tr>
          <tr key="4">
            <td>
              <b>Total tilbagebetaling før skat</b>
            </td>
            <td>{loanDifference.totalPaymentPreTaxOldLoan.toFixed(0)}</td>
            <td>{loanDifference.totalPaymentPreTaxNewLoan.toFixed(0)}</td>
            <td>{loanDifference.totalPaymentPreTaxDifference.toFixed(0)}</td>
          </tr>
          <tr key="5">
            <td>
              <b>Total tilbagebetaling efter skat</b>
            </td>
            <td>{loanDifference.totalPaymentPostTaxOldLoan.toFixed(0)}</td>
            <td>{loanDifference.totalPaymentPostTaxNewLoan.toFixed(0)}</td>
            <td>{loanDifference.totalPaymentPostTaxDifference.toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
      {/* only show if not -1 */}
      <div className="text-center">
        {loanDifference.breakEvenPrincipalAfterYears === -0 ? null : (
          <p>Restgæld break even efter {loanDifference.breakEvenPrincipalAfterYears} år</p>
        )}
      </div>
      {/* only show if not -1 */}
      <div className="text-center">
        {loanDifference.breakEvenPaymentsPostTaxAfterYears === -1 ? null : (
          <p>Ydelse efter skat break even efter {loanDifference.breakEvenPaymentsPostTaxAfterYears} år</p>
        )}
      </div>
    </div>
  )
}
