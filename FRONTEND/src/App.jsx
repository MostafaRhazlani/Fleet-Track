
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import router from "./routes/router";
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={createBrowserRouter(router)} />
    </Provider>
  );
}

export default App;
