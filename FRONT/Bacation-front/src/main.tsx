import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './fonts/Font.css';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration.ts';

serviceWorkerRegistration.register();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    {/* <UserContextProvider> */}
    <App />
    {/* </UserContextProvider> */}
  </BrowserRouter>,
  // </React.StrictMode>
);
