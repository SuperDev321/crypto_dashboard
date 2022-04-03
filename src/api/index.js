// import axios from 'axios'
import * as ccxt from 'ccxt'
// import config from '../config'

const exchange = new ccxt.binance ({
  'enableRateLimit': true
})

const assets = [
  'btc', 'eth', 'dot', 'luna', 'near', 'sol', 'avax', 'ftm', 'matic', 'atom', 'oasis'
]

const searchAssets = async (searchStr) => {
  try {
    const markets = await exchange.loadMarkets()
    const marketArr = Object.entries(markets).map(([symbol, market]) => {
      return market
    })
    const filteredMarkets = marketArr.filter(({ symbol, base, quote }) => {
      if ( assets.includes(base.toLowerCase()) && assets.includes(quote.toLowerCase())) {
        if (searchStr === 'all') return true
        else if (symbol.toLowerCase()?.includes(searchStr?.toLowerCase())) return true
        return false
      } else return false
    })
    return filteredMarkets
  } catch (err) {
    return null
  }

  // return axios.get(`${config.backend_url}/api/assets/${searchStr}`)
  //   .then((response) => {
  //     if (response && response.data) {
  //       const { result, data } = response.data
  //       if (result && data?.length) {
  //         return data
  //       } else {
  //         return null
  //       }
  //     } else {
  //       return null
  //     }
  //   })
  //   .catch((err) => {
  //     return null
  //   })
}

const getPriceTickers = async (assetArr) => {
  try {
    const tickers = await exchange.fetchTickers(assetArr)
    return tickers
  } catch (err) {
    return null
  }
  // return axios.post(`${config.backend_url}/api/price/tickers`, {
  //   assetArr
  // })
  //   .then((response) => {
  //     if (response && response.data) {
  //       const { result, data } = response.data
  //       if (result && data) {
  //         return data
  //       } else {
  //         return null
  //       }
  //     } else {
  //       return null
  //     }
  //   })
  //   .catch((err) => {
  //     return null
  //   })
}

const getOrderBook = async (symbol) => {
  try {
    const orderBooks = await exchange.fetchOrderBook(symbol, 20)
    return orderBooks
  } catch (err) {
    return null
  }
  // return axios.post(`${config.backend_url}/api/orderBook`, {
  //   symbol
  // })
  //   .then((response) => {
  //     if (response && response.data) {
  //       const { result, data } = response.data
  //       if (result && data) {
  //         return data
  //       } else {
  //         return null
  //       }
  //     } else {
  //       return null
  //     }
  //   })
  //   .catch((err) => {
  //     return null
  //   })
}

const getTrades = async (symbol, since = 1, limit = 30) => {
  try {
    const sinceTime = exchange.milliseconds () - since * 86400000
    const trades = await exchange.fetchTrades(symbol, sinceTime, limit)
    return trades
  } catch (err) {
    return null
  }
}


export {
  searchAssets,
  getPriceTickers,
  getOrderBook,
  getTrades
}
