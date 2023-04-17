import { FormEvent } from 'react'
import MortgageTable from './mortgage-table'

export default function Home() {
  // Handles the submit event on form submit.
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    const target = event.target as typeof event.target & {
      principal: { value: number }
      terms_left: { value: number }
      extra_charge: { value: number }
      interest: { value: number }
      estimated_price: { value: number }
      other_interest_per_year: { value: number }
      current_price: { value: number }
    }

    // Get data from the form.
    const data = {
      principal: target.principal.value,
      terms_left: target.terms_left.value,
      extra_charge: target.extra_charge.value,
      interest: target.interest.value,
      estimated_price: target.estimated_price.value,
      other_interest_per_year: target.other_interest_per_year.value,
      current_price: target.current_price.value
    }

    // do math
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
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
                Bidragssats
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
                Rente
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
                id="remember"
                type="checkbox"
                value=""
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                required
              />
            </div>
            <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              I agree with the{' '}
              <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">
                terms and conditions
              </a>
              .
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </div>
      <MortgageTable years={5} />
    </main>
  )
}
