import WatchList from "../components/WatchList"
import GridLayout from "react-grid-layout";
import { useState } from "react";
import TradeContext from "../context/TradeContext";
import TradingView from "../components/TradingView.js";
import OrderBook from "../components/OrderBook";

import { Responsive, WidthProvider } from "react-grid-layout";
import Trades from "../components/Trades";

const ResponsiveGridLayout = WidthProvider(Responsive);

const layouts = { lg: [
  { i: "a", x: 0, y: 0, w: 6, h: 13, minH: 3 },
  { i: "b", x: 6, y: 0, w: 6, h: 13, minH: 3 },
  { i: "c", x: 0, y: 13, w: 6, h: 13, minH: 3 },
  { i: "d", x: 6, y: 13, w: 6, h: 13, minH: 3 }
], md : [
  { i: "a", x: 1, y: 0, w: 8, h: 10, minH: 3 },
  { i: "b", x: 1, y: 10, w: 8, h: 10, minH: 3 },
  { i: "c", x: 1, y: 20, w: 8, h: 10, minH: 3 },
  { i: "d", x: 1, y: 30, w: 8, h: 10, minH: 3 }
]
}


const Dashboard = () => {
  const [tradeSymbol, setTradeSymbol] = useState()
  const [watchList, setWatchList] = useState([])
  return (
    <TradeContext.Provider value={{ tradeSymbol, setTradeSymbol, watchList, setWatchList }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        rowHeight={30}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        <div key="a"><WatchList /></div>
        <div key="b"><TradingView /></div>
        <div key="c"><OrderBook /></div>
        <div key="d"><Trades /></div>
      </ResponsiveGridLayout>
    </TradeContext.Provider>
  )
}

export default Dashboard
