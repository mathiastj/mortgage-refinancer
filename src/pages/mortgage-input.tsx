import React, { FormEvent } from 'react'
import { calculateLoan } from './calculate-loan'
import { CalculatedLoan } from './types'
import { Municipality, MunicipalityType } from './municipality-tax-2023'

type SetCalculatedLoanInfoFn = (calculatedLoanInfo: CalculatedLoan) => void

export default function MortgageInput({ setCalculatedLoan }: { setCalculatedLoan: SetCalculatedLoanInfoFn }) {
  const [single, setSingle] = React.useState(false)
  const [churchTax, setChurchTax] = React.useState(false)

  const onChurchTaxChange = () => {
    setChurchTax(!churchTax)
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
      municipality: target.municipality.value
    }

    const calculatedLoan = calculateLoan(data)
    setCalculatedLoan(calculatedLoan)

    return false
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        {/* make larger and spacing*/}
        Nuværende lån:
      </p>

      <div className="grid gap-6 mb-6 md:grid-cols-1">
        <div>
          <label htmlFor="principal" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Hovedstol
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
            Bidragssats i % (kan udregnes ud fra vurdering og hovedstol)
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
            Rente i %
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
            Kurs
          </label>
          <input
            type="number"
            id="current_price"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="74.2"
            required
          />
        </div>
        {/* more: price/kurs of new loan, new loan interest rate, single or two persons on the loan for 50k/100k rate, municipality for taxes, church tax toggle */}
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
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Beregn
      </button>
    </form>
  )
}
