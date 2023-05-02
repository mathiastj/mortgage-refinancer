import React from 'react'
import { CalculatedLoan } from '../lib/types'

export default function MortgageTable({ calculatedLoan, label }: { calculatedLoan: CalculatedLoan; label: string }) {
  if (calculatedLoan.length === 0) {
    return null
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-4 pt-4">
      <div className="text-center text-lg py-2">
        <p>{label}</p>
      </div>
      <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400 border-separate border-spacing-x-4">
        <thead>
          <tr>
            <th>År</th>
            <th>Restgæld</th>
            <th>Renter</th>
            <th>Afdrag</th>
            <th>Bidrag</th>
            <th>Ydelse før skat</th>
            <th>Fradrag</th>
            <th>Ydelse efter skat</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(calculatedLoan.length)].map((_x, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{calculatedLoan[index].principal.toFixed(0)}</td>
              <td>{calculatedLoan[index].interest.toFixed(0)}</td>
              <td>{calculatedLoan[index].instalment.toFixed(0)}</td>
              <td>{calculatedLoan[index].extraCharge.toFixed(0)}</td>
              <td>{calculatedLoan[index].pricePreTax.toFixed(0)}</td>
              <td>{calculatedLoan[index].taxDeduction.toFixed(0)}</td>
              <td>{calculatedLoan[index].pricePostTax.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
