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
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <div className="text-center text-4xl">
        <p>Beregn omlægning af fastforrentet Totalkredit lån med afdrag</p>
      </div>
      <div className="z-10 w-full max-w-fit items-center justify-between font-mono text-sm lg:flex py-8">
        <MortgageInput
          setOldCalculatedLoan={setOldCalculatedLoan}
          setNewCalculatedLoan={setNewCalculatedLoan}
          setLoanDifference={setLoanDifference}
        />
        <MortgageDifferenceTable loanDifference={loanDifference} />
      </div>
      <div className="z-10 w-full max-w-fit items-center justify-between font-mono text-sm lg:flex">
        <MortgageTable calculatedLoan={oldCalculatedLoan} label={'Nuværende lån'} />
        <MortgageTable calculatedLoan={newCalculatedLoan} label={'Nyt lån'} />
      </div>
    </main>
  )
}
