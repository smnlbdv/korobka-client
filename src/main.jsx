import React from 'react'
import ReactDOM from 'react-dom/client'
import { StyleProvider } from '@ant-design/cssinjs';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/index.js';
import ScrollToTop from './components/scrollTop/scrollTop.jsx';

import App from './App.jsx'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyleProvider hashPriority="high">
        <Router>
          <ScrollToTop />
          <Provider store={store}>
            <App/>
          </Provider>
        </Router>
    </StyleProvider>
  </React.StrictMode>,
  )
