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
  height: 'calc(100% - 30px)'
  // flexWrap: 'wrap'
}))

const OrderArea = styled('div')(() => ({
  display: 'flex',
  overflow: 'auto',
  minWidth: 200,
  width: '100%',
  maxHeight: '50%',
  '&::-webkit-scrollbar': {
    width: '0.2em'
  },
  '&::-webkit-scrollbar-track': {
    '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: 'none'
  },
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
      }, 3000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, [tradeSymbol, precision])

  const [asks, askMaxVolume] = React.useMemo(() => {
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
        let max = 0
        data.forEach(element => {
          sum += element.amount
          items.push({ ...element, total: sum })
          if (element.totalPrice > max) max = element.totalPrice
        });
        
        if (sortByTotal) {
          items.sort(function(a, b) {
            return b.totalPrice - a.totalPrice
          })
        }
        return [items, max]
      }
    }
    return [null, 0]
  }, [data, sortByTotal])

  const [bids, bidMaxVolume] = React.useMemo(() => {
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
        let max = 0
        bidData.forEach(element => {
          sum += element.amount
          items.push({ ...element, total: sum })
          if (element.totalPrice > max) max = element.totalPrice
        });
        if (sortByTotal) {
          items.sort(function(a, b) {
            return b.totalPrice - a.totalPrice
          })
        }
        return [items, max]
      }
    }
    return [null, 0]
  }, [data, sortByTotal])


  return (
    <StyledScrollDiv className="handle">
      <Header
        setSortByTotal={setSortByTotal}
        sortByTotal={sortByTotal}
        precision={precision}
        addPrecision={addPrecision}
        subPrecision={subPrecision}
      />
      <Wrapper>
        <OrderArea>
          <TableContainer style={{ height: 'max-content'}} component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#111722', border: '1px solid gray'}}>
                  <TableCell component="th" style={{ fontSize: "14px", color: "lightgray", maxWidth: 150 }}>TOTAL</TableCell>
                  <TableCell component="th" style={{ fontSize: "14px", color: "lightgray", maxWidth: 150 }}>AMOUNT</TableCell>
                  <TableCell component="th" style={{ fontSize: "14px", color: "lightgray", maxWidth: 150 }}>ASK</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids?.map(({ price, amount, total, totalPrice }, index) => (
                  <BidTableRow
                    key={price + '-' + amount}
                    sx={{ '&:last-child td, &:last-child th': { border: 0, }, '& > td': { border: 0, fontSize: 12} }}
                    percent={totalPrice / bidMaxVolume * 100}
                    price={price}
                    amount={amount}
                    total={total?.toFixed(4)}
                    style={{border: 'none'}}
                  >
                  </BidTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </OrderArea>
        <OrderArea>
          <TableContainer  style={{ height: 'max-content'}} component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow style={{ backgroundColor: '#111722', border: '1px solid gray'}}>
                  <TableCell style={{ fontSize: "14px", color: "lightgray" }}>TOTAL</TableCell>
                  <TableCell style={{ fontSize: "14px", color: "lightgray" }}>AMOUNT</TableCell>
                  <TableCell style={{ fontSize: "14px", color: "lightgray" }}>BID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asks?.map(({ price, amount, total, totalPrice }, index) => (
                  <AskTableRow
                    key={price + '-' + amount}
                    sx={{ '&:last-child td, &:last-child th': { border: 0}, '& > td': { border: 0, fontSize: 12 } }}
                    percent={totalPrice / askMaxVolume * 100}
                    price={price}
                    amount={amount}
                    total={total?.toFixed(4)}
                    style={{ border: 'none', backgroundColor: '#111722' }}
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
