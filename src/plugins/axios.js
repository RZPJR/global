import axios from "axios";
import Vue from "vue";

let API_URL = "https://uat-gateway.edenfarm.tech";
let APP_URL = "http://localhost:5000/";
const ajax = axios.create({
  baseURL: API_URL,
});
ajax.CancelToken = axios.CancelToken;
ajax.isCancel = axios.isCancel;

/*
 * The interceptor here ensures that we check for the token in local storage every time an ajax request is made
 */
ajax.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("bearer");

    if (token !== "") {
      config.headers["Authorization"] = `Bearer ${token}`;
      ajax.defaults.headers.post["Content-Type"] =
        "application/json;charset=utf-8";
    } else {
      window.location.href = APP_URL;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error.message);
  }
);

/*
 * The interceptor takes care of auth
 */
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return errorHandling(error);
  }
);

/*
 * The interceptor takes care of all responses except auth
 */
ajax.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return errorHandling(error);
  }
);

/*
 * The interceptor takes care of auth
 */
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return errorHandling(error);
  }
);

/*
 * The interceptor takes care of all responses except auth
 */

export default {
  install() {
    Vue.prototype.$http = ajax;
    // Vue.prototype.$http2 = ajax2
  },
}; // Check debug/build mode

function errorHandling(error) {
  let message = "Something went wrong, please try again";
  if (!error.response) {
    message = "Network connection unstable";
    errorToast(message);
    return Promise.reject(error.message);
  } else {
    switch (error.response.status) {
      case 422:
        if (error.response.data.errors.id)
          message = error.response.data.errors.id;
        else if (error.response.data.errors.message)
          message = error.response.data.errors.message;
        else message = "Something wrong with your input";
        errorToast(message);
        return Promise.reject(error.response.data);
    }
  }
}

function errorToast(message) {
  Vue.$toast.open({
    position: "top-right",
    message: message,
    type: "error",
  });
}
