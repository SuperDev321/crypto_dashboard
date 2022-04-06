import { styled } from "@mui/material";

const StyledScrollDiv = styled('div')(() => ({
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
  maxHeight: '100%',
  height: '100%',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column'
}))

export {
  StyledScrollDiv
}
