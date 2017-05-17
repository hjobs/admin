import 'whatwg-fetch';

// import Variable from './var';
// const vars = new Variable();

// const baseUrl = "https://api.hjobs.hk/employer/",
const baseUrl = "https://dev.hjobs.hk/employer/",
// const baseUrl = "http://localhost:9080/employer/",
      authToken = localStorage.getItem("authToken");

const Http = {
  baseUrl,
  authToken,

  /** param httpMethod defaults to 'GET', data defaults to null
   * @param {string} urlSuffix
   * @param {'GET'|'POST'|'PATCH'|'DELETE'} httpMethod
   * @return {Promise<Response>}
   */
  request: (urlSuffix, httpMethod = "GET", data = null) => {
    const url = baseUrl + urlSuffix;
    /** @type {RequestInit} */ const obj = {
      method: httpMethod,
      headers: { "Content-Type": "application/json" }
    };
    if (localStorage.getItem("authToken")) { obj.headers.Authorization = localStorage.getItem("authToken"); }
    if (data) { obj.body = JSON.stringify(data); }
    console.log(["inside http.js, url, obj", url, obj, data]);

    return fetch(url, obj);
  }
}

export default Http;
