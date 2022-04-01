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
import { useAsync } from '../../hooks/useAsync';
import { getOrderBook } from '../../api';
import { makeId } from '../../utils';


const Wrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center'
}))

const OrderArea = styled('div')(() => ({
  width: '50%',
  overflow: 'auto',

}))

export default function OrderBook() {
  const { tradeSymbol, watchList } = React.useContext(TradeContext)
  // const { data, run, loading } = useAsync({
  //   data: null,
  //   error: null
  // })
  const [data, setData] = React.useState()

  React.useEffect(() => {
    let timer = null
    if (tradeSymbol) {
      getOrderBook(tradeSymbol.symbol).then((data) => setData(data))
      timer = setInterval(() => {
        getOrderBook(tradeSymbol.symbol).then((data) => setData(data))
      }, 1000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [tradeSymbol])

  const asks = React.useMemo(() => {
    if (data) {
      const { asks } = data
      if (asks) return asks?.reverse()
    }
    return null
  }, [data])

  const bids = React.useMemo(() => {
    if (data) {
      const { bids } = data
      if (bids) return bids?.reverse()
    }
    return null
  }, [data])


  return (
    <div style={{ maxHeight: '100%', overflow: 'auto' }}>
      <h2>OrderBook</h2>
      <Wrapper>
        <OrderArea>
          <h3>Bids</h3>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell component="th" style={{ maxWidth: 150 }}>Price</TableCell>
                  <TableCell component="th" style={{ maxWidth: 150 }}>Amount</TableCell>
                  <TableCell component="th" style={{ maxWidth: 150 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids?.map((row) => (
                  <TableRow
                    key={makeId(5)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell scope="row" style={{color: 'green' }}>
                      {row[0]}
                    </TableCell>
                    <TableCell scope="row">{row[1]}</TableCell>
                    <TableCell scope="row">{row[0] * row[1]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </OrderArea>
        <OrderArea>
          <h3>Asks</h3>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asks?.map((row) => (
                  <TableRow
                    key={makeId(5)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell scope="row" style={{color: 'red' }}>
                      {row[0]}
                    </TableCell>
                    <TableCell scope="row">{row[1]}</TableCell>
                    <TableCell scope="row">{row[0] * row[1]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </OrderArea>
      </Wrapper>
    </div>
  );
}
