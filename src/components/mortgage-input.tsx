import React, { FormEvent, useEffect } from 'react'
import { calculateLoan } from '../lib/calculate-loan'
import { AllLoanInfo, CalculatedLoan, LoanDifference } from '../lib/types'
import { Municipality, MunicipalityType, isMunicipality } from '../lib/municipality-tax-2023'
import LabelWithTooltip from './label-with-tooltip'
import { NextRouter, useRouter } from 'next/router'
import { getLoanInfoFromExample } from '../lib/examples'

type SetCalculatedLoanInfoFn = (calculatedLoanInfo: CalculatedLoan) => void
type SetLoanDifferenceFn = (loanDifference: LoanDifference) => void

const getLoanInfoFromQueryParams = (
  router: NextRouter
): Partial<AllLoanInfo> & { single: boolean; churchTax: boolean; customerKroner: boolean } => {
  // Check for 'example' query param and let that overwrite everything else if set
  if (router.query.example && !Array.isArray(router.query.example)) {
    return getLoanInfoFromExample(router.query.example)
  }

  // Validate municipality from input
  let municipality = undefined
  const municipalityInput = router.query.municipality
  if (municipalityInput && !Array.isArray(municipalityInput) && isMunicipality(municipalityInput)) {
    municipality = municipalityInput
  }

  return {
    principal: router.query.principal ? Number(router.query.principal) : undefined,
    yearsLeft: router.query.terms_left ? Number(router.query.terms_left) : undefined,
    extraCharge: router.query.extra_charge ? Number(router.query.extra_charge) : undefined,
    interest: router.query.interest ? Number(router.query.interest) : undefined,
    estimatedPrice: router.query.estimated_price ? Number(router.query.estimated_price) : undefined,
    otherInterestPerYear: router.query.other_interest_per_year
      ? Number(router.query.other_interest_per_year)
      : undefined,
    currentPrice: router.query.current_price ? Number(router.query.current_price) : undefined,
    single: router.query.single === '' ? true : false,
    churchTax: router.query.church_tax === '' ? true : false,
    municipality,
    customerKroner: router.query.customer_kroner === '' ? true : false,
    currentPriceNewLoan: router.query.current_price_new_loan ? Number(router.query.current_price_new_loan) : undefined,
    feesNewLoan: router.query.fees_new_loan ? Number(router.query.fees_new_loan) : undefined,
    interestNewLoan: router.query.interest_new_loan ? Number(router.query.interest_new_loan) : undefined
  }
}

export default function MortgageInput({
  setOldCalculatedLoan,
  setNewCalculatedLoan,
  setLoanDifference
}: {
  setOldCalculatedLoan: SetCalculatedLoanInfoFn
  setNewCalculatedLoan: SetCalculatedLoanInfoFn
  setLoanDifference: SetLoanDifferenceFn
}) {
  const router = useRouter()
  const loanInfo = getLoanInfoFromQueryParams(router)

  const [single, setSingle] = React.useState(false)
  const [churchTax, setChurchTax] = React.useState(false)
  const [customerKroner, setCustomerKroner] = React.useState(false)
  const [municipality, setMunicipality] = React.useState<MunicipalityType>(Municipality.KØBENHAVN)

  // Update the default values when the query params load
  useEffect(() => {
    setSingle(loanInfo.single)
    setChurchTax(loanInfo.churchTax)
    setCustomerKroner(loanInfo.customerKroner)
    if (loanInfo.municipality) {
      setMunicipality(loanInfo.municipality)
    }
  }, [loanInfo])

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

    const totalCalculation = calculateLoan(data)
    setOldCalculatedLoan(totalCalculation.oldCalculatedLoan)
    setNewCalculatedLoan(totalCalculation.newCalculatedLoan)
    setLoanDifference(totalCalculation.loanDifference)

    return false
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-8">
        <div className="grid gap-6 mb-6 md:grid-cols-1">
          <div>
            <LabelWithTooltip
              inputId="principal"
              label="Restgæld"
              tooltip="Hvor meget der mangler at blive betalt tilbage på lånet lige nu"
            />
            <input
              type="number"
              id="principal"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="2000000"
              required
              defaultValue={loanInfo.principal ?? undefined}
            />
          </div>
          <div>
            <LabelWithTooltip
              inputId="terms_left"
              label="Løbetid tilbage i år"
              tooltip="Hvor mange år der er tilbage af lånet"
            />

            <input
              type="number"
              id="terms_left"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="30"
              required
              defaultValue={loanInfo.yearsLeft ?? undefined}
            />
          </div>
          <div>
            <LabelWithTooltip
              inputId="extra_charge"
              label="Bidragssats i %"
              tooltip="Kan findes på Totalkredits MitHjem. Det er bidragssatsen for det nuværende lån der skal indtastes."
            />
            <input
              type="number"
              step="0.01"
              id="extra_charge"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0.45"
              required
              defaultValue={loanInfo.extraCharge ?? undefined}
            />
          </div>
          <div>
            <LabelWithTooltip inputId="interest" label="Rente i % for nuværende lån" />
            <input
              type="number"
              id="interest"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="1"
              required
              defaultValue={loanInfo.interest ?? undefined}
            />
          </div>
          <div>
            <LabelWithTooltip
              inputId="estimated_price"
              label="Vurdering"
              tooltip="Hvad huset cirka er værd i dag. Hvis ingen ide brug købspris. Bidragssatsen på det nye beregnes automatisk ud fra vurderingen og den restgælden på det nye lån"
            />
            <input
              type="number"
              id="estimated_price"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="3000000"
              required
              defaultValue={loanInfo.estimatedPrice ?? undefined}
            />
          </div>
          <div>
            <LabelWithTooltip
              inputId="other_interest_per_year"
              label="Andre renteudgifter per år"
              tooltip="De første 50.000 i renteudgifter om året per person har et ekstra rentefradrag på 8%. Indtast her andre renteudgifter per år fra fx billån eller SU lån. Beregneren bruger så kun det overskydende ekstra rentefradrag på realkreditlånet. Se fodnote 4 her: https://www.skm.dk/skattetal/satser/skatte-og-afgiftsberegning/skattevaerdi-af-fradrag-i-2023/"
            />
            <input
              type="number"
              id="other_interest_per_year"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="20000"
              required
              defaultValue={loanInfo.otherInterestPerYear ?? undefined}
            />
          </div>
          <div>
            <LabelWithTooltip
              inputId="municipality"
              label="Kommune"
              tooltip="Henter automatisk skattesats og kirkeskattesats på baggrund af kommune. Vælg hvilken kommune du er skattepligtig i."
            />
            <select
              id="municipality"
              name="municipality"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={municipality}
              onChange={e => setMunicipality(e.target.value as MunicipalityType)}
            >
              {Object.values(Municipality).map(municipality => (
                <option key={municipality} value={municipality}>
                  {municipality}
                </option>
              ))}
            </select>
          </div>
          <div>
            <LabelWithTooltip
              inputId="current_price"
              label="Kurs nuværende lån"
              tooltip="Kursen på det nuværende fastforrentede lån. Find først Fondskoden på Totalkredits MitHjem. Derefter find kursen hos Nasdaq. Fx ved at google DK0009537417, eller find den direkte hos https://www.nasdaqomxnordic.com/bonds/denmark"
            />
            <input
              type="number"
              step={0.01}
              id="current_price"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="74.2"
              required
              defaultValue={loanInfo.currentPrice ?? undefined}
            />
          </div>
          <div>
            <LabelWithTooltip
              inputId="current_price_new_loan"
              label="Kurs nyt lån"
              tooltip="Kursen på det nye lån. Kan ses direkte på Totalkredits hjemmeside: https://www.totalkredit.dk/boliglan/kurser-og-priser/"
            />
            <input
              type="number"
              step={0.01}
              id="current_price_new_loan"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="95.2"
              required
              defaultValue={loanInfo.currentPriceNewLoan ?? undefined}
            />
          </div>
          <div>
            <LabelWithTooltip inputId="interest_new_loan" label="Rente i % nyt lån" />
            <input
              type="number"
              id="interest_new_loan"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="4"
              required
              defaultValue={loanInfo.interestNewLoan ?? undefined}
            />
          </div>
          <div>
            <LabelWithTooltip
              inputId="fees_new_loan"
              label="Gebyrer ved omlægning"
              tooltip="Hvad det koster at omlægge lånet. Lægges ind i det nye lån. Hvis man vil lave et ekstraordinært afdrag samtidig på fx 100.000 og de forventede omkostninger er 15.000 kan man indtaste -85.000"
            />
            <input
              type="number"
              id="fees_new_loan"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="15000"
              required
              defaultValue={loanInfo.feesNewLoan ?? undefined}
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
            <LabelWithTooltip
              inputId="couple"
              tooltip="Bruges til om udregne om det ekstra rentefradrag er på 50.000 eller 100.000, se info ved Andre renteudgifter per år"
            />
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
          <LabelWithTooltip
            inputId="customer_kroner"
            tooltip="Totalkredit giver indtil videre 0.15% rabat, tjek denne af hvis det skal medregnes. De 0.15% trækkes fra bidragssatsen på både det nye og det gamle lån."
          />
        </div>
        <div className="grid">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Beregn
          </button>
        </div>
      </div>
    </form>
  )
}
