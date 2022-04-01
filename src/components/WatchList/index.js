import React, { useContext, useEffect, useMemo, useReducer, useState } from "react"
import SearchAsset from "./SearchAsset"
import Paper from '@mui/material/Paper';
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

const columns = [
  { id: 'name', label: 'Symbol', minWidth: 170 },
  { id: 'base', label: 'Base', minWidth: 100 },
  { id: 'quote', label: 'Quote', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100 },
  { id: 'change', label: 'Change', minWidth: 100 }
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


  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <h2>Watch List</h2>
      <SearchAsset addAsset={addAsset} />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
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
              {watchList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code} onClick={() => {
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
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={watchList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
