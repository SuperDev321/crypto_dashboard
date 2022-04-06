import SortIcon from '@mui/icons-material/Sort';
// import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import SettingsIcon from '@mui/icons-material/Settings';
import Popover from '@mui/material/Popover';
import { Box, Slider } from '@mui/material';
import { useState } from 'react';

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '100',
  },
  {
    value: 30,
    label: '1K',
  },
  {
    value: 40,
    label: '10K',
  },
  {
    value: 50,
    label: '100K',
  },
  {
    value: 60,
    label: '1M',
  },
  {
    value: 70,
    label: 'oo',
  },
];

function valueLabelFormat(value) {
  const mark = marks.find((mark) => mark.value === value);
  return mark?.label
}
const Header = ({ range, setRange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChangeSlider = (event, newValue) => {
    event.preventDefault()
    setRange(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 15, marginRight: 15}}>
      <span>Trades</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <SettingsIcon></SettingsIcon>
        <div style={{marginLeft: 5}}>Size: any size</div>
        <SortIcon aria-describedby={id} style={{cursor: 'pointer'}}  onClick={handleClick}></SortIcon>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <Box sx={{ width: 300 }} m={2}>
            <span>Filter by volume</span>
            <Slider
              getAriaLabel={() => 'Temperature range'}
              value={range}
              step={null}
              marks={marks}
              onChange={handleChangeSlider}
              valueLabelDisplay="auto"
              valueLabelFormat={valueLabelFormat}
              max={70}
            />
          </Box>
        </Popover>
      </div>
      
    </div>
  )
}

export default Header
