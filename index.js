const axios = require('axios');
const fs = require('fs')

axios.defaults.headers.common['Authorization'] = 'Bearer f9836e57fd3b7c382754cf6c4f1765c78495b18f';

var after = ""

var fullData = []
var current = 0
const limit = 1000

const getData = async () => {
    try {
        const query = `query ExLab1 {
            search(query: "stars:>100", type: REPOSITORY, first: 100${after}) {
              nodes {
                ... on Repository {
                  nameWithOwner
                  primaryLanguage {
                    id: id
                    name: name
                  }
                }
              }
            }
          }`;
        //   `query example{ search (query: "stars:>10", type: REPOSITORY, first:20${after}) { pageInfo { hasNextPage endCursor } nodes { ... on Repository { nameWithOwner createdAt pullRequests(states: MERGED) { totalCount } stargazers { totalCount } releases { totalCount } updatedAt primaryLanguage { name } closedIssues: issues(states:CLOSED) { totalCount } totalIssues: issues { totalCount } } } } }`
        const result = await axios.post('https://api.github.com/graphql', {
            query: query
        })
        const data = result.data.data.search
        console.log(data)
        fs.writeFile('data.json', JSON.stringify(data), err => console.log(err))
    } catch (e) {
        console.log(e)
    }
}

getData()