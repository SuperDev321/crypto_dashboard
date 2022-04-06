// import { useState } from "react"
import { styled, TableCell, TableRow } from "@mui/material"

const BlueTableRow = styled(TableRow)((props) => ({
  backgroundImage: `linear-gradient(to left, rgba(2, 199, 122, 0.25), rgba(2, 199, 122, 0.4) ${props.percent}%, rgba(2, 199, 122,  ${props.state? '0.05' : '0'}) ${props.percent}%)`
}))

const RedTableRow = styled(TableRow)((props) => ({
  backgroundImage: `linear-gradient(to left, rgba(255, 59, 105, 0.25), rgba(255, 59, 105, 0.25) ${props.percent}%, rgba(255, 59, 105, ${props.state? '0.05' : '0'}) ${props.percent}%)`
}))

const BidTableRow = ({ percent, price, amount, total }) => {
  // const [state, setState] = useState(false)

  return (
    <BlueTableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      percent={percent}
      // state={state}
    >
      <TableCell scope="row">{total}</TableCell>
      <TableCell scope="row">{amount}</TableCell>
      
      <TableCell scope="row" style={{color: 'green' }}>
        {price}
      </TableCell>
    </BlueTableRow>
  )
}

const AskTableRow = ({ percent, price, amount, total }) => {
  // const [state, setState] = useState(false)

  // useEffect(() => {
  //   setState(true)
  // }, [price, amount])

  // useEffect(() => {
  //   let timeHandler = null
  //   if (state) {
  //     timeHandler = setTimeout(() => {
  //       setState(false)
  //     }, 100)
  //   }

  //   return () => {
  //     clearTimeout(timeHandler)
  //   }
  // }, [state])

  return (
    <RedTableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      percent={percent}
      // state={state}
    >
      <TableCell scope="row">{total}</TableCell>
      <TableCell scope="row">{amount}</TableCell>
      <TableCell scope="row" style={{color: 'red' }}>
        {price}
      </TableCell>
      
    </RedTableRow>
  )
}

export {
  BidTableRow,
  AskTableRow
}
