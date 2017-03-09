import 'whatwg-fetch';

import Variable from './var';
const vars = new Variable();

class Http {

  /** param httpMethod defaults to 'GET', data defaults to null
   * @param {string} urlSuffix
   * @param {'GET'|'POST'|'PATCH'|'DELETE'} httpMethod
   * @return {Promise<Response>}
   */
  request(urlSuffix, httpMethod = "GET", data = null) {
    const url = vars.baseUrl + 'employee/' + urlSuffix;
    /** @type {RequestInit} */ const obj = {
      method: httpMethod,
      headers: {"Content-Type": "application/json"}
    };
    if (vars.token) { obj.headers.Authorization = vars.token; }
    if (data) { obj.data = data; }
    console.log(["inside http.js, url, obj", url, obj, data]);

    return fetch(url, obj);
  }

}

export default Http;
