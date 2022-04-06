import React, { useContext, useMemo } from "react"
import TradeContext from "../../context/TradeContext"
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { StyledScrollDiv } from "../styles";

const TradingView = () => {
  const { tradeSymbol } = useContext(TradeContext)

  const binanceSymbol = useMemo(() => {
    if (tradeSymbol) {
      return `BINANCE:${tradeSymbol.id}`
    } else return null
  }, [tradeSymbol])

  return (
    <StyledScrollDiv className="handle" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <h2>Trading Chart</h2>
      <div style={{ flexGrow: 1 }}>{ binanceSymbol ? (
        <TradingViewWidget
          symbol={binanceSymbol}
          theme={Themes.DARK}
          locale="fr"
          autosize
          // watchlist = {watchList}
        />
      ) : null}
      </div>
    </StyledScrollDiv>
  )
}

export default React.memo(TradingView)
