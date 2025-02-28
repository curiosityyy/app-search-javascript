"use strict";

import ResultItem from "./result_item";

/**
 * A list of ResultItems and additional information returned by a search request
 */
export default class ResultList {
  constructor(rawResults, rawInfo) {
    this.rawResults = rawResults;
    this.rawInfo = rawInfo;

    const results = [];
    console.log("-------");
    rawResults.forEach(data => {
      results.push(new ResultItem(data));
    });
    console.log("-------");

    this.results = results;
    this.info = rawInfo;
  }
}
