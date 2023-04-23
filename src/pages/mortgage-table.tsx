import React from 'react'
import { CalculatedLoan } from './types'

export default function MortgageTable({ calculatedLoan }: { calculatedLoan: CalculatedLoan }) {
  return (
    <table>
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
            <td>{calculatedLoan[index].principal}</td>
            <td>{calculatedLoan[index].interest}</td>
            <td>{calculatedLoan[index].instalment}</td>
            <td>{calculatedLoan[index].extraCharge}</td>
            <td>{calculatedLoan[index].pricePreTax}</td>
            <td>{calculatedLoan[index].taxDeduction}</td>
            <td>{calculatedLoan[index].pricePostTax}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
