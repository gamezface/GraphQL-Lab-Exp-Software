const axios = require('axios');
const fs = require('fs')

axios.defaults.headers.common['Authorization'] = 'Bearer ';

var after = ""
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