import axios from 'axios'
// import * as ccxt from 'ccxt'
import config from '../config'

// const exchange = new ccxt.binance ({
//   'enableRateLimit': true,
//   'precisionMode': ccxt.DECIMAL_PLACES
// })

// const assets = [
//   'btc', 'eth', 'dot', 'luna', 'near', 'sol', 'avax', 'ftm', 'matic', 'atom', 'oasis'
// ]

const getWatchList = (userId) => {
  return axios.get(`${config.backend_url}/api/watchList/${userId}`)
    .then((response) => {
      if (response && response.data) {
        const { result, data } = response.data
        if (result && data) {
          return data
        } else {
          return null
        }
      } else {
        return null
      }
    })
    .catch((err) => {
      return null
    })
}

const saveWatchList = (userId, watchList) => {
  return axios.post(`${config.backend_url}/api/watchList/${userId}`, {
    watchList
  })
    .then((response) => {
      if (response && response.data) {
        const { result, data } = response.data
        if (result && data) {
          return data
        } else {
          return null
        }
      } else {
        return null
      }
    })
    .catch((err) => {
      return null
    })
}

const removeWatchList = (userId, id) => {
  return axios.post(`${config.backend_url}/api/watchList/${userId}/remove`, {
    id
  })
    .then((response) => {
      if (response && response.data) {
        const { result, data } = response.data
        if (result && data) {
          return data
        } else {
          return null
        }
      } else {
        return null
      }
    })
    .catch((err) => {
      return null
    })
}

const getViewConfig = (userId) => {
  return axios.get(`${config.backend_url}/api/viewConfig/${userId}`)
    .then((response) => {
      if (response && response.data) {
        const { result, data } = response.data
        if (result && data) {
          return data
        } else {
          return null
        }
      } else {
        return null
      }
    })
    .catch((err) => {
      return null
    })
}

const saveViewConfig = (userId, viewConfig) => {
  return axios.post(`${config.backend_url}/api/viewConfig/${userId}`, {
    viewConfig
  })
    .then((response) => {
      if (response && response.data) {
        const { result, data } = response.data
        if (result && data) {
          return data
        } else {
          return null
        }
      } else {
        return null
      }
    })
    .catch((err) => {
      return null
    })
}

const searchAssets = async (searchStr) => {
  // try {
  //   const markets = await exchange.loadMarkets()
  //   const marketArr = Object.entries(markets).map(([symbol, market]) => {
  //     return market
  //   })
  //   const filteredMarkets = marketArr.filter(({ symbol, base, baseId, quote, quoteId, type }) => {
  //     if (type === 'spot' && ((assets.includes(base.toLowerCase()) || assets.includes(baseId.toLowerCase())) && ((quoteId.toLowerCase() === 'usdt') || quote.toLowerCase() === 'usdt'))) {
  //       if (searchStr === 'all') return true
  //       else if (symbol.toLowerCase()?.includes(searchStr?.toLowerCase())) return true
  //       return false
  //     } else return false
  //   })
  //   return filteredMarkets
  // } catch (err) {
  //   return null
  // }

  return axios.get(`${config.backend_url}/api/assets/${searchStr}`)
    .then((response) => {
      if (response && response.data) {
        const { result, data } = response.data
        if (result && data?.length) {
          return data
        } else {
          return null
        }
      } else {
        return null
      }
    })
    .catch((err) => {
      return null
    })
}

const getPriceTickers = async (assetArr) => {
  // try {
  //   const tickers = await exchange.fetchTickers(assetArr, 100)
  //   return tickers
  // } catch (err) {
  //   return null
  // }
  return axios.post(`${config.backend_url}/api/price/tickers`, {
    assetArr
  })
    .then((response) => {
      if (response && response.data) {
        const { result, data } = response.data
        if (result && data) {
          return data
        } else {
          return null
        }
      } else {
        return null
      }
    })
    .catch((err) => {
      return null
    })
}

const getOrderBook = async (symbol, precision) => {
  // try {
  //   exchange.precision = precision
  //   const orderBooks = await exchange.fetchOrderBook(symbol, 100)
  //   return orderBooks
  // } catch (err) {
  //   return null
  // }
  return axios.post(`${config.backend_url}/api/orderBook`, {
    symbol,
    precision
  })
    .then((response) => {
      if (response && response.data) {
        const { result, data } = response.data
        if (result && data) {
          return data
        } else {
          return null
        }
      } else {
        return null
      }
    })
    .catch((err) => {
      return null
    })
}

const getTrades = async (symbol, since = 1, limit = 30) => {
  // try {
  //   const sinceTime = exchange.milliseconds () - since * 86400000
  //   const trades = await exchange.fetchTrades(symbol, sinceTime, 100)
  //   return trades
  // } catch (err) {
  //   return null
  // }
  return axios.post(`${config.backend_url}/api/trades`, {
    symbol,
    since,
    limit
  })
    .then((response) => {
      if (response && response.data) {
        const { result, data } = response.data
        if (result && data) {
          return data
        } else {
          return null
        }
      } else {
        return null
      }
    })
    .catch((err) => {
      return null
    })
}


export {
  getViewConfig,
  saveViewConfig,
  getWatchList,
  saveWatchList,
  removeWatchList,
  searchAssets,
  getPriceTickers,
  getOrderBook,
  getTrades
}
