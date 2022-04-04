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
  justifyContent: 'center'
}))

const StyledCell = styled(TableCell)((props) => ({
  width: '50%',
  overflow: 'auto',
  color: props.sell ? 'red' : 'green'
}))



export default function Trades() {
  const { tradeSymbol } = React.useContext(TradeContext)
  const [data, setData] = React.useState()

  React.useEffect(() => {
    let timer = null
    if (tradeSymbol) {
      getTrades(tradeSymbol.symbol).then((data) => data && setData(data.reverse()))
      timer = setInterval(() => {
        getTrades(tradeSymbol.symbol).then((data) => data && setData(data.reverse()))
      }, 1000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [tradeSymbol])

  return (
    <StyledScrollDiv style={{ maxHeight: '100%', overflow: 'auto' }}>
      <Header />
      <Wrapper>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell component="th">Price</TableCell>
                <TableCell component="th">Amount</TableCell>
                <TableCell component="th">Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <StyledCell scope="row" sell={row.side === 'sell'}>
                    {row.price}
                  </StyledCell>
                  <TableCell scope="row">{row.amount}</TableCell>
                  <TableCell scope="row">{timeConverter(row.timestamp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Wrapper>
    </StyledScrollDiv>
  );
}
