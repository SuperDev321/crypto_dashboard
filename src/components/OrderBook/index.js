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
// import { useAsync } from '../../hooks/useAsync';
import { getOrderBook } from '../../api';
import { StyledScrollDiv } from '../styles';
import { AskTableRow, BidTableRow } from './Blink';


const Wrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap'
}))

const OrderArea = styled('div')(() => ({
  overflow: 'auto',
  minWidth: 200
}))

export default function OrderBook() {
  const { tradeSymbol } = React.useContext(TradeContext)
  const [data, setData] = React.useState()

  React.useEffect(() => {
    let timer = null
    if (tradeSymbol) {
      getOrderBook(tradeSymbol.symbol).then((data) => data && setData(data))
      timer = setInterval(() => {
        getOrderBook(tradeSymbol.symbol).then((data) => data && setData(data))
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
      if (asks) {
        let data = asks.reverse().map((item) => {
          return {
            total: item[0] * item[1],
            price: item[0],
            amount: item[1]
          }
        })
        let items = []
        let sum = 0
        data.forEach(element => {
          sum += element.total
          items.push({ ...element, sum })
        });
        return items
      }
    }
    return null
  }, [data])

  const bids = React.useMemo(() => {
    if (data) {
      const { bids } = data
      if (bids) {
        let bidData = bids.reverse().map((item) => {
          return {
            total: item[0] * item[1],
            price: item[0],
            amount: item[1]
          }
        })
        let items = []
        let sum = 0
        bidData.forEach(element => {
          sum += element.total
          items.push({ ...element, sum })
        });
        return items
      }
    }
    return null
  }, [data])

  const bidVolume = bids ? bids[bids.length - 1]?.sum : 0
  const askVolume = asks ? asks[asks.length - 1]?.sum : 0

  return (
    <StyledScrollDiv>
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
                {bids?.map(({ price, amount, total, sum }, index) => (
                  <BidTableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    percent={bidVolume ? sum / bidVolume * 100 : 0}
                    price={price}
                    amount={amount}
                    total={total}
                  >
                  </BidTableRow>
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
                {asks?.map(({ price, amount, total, sum }, index) => (
                  <AskTableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    percent={askVolume ? sum / askVolume * 100 : 0}
                    price={price}
                    amount={amount}
                    total={total}
                  >
                  </AskTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </OrderArea>
      </Wrapper>
    </StyledScrollDiv>
  );
}
