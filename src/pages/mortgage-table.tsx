import React from 'react'

// https://nextjs.org/learn/foundations/from-javascript-to-react/adding-interactivity-with-state
export default function MortgageTable({ years }: { years: number }) {
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
        {[...Array(years)].map((_x, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
