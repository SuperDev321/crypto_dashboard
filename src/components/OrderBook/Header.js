import SortIcon from '@mui/icons-material/Sort';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/material';

const Header = ({ sortByTotal, setSortByTotal, precision, addPrecision, subPrecision }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 15, marginRight: 15}}>
      <span>Orderbook</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <SettingsIcon></SettingsIcon>
        {sortByTotal ? (<SortIcon style={{cursor: 'pointer'}} onClick={() => setSortByTotal(false)}></SortIcon>) : (
          <FormatAlignCenterIcon style={{cursor: 'pointer'}} onClick={() => setSortByTotal(true)}></FormatAlignCenterIcon>
        )}
        <div style={{marginLeft: 5}}>precision: {precision}</div>
        <AddIcon style={{cursor: 'pointer'}} onClick={() => addPrecision()}></AddIcon>
        <RemoveIcon style={{cursor: 'pointer'}} onClick={() => subPrecision()}></RemoveIcon>
      </div>
      
    </div>
  )
}

export default Header
