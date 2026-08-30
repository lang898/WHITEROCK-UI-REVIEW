import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './whiterock-upgrade.css';
import './contact-upgrade.css';
import './product-upgrade.css';
import './color-upgrade.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
