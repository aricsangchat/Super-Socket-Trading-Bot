import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

let socket = io('http://localhost:4000', {
  reconnection: true,
  // reconnectionDelay: 5000,
  // reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  autoConnect: true
})

let socketIoMiddleware = createSocketIoMiddleware(socket, 'server/')

export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    applyMiddleware(socketIoMiddleware),
    typeof window === 'object' &&
      typeof window.devToolsExtension !== 'undefined'
      ? window.devToolsExtension()
      : f => f
  )
)

export default store
