import { styled } from '@mui/material'

const StyledText = styled('span')((props) => ({
  color: props.plus ? 'blue' : 'red'
}))

const SignColorText = ({ children }) => {
  const plus = Number(children) > 0
  return (
    <StyledText plus={plus}>
      { children }
    </StyledText>
  )
}

export default SignColorText
