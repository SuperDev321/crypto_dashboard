import React, { useContext, useMemo } from "react"
import TradeContext from "../../context/TradeContext"
import TradingViewWidget, { Themes } from 'react-tradingview-widget';

const TradingView = () => {
  const { tradeSymbol } = useContext(TradeContext)

  const binanceSymbol = useMemo(() => {
    if (tradeSymbol) {
      return `BINANCE:${tradeSymbol.id}`
    } else return null
  }, [tradeSymbol])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <h2>Trading Chart</h2>
      <div style={{ flexGrow: 1 }}>{ binanceSymbol ? (
        <TradingViewWidget
          symbol={binanceSymbol}
          theme={Themes.Light}
          locale="fr"
          autosize
          // watchlist = {watchList}
        />
      ) : null}
      </div>
    </div>
  )
}

export default React.memo(TradingView)
