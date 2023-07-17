import React, { FormEvent, useEffect } from 'react'
import { calculateLoan } from '../lib/calculate-loan'
import { AllLoanInfo, CalculatedLoan, LoanDifference } from '../lib/types'
import { Municipality, MunicipalityType, isMunicipality } from '../lib/municipality-tax-2023'
import LabelWithTooltip from './label-with-tooltip'
import { getLoanInfoFromExample } from '../lib/examples'
import { loanInfoToQueryParam, loanInfoToTypes, defaultValuesFromQueryParams } from '../lib/query-param-mapping'
import { useQuery } from '../lib/use-query'
import { ParsedUrlQuery } from 'querystring'

type SetCalculatedLoanInfoFn = (calculatedLoanInfo: CalculatedLoan) => void
type SetLoanDifferenceFn = (loanDifference: LoanDifference) => void

type LoanInfoDefaults = Omit<
  Partial<AllLoanInfo>,
  'single' | 'churchTax' | 'customerKroner' | 'municipality' | 'instalmentFreeYearsLeft' | 'newLoanInstalmentFree'
> & {
  single: boolean
  churchTax: boolean
  customerKroner: boolean
  municipality: MunicipalityType
  instalmentFreeYearsLeft: number
  newLoanInstalmentFree: boolean
}

const getDefaultLoanInfoFromQueryParams = (query: ParsedUrlQuery): LoanInfoDefaults => {
  // Check for 'example' query param and let that overwrite everything else if set
  if (query.example && !Array.isArray(query.example)) {
    return getLoanInfoFromExample(query.example)
  }

  // Validate municipality from input
  let municipality: MunicipalityType = Municipality.KØBENHAVN // Default to København
  const municipalityInput = query[loanInfoToQueryParam['municipality']]
  if (municipalityInput && !Array.isArray(municipalityInput) && isMunicipality(municipalityInput)) {
    municipality = municipalityInput
  }

  const defaultLoanInfo: LoanInfoDefaults = Object.entries(loanInfoToQueryParam).reduce((acc, [key, queryKey]) => {
    const typedKey = key as keyof AllLoanInfo
    if (loanInfoToTypes[typedKey] === 'number') {
      return { ...acc, [typedKey]: query[queryKey] !== undefined ? Number(query[queryKey]) : undefined }
    }
    if (loanInfoToTypes[typedKey] === 'boolean') {
      return { ...acc, [typedKey]: query[queryKey] === 'true' }
    }
    return { ...acc, [typedKey]: undefined }
  }, defaultValuesFromQueryParams)

  return { ...defaultLoanInfo, municipality }
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
  const [defaultValues, setDefaultValues] = React.useState<LoanInfoDefaults>(defaultValuesFromQueryParams)

  const query = useQuery()

  const [single, setSingle] = React.useState(defaultValues.single)
  const [churchTax, setChurchTax] = React.useState(defaultValues.churchTax)
  const [customerKroner, setCustomerKroner] = React.useState(defaultValues.customerKroner)
  const [municipality, setMunicipality] = React.useState<MunicipalityType>(defaultValues.municipality)
  const [instalmentFreeYearsLeft, setInstalmentFreeYearsLeft] = React.useState<number>(
    defaultValues.instalmentFreeYearsLeft
  )
  const [newLoanInstalmentFree, setNewLoanInstalmentFree] = React.useState(defaultValues.newLoanInstalmentFree)
  const [copyLink, setCopyLink] = React.useState<null | string>(null)

  // Update the default values when the query params load
  useEffect(() => {
    if (!query) {
      return
    }

    const loanInfoFromQuery = getDefaultLoanInfoFromQueryParams(query)
    setDefaultValues(loanInfoFromQuery)
    setSingle(loanInfoFromQuery.single)
    setChurchTax(loanInfoFromQuery.churchTax)
    setCustomerKroner(loanInfoFromQuery.customerKroner)
    setMunicipality(loanInfoFromQuery.municipality)
    setNewLoanInstalmentFree(loanInfoFromQuery.newLoanInstalmentFree)
    setInstalmentFreeYearsLeft(loanInfoFromQuery.instalmentFreeYearsLeft)
  }, [query])

  const onChurchTaxChange = () => {
    setChurchTax(!churchTax)
  }

  const onCustomerKronerChange = () => {
    setCustomerKroner(!customerKroner)
  }

  const onNewLoanInstalmentFreeChange = () => {
    setNewLoanInstalmentFree(!newLoanInstalmentFree)
  }

  const onSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSingle(e.target.value === 'single')
  }

  // Handles the submit event
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
      interest_new_loan: { value: string }
    }

    // Get data from the form and from state
    const data = {
      principal: Number(target.principal.value),
      yearsLeft: Number(target.terms_left.value),
      extraCharge: Number(target.extra_charge.value),
      interest: Number(target.interest.value),
      estimatedPrice: Number(target.estimated_price.value),
      otherInterestPerYear: Number(target.other_interest_per_year.value),
      currentPrice: Number(target.current_price.value),
      instalmentFreeYearsLeft,
      single,
      churchTax,
      municipality,
      customerKroner,
      newLoanInstalmentFree,
      currentPriceNewLoan: Number(target.current_price_new_loan.value),
      feesNewLoan: Number(target.fees_new_loan.value),
      interestNewLoan: Number(target.interest_new_loan.value)
    }

    // Doing a 'downwards' conversion of a loan with current price above 100, will always allow the user to convert the loan at price 100
    data.currentPrice = Math.min(data.currentPrice, 100)

    // Create shareable link
    const newLink = `${location.protocol + '//' + location.host + location.pathname}?${Object.entries(data)
      .map(([k, v]) => {
        const typedKey = k as keyof AllLoanInfo
        return `${loanInfoToQueryParam[typedKey]}=${encodeURIComponent(v)}`
      })
      .join('&')}`
    setCopyLink(newLink)

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
              defaultValue={defaultValues.principal}
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
              defaultValue={defaultValues.yearsLeft}
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
              step={0.01}
              id="extra_charge"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0.45"
              required
              defaultValue={defaultValues.extraCharge}
            />
          </div>
          <div>
            <LabelWithTooltip inputId="interest" label="Rente i % for nuværende lån" />
            <input
              type="number"
              id="interest"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="1"
              step={0.01}
              min={-1}
              required
              defaultValue={defaultValues.interest}
            />
          </div>
          <div>
            <LabelWithTooltip inputId="instalment_free_years_left" label="År tilbage af afdragsfrihed" />
            <select
              id="instalment_free_years_left"
              name="instalment_free_years_left"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={instalmentFreeYearsLeft}
              onChange={e => setInstalmentFreeYearsLeft(Number(e.target.value))}
            >
              {/* Add years 0 through 10 */}
              {Array.from({ length: 11 }, (v, i) => i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
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
              defaultValue={defaultValues.estimatedPrice}
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
              defaultValue={defaultValues.otherInterestPerYear}
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
              tooltip="Kursen på det nuværende fastforrentede lån. Find først Fondskoden på Totalkredits MitHjem. Derefter find kursen hos Nasdaq. Fx ved at google DK0009537417, eller find den direkte hos https://www.nasdaqomxnordic.com/bonds/denmark. Kurser over 100 behandles som kurs 100, da lånet altid kan indfries til det."
            />
            <input
              type="number"
              step={0.01}
              id="current_price"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="74.2"
              required
              defaultValue={defaultValues.currentPrice}
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
              defaultValue={defaultValues.currentPriceNewLoan}
            />
          </div>
          <div>
            <LabelWithTooltip inputId="interest_new_loan" label="Rente i % nyt lån" />
            <input
              type="number"
              id="interest_new_loan"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="4"
              step={0.5}
              min={0.5}
              required
              defaultValue={defaultValues.interestNewLoan}
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
              defaultValue={defaultValues.feesNewLoan}
            />
          </div>
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="new_loan_instalment_free"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              checked={newLoanInstalmentFree}
              onChange={onNewLoanInstalmentFreeChange}
            />
          </div>
          <label
            htmlFor="new_loan_instalment_free"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            10 års afdragsfrihed nyt lån
          </label>
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
        <div className="grid py-6">
          {copyLink && (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(copyLink)
                alert('Link kopieret til udklipsholder')
              }}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Kopier link til beregning
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
