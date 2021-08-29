import { createTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0984E3',
    },
    secondary: {
      main: '#0044ff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FBF7FB',
    },
  },
});
