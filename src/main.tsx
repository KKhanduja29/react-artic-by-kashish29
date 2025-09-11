import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// PrimeReact core/theme/resources
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // pick any theme you like
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
