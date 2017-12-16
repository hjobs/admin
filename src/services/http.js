import 'whatwg-fetch';

// import Variable from './var';
// const vars = new Variable();

// export const baseUrl = "https://dev.hjobs.hk/employer/";
export const baseUrl = "http://localhost:9080/employer/";
// export const baseUrl = "https://api.hjobs.hk/employer/";

export const authToken = localStorage.getItem("authToken");

/** param httpMethod defaults to 'GET', data defaults to null
* @param {string} urlSuffix
* @param {'GET'|'POST'|'PATCH'|'DELETE'} httpMethod
* @return {Promise<Response>}
*/
export const request = (urlSuffix, httpMethod = "GET", data = null) => {
  const url = baseUrl + urlSuffix;
  /** @type {RequestInit} */ const obj = {
    method: httpMethod,
    headers: { "Content-Type": "application/json" }
  };
  if (localStorage.getItem("authToken")) { obj.headers.Authorization = localStorage.getItem("authToken"); }
  if (data) { obj.body = JSON.stringify(data); }
  console.log(["inside http.js, url, obj", url, obj, data]);

  return fetch(url, obj);
};

/** param httpMethod defaults to 'GET', data defaults to null
* @param {string} url @param {'GET'|'POST'|'PATCH'|'DELETE'} httpMethod @param {object} data
* @return {Promise<Response>}
*/
export const exRequest = (url, httpMethod = "Get", data = null) => {
  /** @type {RequestInit} */
  const obj = {
    method: httpMethod
  };
  if (!!data) obj.body = JSON.stringify(data);
  return fetch(url, obj);
};

export const getGoogleLocationData = (street, region = "HK") => {
  street = street.replace(/\s/g, "+");
  const googleUrl = "https://maps.googleapis.com/maps/api/geocode/" +
              "json?" +
              "region=" + "HK" +
              "&address=" + street +
              "&key=AIzaSyDqDJTU7suCklbnStTcieulgVHci8myzcQ";
  return exRequest(googleUrl);
}

export const geolocationMappingObject = [
  {fromKey: "street_number", to: "street_number"},
  {fromKey: "route", to: "street_name"},
  {fromKey: "country", to: "country"},
  {fromKey: "administrative_area_level_1", to: "region"},
  {fromKey: "neighborhood", to: "city"}
];

export const getLocationObject = (data, originalStreetName) => {
  const result = data.results[0];
  let mappedObject = {};
  result.address_components.forEach(comp => {
    geolocationMappingObject.forEach((obj, i) => {
      if (comp.types.includes(obj.fromKey)) mappedObject[obj.to] = comp.long_name
    })
  })

  const locationObject = {
    address: result.formatted_address,
    street: (!!mappedObject.street_number && !!mappedObject.street_name) ?
              (mappedObject.street_number + " " + mappedObject.street_name) :
              originalStreetName,
    country: mappedObject.country,
    region: mappedObject.region,
    city: mappedObject.city,
    lat: result.geometry.location.lat,
    lng: result.geometry.location.lng
  };

  console.log(["locationObject", locationObject]);
  return locationObject;
}

const Http = {
  baseUrl,
  authToken,
  request,
  exRequest
}

export default Http;
