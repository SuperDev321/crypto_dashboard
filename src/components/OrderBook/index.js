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
import { StyledScrollDiv } from '../styles';


const Wrapper = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap'
}))

const OrderArea = styled('div')(() => ({
  overflow: 'auto',
  minWidth: 200
}))

const BidTableRow = styled(TableRow)((props) => ({
  backgroundImage: `linear-gradient(to left, rgba(2, 199, 122, 0.25), rgba(2, 199, 122, 0.25) ${props.percent}%, rgba(0, 0, 0, 0) ${props.percent}%)`
}))

const AskTableRow = styled(TableRow)((props) => ({
  backgroundImage: `linear-gradient(to right, rgba(255, 59, 105, 0.25), rgba(255, 59, 105, 0.25) ${props.percent}%, rgba(0, 0, 0, 0) ${props.percent}%)`
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
                {bids?.map((row, index) => (
                  <BidTableRow
                    key={makeId(5)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    percent={bidVolume ? row.sum / bidVolume * 100 : 0}
                  >
                    <TableCell scope="row" style={{color: 'green' }}>
                      {row.price}
                    </TableCell>
                    <TableCell scope="row">{row.amount}</TableCell>
                    <TableCell scope="row">{row.total}</TableCell>
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
                {asks?.map((row) => (
                  <AskTableRow
                    key={makeId(5)}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    percent={askVolume ? row.sum / askVolume * 100 : 0}
                  >
                    <TableCell scope="row" style={{color: 'red' }}>
                      {row.price}
                    </TableCell>
                    <TableCell scope="row">{row.amount}</TableCell>
                    <TableCell scope="row">{row.total}</TableCell>
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
