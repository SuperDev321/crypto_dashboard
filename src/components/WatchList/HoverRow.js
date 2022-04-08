import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import SignColorText from "../SignColorText";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

const HoverRow = ({ row, setTradeSymbol, removeAsset }) => {
  const [show, setShow] = useState(false)


  return (
    <TableRow hover
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={-1}
      onClick={() => {
        setTradeSymbol(row)
      }}
      style={{height: 23}}
    >
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
      <TableCell align='left'>
        { show && <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => removeAsset(row.id)}></DeleteIcon>}
      </TableCell>
    </TableRow>
  )
}

export default HoverRow 
