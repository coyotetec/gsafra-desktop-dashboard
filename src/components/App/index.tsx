/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Colors,
  ArcElement,
  PieController
} from 'chart.js';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { Container, Content } from './styles';
import { Router } from '../../Router';
import { Sidebar } from '../Sidebar';
import { ToastContainer } from '../Toast/ToastContainer';
import { UserContextProvider } from '../../contexts/UserContext';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

import 'primereact/resources/themes/lara-light-indigo/theme.css';  //theme
import 'primereact/resources/primereact.min.css';                  //core css
import 'primeicons/primeicons.css';                                //icons

ChartJS.register(
  LinearScale,
  CategoryScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Colors,
  LineController,
  BarController,
  PieController,
);

ChartJS.defaults.color = '#CFD4D6';
ChartJS.defaults.borderColor = '#506167';
ChartJS.defaults.font = {
  family: 'Montserrat, sans-serif',
  size: 12,
  weight: '500',
};

export function App() {
  return (
    <Provider store={store}>
      <UserContextProvider>
        <Container>
          <GlobalStyles />
          <Sidebar />
          <Content>
            <Router />
          </Content>
        </Container>
        <ToastContainer />
      </UserContextProvider>
    </Provider>
  );
}
