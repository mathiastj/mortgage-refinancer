import React from 'react'
import MortgageInput from './mortgage-input'
import MortgageTable from './mortgage-table'

export default function Home() {
  const [calculatedLoan, setCalculatedLoan] = React.useState([
    {
      principal: 0,
      extraCharge: 0,
      interest: 0,
      instalment: 0,
      pricePreTax: 0,
      taxDeduction: 0,
      pricePostTax: 0
    }
  ])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <MortgageInput setCalculatedLoan={setCalculatedLoan} />
        <MortgageTable calculatedLoan={calculatedLoan} />
      </div>
    </main>
  )
}
