import React, { useContext, useEffect, useReducer } from "react"
import SearchAsset from "./SearchAsset"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { getPriceTickers } from "../../api";
import SignColorText from "../SignColorText";
import TradeContext from "../../context/TradeContext";
import { StyledScrollDiv } from "../styles";

const columns = [
  { id: 'name', label: 'Symbol', minWidth: 170 },
  { id: 'base', label: 'Base', minWidth: 100 },
  { id: 'quote', label: 'Quote', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100 },
  { id: 'change', label: 'Change', minWidth: 100 },
  { id: 'volume', label: 'Volume', minWidth: 100 }
];

const arrayReducer = (state, action) => {
  switch(action.type) {
    case 'add':
      return [...state, action.data]
    case 'batchUpdate':
      const _state = state.map((item) => {
        const updateData = action?.data[item.symbol]
        if (updateData) {
          return { ...item, ...updateData }
        } else return item
      })
      return _state
    case 'remove':
      const _removeState = state.filter(({ symbol }) => symbol !== action.data )
      return _removeState
    default:
      break
  }
}

export default function StickyHeadTable() {
  const [watchList, watchListDispatch] = useReducer(arrayReducer, [])
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { setTradeSymbol, watchList: watchListToTrade, setWatchList: setWatchListToTrade } = useContext(TradeContext)

  const addAsset = (asset) => {
    setWatchListToTrade([...watchListToTrade, 'BINANCE:' + asset.id])
    if (!watchList?.some(({ symbol }) => symbol === asset.symbol)) watchListDispatch({ type: 'add', data: asset })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const assets = React.useMemo(() => {
    return watchList.map(({ symbol }) => symbol)
  }, [watchList])

  useEffect(() => {
    let timer = null
    if (assets.length) {
      
      getPriceTickers(assets)
        .then((data) => {
          if (data) {
            watchListDispatch({ type: 'batchUpdate', data })
          }
        })
        .catch(() => {})
      timer = setInterval(() => {
        getPriceTickers(assets)
        .then((data) => {
          if (data) {
            watchListDispatch({ type: 'batchUpdate', data })
          }
        })
          .catch(() => {})
      }, 3000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [assets])

  console.log(watchList)


  return (
    <StyledScrollDiv style={{ width: '100%', height: '100%' }}>
      <SearchAsset addAsset={addAsset} />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {watchList.map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.code} onClick={() => {
                    setTradeSymbol(row)
                  }}>
                    <TableCell align='left'>
                      {row.symbol}
                    </TableCell>
                    <TableCell align='left'>
                      {row.base}
                    </TableCell>
                    <TableCell align='left'>
                      {row.quote}
                    </TableCell>
                    <TableCell align='left'>
                      {row.last}
                    </TableCell>
                    <TableCell align='left'>
                      <SignColorText>{row.percentage}</SignColorText>
                    </TableCell>
                    <TableCell align='left'>
                      {row?.info?.volume}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={watchList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </StyledScrollDiv>
  );
}
