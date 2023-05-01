import React from 'react'
import MortgageInput from './mortgage-input'
import MortgageTable from './mortgage-table'
import MortgageDifferenceTable from './mortgage-difference-table'
import { CalculatedLoan, LoanDifference } from './types'

export default function Home() {
  const [oldCalculatedLoan, setOldCalculatedLoan] = React.useState<CalculatedLoan>([])
  const [newCalculatedLoan, setNewCalculatedLoan] = React.useState<CalculatedLoan>([])
  const [loanDifference, setLoanDifference] = React.useState<LoanDifference>()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-fit items-center justify-between font-mono text-sm lg:flex">
        <MortgageInput
          setOldCalculatedLoan={setOldCalculatedLoan}
          setNewCalculatedLoan={setNewCalculatedLoan}
          setLoanDifference={setLoanDifference}
        />
        <MortgageDifferenceTable loanDifference={loanDifference} />
      </div>
      <div className="z-10 w-full max-w-fit items-start justify-between font-mono text-xl lg:flex">
        <p>Nuværende lån</p>
        <p>Nyt lån</p>
      </div>
      <div className="z-10 w-full max-w-fit items-center justify-between font-mono text-sm lg:flex">
        <MortgageTable calculatedLoan={oldCalculatedLoan} />
        <MortgageTable calculatedLoan={newCalculatedLoan} />
      </div>
    </main>
  )
}
