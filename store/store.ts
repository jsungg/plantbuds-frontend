import { createStore, combineReducers, applyMiddleware } from "redux";
import axios from "axios";
import axiosMiddleware from "redux-axios-middleware";
import { sessionReducer } from "./session/reducer";
import { API_ROOT, BASIC_TOKEN } from "../src/constants/index";

const client = axios.create({
  //all axios can be used, shown in axios documentation
  baseURL: API_ROOT,
  responseType: "json"
});

const rootReducer = combineReducers({
  session: sessionReducer
});

const middlewareConfig = {
  returnRejectedPromiseOnError: true,
  interceptors: {
    request: [
      function({ getState, dispatch, getSourceAction }, config) {
        config.headers["Authorization"] = "Basic " + BASIC_TOKEN;
        return config;
      }
    ],
    response: [
      {
        success: ({ dispatch }, response) => {
          // Response interception
          return response;
        },
        error: ({ dispatch }, error) => {
          // Response Error Interception
          return Promise.reject(error);
         }
        }
      }
    ]
  }
};

export type RootState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(axiosMiddleware(client, middlewareConfig))
  );

  return store;
}
