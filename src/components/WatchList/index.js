import React, { useContext, useEffect, useReducer, useState } from "react"
import SearchAsset from "./SearchAsset"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { getPriceTickers, getWatchList, removeWatchList, saveWatchList } from "../../api";
import SignColorText from "../SignColorText";
import TradeContext from "../../context/TradeContext";
import { StyledScrollDiv } from "../styles";
import AuthContext from "../../context/AuthContext";

const columns = [
  { id: 'name', label: 'Symbol', minWidth: 170 },
  { id: 'base', label: 'Base', minWidth: 100 },
  { id: 'quote', label: 'Quote', minWidth: 100 },
  { id: 'price', label: 'Price', minWidth: 100 },
  { id: 'change', label: 'Change', minWidth: 100 },
  { id: 'volume', label: 'Volume', minWidth: 100 },
];

const arrayReducer = (state, action) => {
  switch(action.type) {
    case 'add':
      return [...state, action.data]
    case 'set':
      return action.data
    case 'batchUpdate':
      const _state = state.map((item) => {
        const updateData = action?.data[item.symbol]
        if (updateData) {
          return { ...item, ...updateData}
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
  const [assets, setAssests] = useState([])
  const { tradeSymbol, setTradeSymbol } = useContext(TradeContext)
  const { userId } = useContext(AuthContext)

  const addAsset = (asset) => {
    if (asset && userId) {
      const { id, symbol, base, quote } = asset
      if (!watchList?.some(({ symbol }) => symbol === asset.symbol)) {
        saveWatchList(userId, [...assets, { id, symbol, base, quote }])
          .then(() => {
            setAssests([...assets, asset])
          })
      }
    }
  }

  const removeAsset = (id) => {
    if (userId && watchList?.some((item) => item.id === id)) {
      removeWatchList(userId, id)
        .then(() => {
          setAssests(assets.filter((asset) => asset.id !== id))
        })
    }
  }

  useEffect(() => {
    if (assets && !tradeSymbol) {
      if (assets && assets.length) {
        setTradeSymbol(assets[0])
      }
    }
  }, [watchList, tradeSymbol, setTradeSymbol, assets])

  useEffect(() => {
    if (userId) 
      getWatchList(userId)
        .then((data) => {
          if (data && data.watchList) {
            setAssests(data.watchList)
          }
        })
  }, [userId])

  useEffect(() => {
    let timer = null
    if (assets.length) {
      watchListDispatch({ type: 'set', data: assets })
      getPriceTickers(assets.map((({ symbol }) => symbol)))
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
    } else {
      watchListDispatch({ type: 'set', data: [] })
    }

    return () => {
      if (timer) clearInterval(timer)
      timer = null
    }
  }, [assets])

  return (
    <StyledScrollDiv className="handle" style={{ width: '100%', height: '100%' }}>
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
            {watchList && watchList.map((row) => {
                return (
                  <Tooltip placement="right" title={<DeleteIcon style={{ cursor: 'pointer' }} onClick={() => removeAsset(row.id)}></DeleteIcon>}>
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
                  </Tooltip>
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
