import React from 'react'
import { createRoot } from 'react-dom/client' 
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux"

import "./styles/index.css"

import { store } from './features/store'

import App from './components/App/App'

// set HTTPS=true&&npm start

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>    
)


