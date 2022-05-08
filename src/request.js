import { version } from "../package.json";
import QueryCache from "./query_cache";
const cache = new QueryCache();

export function request(
  username,
  password,
  apiEndpoint,
  path,
  params,
  cacheResponses,
  { additionalHeaders } = {}
) {
  const method = "POST";
  const key = cache.getKey(method, apiEndpoint + path, params);
  if (cacheResponses) {
    const cachedResult = cache.retrieve(key);
    if (cachedResult) {
      return Promise.resolve(cachedResult);
    }
  }

  return _request(method, username, password, apiEndpoint, path, params, {
    additionalHeaders
  }).then(response => {
    console.log(response);
    return response
      .json()
      .then(json => {
        const result = {
          response: response,
          json: { results: json["hits"]["hits"] }
        };
        console.log(result);
        if (cacheResponses) cache.store(key, result);
        return result;
      })
      .catch(() => {
        return { response: response, json: {} };
      });
  });
}

function _request(
  method,
  username,
  password,
  apiEndpoint,
  path,
  params,
  { additionalHeaders } = {}
) {
  const jsVersion = typeof window !== "undefined" ? "browser" : process.version;
  const metaHeader = `ent=${version}-legacy,js=${jsVersion},t=${version}-legacy,ft=universal`;
  const headers = new Headers({
    Authorization: "Basic " + btoa(username + ":" + password),
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
    "X-Swiftype-Client": "elastic-app-search-javascript",
    "X-Swiftype-Client-Version": version,
    "x-elastic-client-meta": metaHeader,
    ...additionalHeaders
  });

  if (params["query"] == "") {
    params["query"] = {
      match_all: {}
    };
  }

  console.log(params);

  return fetch(`${apiEndpoint}${path}`, {
    method,
    headers,
    body: JSON.stringify(params),
    credentials: "include"
  });
}
