import * as React from 'react';
import { styled } from '@mui/material'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TradeContext from '../../context/TradeContext';
import { getTrades } from '../../api';
import { timeConverter } from '../../utils';
import { StyledScrollDiv } from '../styles';
import Header from './Header';


const Wrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexGrow: 1
}))

const StyledCell = styled(TableCell)((props) => ({
  width: '50%',
  overflow: 'auto',
  color: props.sell ? '#f73969' : '#02c77a'
}))

export default function Trades() {
  const { tradeSymbol } = React.useContext(TradeContext)
  const [data, setData] = React.useState()
  const [range, setRange] = React.useState([0, 70])

  React.useEffect(() => {
    let timer = null
    if (tradeSymbol) {
      const [start, end] = range
      const rangeDay = (end - start) / 10
      const startVolume = start === 70 ? undefined : start ? Math.pow(10, start / 10) : 0
      const endVolume = end === 70 ? undefined : end ? Math.pow(10, end / 10) : 0
      getTrades(tradeSymbol.symbol, 7 - rangeDay > 0 ? 7 - rangeDay : 1, (7 - rangeDay) > 0 ? (7 - rangeDay) * 100 : 100).then((data) => {
        if (data) {
          let trades = [...data]
          if (startVolume) {
            trades = trades.filter(({ price, amount }) => price * amount >= startVolume)
          }
          if (endVolume) {
            trades = trades.filter(({ price, amount }) => price * amount <= endVolume)
          }
          setData(trades)
        }
      })
      timer = setInterval(() => {
        getTrades(tradeSymbol.symbol, 7 - rangeDay > 0 ? 7 - rangeDay : 1, (7 - rangeDay) > 0 ? (7 - rangeDay) * 100 : 100).then((data) => {
          if (data) {
            let trades = [...data]
            if (startVolume) {
              trades = trades.filter(({ price, amount }) => price * amount > startVolume)
            }
            if (endVolume) {
              trades = trades.filter(({ price, amount }) => price * amount < endVolume)
            }
            setData(trades)
          }
        })
      }, 3000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, [tradeSymbol, range])

  return (
    <StyledScrollDiv style={{ overflow: 'auto' }}>
      <Header range={range} setRange={setRange} />
      <Wrapper className="handle">
        <TableContainer component={Paper} style={{ backgroundColor: '#111722' }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell component="th" style={{ fontSize: "14px", color: "lightgray" }}>TIME</TableCell>
                <TableCell component="th" style={{ fontSize: "14px", color: "lightgray" }}>PRICE</TableCell>
                <TableCell component="th" style={{ fontSize: "14px", color: "lightgray" }}>AMOUNT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '& > td': { border: 0, fontSize: 12}, background: '#111722'}}
                >
                  <TableCell scope="row">{timeConverter(row.timestamp)}</TableCell>
                  <StyledCell scope="row" sell={row.side === 'sell'}>
                    {row.price}
                  </StyledCell>
                  <TableCell scope="row">{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Wrapper>
    </StyledScrollDiv>
  );
}
