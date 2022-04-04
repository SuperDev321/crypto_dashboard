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
import Header from './Header';

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
  const [sortByTotal, setSortByTotal] = React.useState(true)
  const [precision, setPrecision] = React.useState(5)

  const addPrecision = React.useCallback(() => {
    setPrecision(precision > 8 ? 10 : precision + 1)
  }, [precision])

  const subPrecision = React.useCallback(() => {
    setPrecision(precision - 1 > 0 ? precision - 1 : 1)
  }, [precision])

  React.useEffect(() => {
    let timer = null
    if (tradeSymbol) {
      getOrderBook(tradeSymbol.symbol, {
        amount: precision,
        price: precision
      }).then((data) => data && setData(data))
      timer = setInterval(() => {
        getOrderBook(tradeSymbol.symbol, {
          amount: precision,
          price: precision
        }).then((data) => data && setData(data))
      }, 1000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [tradeSymbol, precision])

  const asks = React.useMemo(() => {
    if (data) {
      const { asks } = data
      if (asks) {
        let data = asks.reverse().map((item) => {
          return {
            price: item[0],
            amount: item[1],
            totalPrice: item[0]*item[1]
          }
        })
        let items = []
        let sum = 0
        data.forEach(element => {
          sum += element.amount
          items.push({ ...element, total: sum })
        });
        if (sortByTotal) {
          items.sort(function(a, b) {
            return b.totalPrice - a.totalPrice
          })
        }
        return items
      }
    }
    return null
  }, [data, sortByTotal])

  const bids = React.useMemo(() => {
    if (data) {
      const { bids } = data
      if (bids) {
        let bidData = bids.reverse().map((item) => {
          return {
            price: item[0],
            amount: item[1],
            totalPrice: item[0] * item[1]
          }
        })
        let items = []
        let sum = 0
        bidData.forEach(element => {
          sum += element.amount
          items.push({ ...element, total: sum })
        });
        if (sortByTotal) {
          items.sort(function(a, b) {
            return b.totalPrice - a.totalPrice
          })
        }
        return items
      }
    }
    return null
  }, [data, sortByTotal])


  return (
    <StyledScrollDiv>
      <Header
        setSortByTotal={setSortByTotal}
        sortByTotal={sortByTotal}
        precision={precision}
        addPrecision={addPrecision}
        subPrecision={subPrecision}
      />
      <Wrapper>
        <OrderArea>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell component="th" style={{ maxWidth: 150 }}>Total</TableCell>
                  <TableCell component="th" style={{ maxWidth: 150 }}>Amount</TableCell>
                  <TableCell component="th" style={{ maxWidth: 150 }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids?.map(({ price, amount, total, totalPrice }, index) => (
                  <BidTableRow
                    key={price + '-' + amount}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    percent={totalPrice * 50}
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
                {asks?.map(({ price, amount, total, totalPrice }, index) => (
                  <AskTableRow
                    key={price + '-' + amount}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    percent={totalPrice*50}
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
