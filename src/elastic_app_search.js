"use strict";

import Client from "./client";

export function createClient({
  hostIdentifier,
  accountHostKey,
  apiKey,
  username,
  password,
  engineName,
  endpointBase,
  cacheResponses,
  additionalHeaders
}) {
  hostIdentifier = hostIdentifier || accountHostKey; // accountHostKey is deprecated
  return new Client(hostIdentifier, username, password, engineName, {
    endpointBase,
    cacheResponses,
    additionalHeaders
  });
}
