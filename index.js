const axios = require('axios');
const fs = require('fs')

axios.defaults.headers.common['Authorization'] = 'Bearer 4461c4ad95016193315227ea1b7b59b3b98cd7aa';

var after = ""

var fullData = []
var current = 0
const limit = 1000

const getData = async () => {
    try {
        const query = `query example{ search (query: "stars:>10", type: REPOSITORY, first:20${after}) { pageInfo { hasNextPage endCursor } nodes { ... on Repository { nameWithOwner createdAt pullRequests(states: MERGED) { totalCount } stargazers { totalCount } releases { totalCount } updatedAt primaryLanguage { name } closedIssues: issues(states:CLOSED) { totalCount } totalIssues: issues { totalCount } } } } }`
        const result = await axios.post('https://api.github.com/graphql', {
            query: query
        })
        const data = result.data.data.search
        endCursor = data.pageInfo.endCursor
        if (data.pageInfo.hasNextPage && current <= limit) {
            fullData = fullData.concat(data.nodes)
            after = `, after: "${endCursor}"`
            current += 20
            console.log(fullData.length)
            await getData()
        } else {
            fs.writeFile('data.json', JSON.stringify(fullData), err => console.log(err))
        }
    } catch (e) {
        console.log(e)
    }
}

getData()