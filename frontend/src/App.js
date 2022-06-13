import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import useAuthStore from './stores/AuthStore';
// ----------------------------------------------------------------------

export default function App() {
  const token = useAuthStore(state => state.token);
  
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router token={token} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </ThemeProvider>
  );
}
