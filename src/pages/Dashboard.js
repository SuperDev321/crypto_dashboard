import WatchList from "../components/WatchList"
import { useEffect, useMemo, useState } from "react";
import TradeContext from "../context/TradeContext";
import TradingView from "../components/TradingView.js";
import OrderBook from "../components/OrderBook";

import { Responsive, WidthProvider } from "react-grid-layout";
import Trades from "../components/Trades";
import { createTheme, Paper, styled } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { getViewConfig, saveViewConfig } from "../api";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthContext";

const ResponsiveGridLayout = WidthProvider(Responsive);

const layouts = { lg: [
  { i: "a", x: 0, y: 0, w: 15, h: 18, minH: 3 },
  { i: "b", x: 15, y: 0, w: 5, h: 26, minH: 2 },
  { i: "d", x: 20, y: 13, w: 4, h: 26, minH: 2 },
  { i: "c", x: 0, y: 18, w: 15, h: 8, minH: 2 },
], md : [
  { i: "a", x: 1, y: 0, w: 8, h: 10, minH: 3 },
  { i: "b", x: 1, y: 10, w: 8, h: 10, minH: 3 },
  { i: "c", x: 1, y: 20, w: 8, h: 10, minH: 3 },
  { i: "d", x: 1, y: 30, w: 8, h: 10, minH: 3 }
]
}

const StyledDiv = styled(Paper)(() => ({
  borderRadius: 5,
  color: 'white',
  background: '#111722'
}))


const Dashboard = () => {
  const [tradeSymbol, setTradeSymbol] = useState({ id: 'ETHBTC', symbol: 'ETH/BTC' })
  const { userId } = useAuth()
  const [watchList, setWatchList] = useState([])
  const [viewConfig, setViewConfig] = useState()

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
        },
        typography: {
          fontFamily: 'Arial, Helvetica, sans-serif !important',
          fontSize: 10,
        },
      }),
    [],
  );

  const handleChangeLayout = (layout, _layouts) => {
    saveViewConfig(userId, _layouts)
  }

  useEffect(() => {
    if (userId) {
      getViewConfig(userId).then((data) => {
        if (data && data.viewConfig) {
          setViewConfig(data.viewConfig)
        } else {
          setViewConfig(layouts)
        }
      })
        .catch(() => {
          setViewConfig(layouts)
        })
    }
  }, [userId])

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ userId }}>
        <TradeContext.Provider value={{ tradeSymbol, setTradeSymbol, watchList, setWatchList }}>
          {viewConfig && <ResponsiveGridLayout
              className="layout"
              layouts={viewConfig}
              rowHeight={30}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 24, md: 10, sm: 6, xs: 4, xxs: 2 }}
              style={{background: 'rgb(7 6 6 / 96%)'}}
              onLayoutChange={handleChangeLayout}
            >
              <StyledDiv key="a"><TradingView /></StyledDiv>
              <StyledDiv key="c"><WatchList /></StyledDiv>
              <StyledDiv key="b"><OrderBook /></StyledDiv>
              <StyledDiv key="d"><Trades /></StyledDiv>
            </ResponsiveGridLayout>
          }
        </TradeContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  )
}

export default Dashboard
