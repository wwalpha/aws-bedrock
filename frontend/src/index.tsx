import React from 'react';
import { render } from 'react-dom';
import './index.css';


const persistor = persistStore(store);

const provider = (
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <ThemeProvider theme={theme}>
        <Authenticator />
    </ThemeProvider>
    {/* </PersistGate> */}
  </Provider>
);

const root = document.getElementById('root');

render(provider, root);