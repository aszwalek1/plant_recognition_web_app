const dbpediaURL = 'http://dbpedia.org'
const endpointURL = 'http://dbpedia.org/sparql'

/**
 * Queries DBpedia resource of a plant with a given name for a Wikipedia page id.
 *
 * @param plantName the name of a plant in DBpedia
 * @returns {Promise<any>} Promise of object with dbpediaPage, abstract and wikiID properties
 */
function queryPlant(plantName) {
    const resourceURI = `${dbpediaURL}/resource/${plantName}`
    const query = `
        PREFIX dbo: <${dbpediaURL}/ontology/>
        
        SELECT ?abstract ?wikiID
        WHERE {
            <${resourceURI}> dbo:abstract ?abstract.
            <${resourceURI}> dbo:wikiPageID ?wikiID .
            FILTER (langMatches(lang(?abstract), "en")) .
        }
    `
    const queryEncoded = encodeURIComponent(query)

    const queryURL = `${endpointURL}?query=${queryEncoded}&format=json`

    return fetch(queryURL).then(response => {
        return response.json().then(responseJSON => {
            const result = responseJSON.results.bindings[0]
            handleError("No results")
            return {
                dbpediaPage: `${dbpediaURL}/page/${plantName}`,
                abstract: result.abstract.value,
                wikiID: result.wikiID.value
            }
        })
        .catch(handleError)
    })
    .catch(handleError)
}

/**
 * Logs a given error to console and returns undefined.
 *
 * @param err the error
 * @return undefined
 */
function handleError(err) {
    console.log("error fetching dbpedia query:")
    console.log(err)
    return undefined
}

exports.queryPlant = queryPlant
