import { Component } from 'react'

type MortgageTableProps = {
  years?: number
}

type MortgageTableState = {
  years: number
}

class MortgageTable extends Component<MortgageTableProps, MortgageTableState> {
  render() {
    const { years } = this.props

    return years ? (
      <table>
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
        {[...Array(years)].map((_x, index) => (
          <tr key={index}>
            <td>_x</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
            <td>{index + 1}</td>
          </tr>
        ))}
      </table>
    ) : (
      ''
    )
  }
}

export default MortgageTable
