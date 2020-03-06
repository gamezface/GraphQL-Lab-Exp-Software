const axios = require('axios');
const fs = require('fs')
const Json2Csv = require("json2csv").parse;
var cursor = 0
var after = ""
const limit = 1000;
var resultList = []

axios.defaults.headers.common['Authorization'] = 'Bearer cdc2a6d915db9f64ff09e0993f4deac3097f3998';

const getData = async () => {
  try {
    const query = `query RepositoriosPopulares {
      search(query: "stars:>100", type: REPOSITORY, first:20${after}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on Repository {
            nameWithOwner
            createdAt
            pullRequests (states: MERGED){
              totalCount
            }
            releases {
              totalCount
            }
            updatedAt
            primaryLanguage {
              name
            }
            closedIssues: issues(states: CLOSED) {
              totalCount
            }
            totalIssues: issues {
              totalCount
            }
            stargazers {
              totalCount
            }
          }
        }
      }
    }`;
    const result = await axios.post('https://api.github.com/graphql', {
      query: query
    })
    const data = result.data.data.search
    if (data.pageInfo.hasNextPage || cursor < limit) {
      after = `, after: "${data.pageInfo.endCursor}"`;
      resultList = resultList.concat(data.nodes);
      cursor += 20;
      await getData();
    } else {
      writeFile(resultList);
    }
  } catch (e) {
    !!e.response && e.response.status == 502 ? await getData() : console.log(e);
  }
}
const writeFile = (data) => {
  const csv = Json2Csv(data, {
    fields: [
      "nameWithOwner",
      "createdAt",
      "pullRequests",
      "releases",
      "updatedAt",
      "primaryLanguage",
      "closedIssues",
      "totalIssues",
      "stargazers"
    ]
  });
  fs.writeFileSync("data.csv", csv);
}

getData()