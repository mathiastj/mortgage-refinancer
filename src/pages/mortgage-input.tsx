import React, { FormEvent } from 'react'
import { calculateLoan, calculateExtraCharge } from './calculate-loan'
import { CalculatedLoan, LoanDifference } from './types'
import { Municipality, MunicipalityType } from './municipality-tax-2023'

type SetCalculatedLoanInfoFn = (calculatedLoanInfo: CalculatedLoan) => void
type SetLoanDifferenceFn = (loanDifference: LoanDifference) => void

export default function MortgageInput({
  setOldCalculatedLoan,
  setNewCalculatedLoan,
  setLoanDifference
}: {
  setOldCalculatedLoan: SetCalculatedLoanInfoFn
  setNewCalculatedLoan: SetCalculatedLoanInfoFn
  setLoanDifference: SetLoanDifferenceFn
}) {
  const [single, setSingle] = React.useState(false)
  const [churchTax, setChurchTax] = React.useState(false)
  const [customerKroner, setCustomerKroner] = React.useState(false)

  const onChurchTaxChange = () => {
    setChurchTax(!churchTax)
  }

  const onCustomerKronerChange = () => {
    setCustomerKroner(!customerKroner)
  }

  const onSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSingle(e.target.value === 'single')
  }

  // Handles the submit event on form submit.
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    const target = event.target as typeof event.target & {
      principal: { value: string }
      terms_left: { value: string }
      extra_charge: { value: string }
      interest: { value: string }
      estimated_price: { value: string }
      other_interest_per_year: { value: string }
      current_price: { value: string }
      municipality: { value: MunicipalityType }
      current_price_new_loan: { value: string }
      fees_new_loan: { value: string }
      interest_new_loan: { value: MunicipalityType }
    }

    // Get data from the form.
    const data = {
      principal: Number(target.principal.value),
      yearsLeft: Number(target.terms_left.value),
      extraCharge: Number(target.extra_charge.value),
      interest: Number(target.interest.value),
      estimatedPrice: Number(target.estimated_price.value),
      otherInterestPerYear: Number(target.other_interest_per_year.value),
      currentPrice: Number(target.current_price.value),
      single,
      churchTax,
      municipality: target.municipality.value,
      customerKroner,
      currentPriceNewLoan: Number(target.current_price_new_loan.value),
      feesNewLoan: Number(target.fees_new_loan.value),
      interestNewLoan: Number(target.interest_new_loan.value)
    }
    // const extraCharge = calculateExtraCharge(data) // Remember to only use this for the new loan!
    // data.extraCharge = extraCharge

    const totalCalculation = calculateLoan(data)
    setOldCalculatedLoan(totalCalculation.oldCalculatedLoan)
    setNewCalculatedLoan(totalCalculation.newCalculatedLoan)
    setLoanDifference(totalCalculation.loanDifference)

    return false
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 mb-6 md:grid-cols-1">
        <div>
          <label htmlFor="principal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Restgæld
          </label>
          <input
            type="number"
            id="principal"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="2000000"
            required
          />
        </div>
        <div>
          <label htmlFor="terms_left" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Løbetid tilbage i år
          </label>
          <input
            type="number"
            id="terms_left"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="30"
            required
          />
        </div>
        <div>
          <label htmlFor="extra_charge" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Bidragssats i % for nuværende lån
          </label>
          <input
            type="number"
            step="0.01"
            id="extra_charge"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="0.45"
            required
          />
        </div>
        <div>
          <label htmlFor="interest" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Rente i % for nuværende lån
          </label>
          <input
            type="number"
            id="interest"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="1"
            required
          />
        </div>
        <div>
          <label htmlFor="estimated_price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Vurdering
          </label>
          <input
            type="number"
            id="estimated_price"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="3000000"
            required
          />
        </div>
        <div>
          <label
            htmlFor="other_interest_per_year"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Andre renteudgifter per år
          </label>
          <input
            type="number"
            id="other_interest_per_year"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="20000"
            required
          />
        </div>
        <div>
          <label htmlFor="municipality" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Kommune
          </label>
          <select
            id="municipality"
            name="municipality"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {Object.values(Municipality).map(municipality => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="current_price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Kurs nuværende lån
          </label>
          <input
            type="number"
            step={0.01}
            id="current_price"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="74.2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="current_price_new_loan"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Kurs nyt lån
          </label>
          <input
            type="number"
            step={0.01}
            id="current_price_new_loan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="95.2"
            required
          />
        </div>
        <div>
          <label htmlFor="interest_new_loan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Rente i % nyt lån
          </label>
          <input
            type="number"
            id="interest_new_loan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="4"
            required
          />
        </div>
        <div>
          <label htmlFor="fees_new_loan" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Gebyrer ved nyt lån
          </label>
          <input
            type="number"
            id="fees_new_loan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="15000"
            required
          />
        </div>
      </div>
      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input
            id="church_tax"
            type="checkbox"
            value=""
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            checked={churchTax}
            onChange={onChurchTaxChange}
          />
        </div>
        <label htmlFor="church_tax" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Betaler kirkeskat
        </label>
      </div>
      <div className="flex items-start mb-6 space-x-5">
        <div className="flex items-center h-5">
          <input
            id="single"
            type="radio"
            value="single"
            name="single_couple"
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            checked={single}
            onChange={onSingleChange}
          />
          <label htmlFor="single" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Single
          </label>
        </div>

        <div className="flex items-center h-5">
          <input
            id="couple"
            type="radio"
            value="couple"
            name="single_couple"
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            checked={!single}
            onChange={onSingleChange}
          />
          <label htmlFor="couple" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Par
          </label>
        </div>
      </div>
      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input
            id="customer_kroner"
            type="checkbox"
            value=""
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            checked={customerKroner}
            onChange={onCustomerKronerChange}
          />
        </div>
        <label htmlFor="customer_kroner" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Inkluder kundekroner
        </label>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Beregn
      </button>
    </form>
  )
}
