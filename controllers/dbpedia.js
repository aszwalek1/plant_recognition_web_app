const endpointURL = 'http://dbpedia.org/sparql'

/**
 * Queries DBpedia resource of a plant with a given name for a Wikipedia page id.
 *
 * @param plantName the name of a plant in DBpedia
 * @returns {Promise<any>} Promise of object with wikiID property
 */
function queryPlant(plantName) {
    // TODO? return Promise of object containing more than just wiki id
    const resourceURI = `http://dbpedia.org/resource/${plantName}`
    const query = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        
        SELECT ?wikiID
        WHERE {
            <http://dbpedia.org/resource/${plantName}> dbo:wikiPageID ?wikiID .
        }
    `
    const queryEncoded = encodeURIComponent(query)

    const queryURL = `${endpointURL}?query=${queryEncoded}&format=json`

    return fetch(queryURL)
        .then(response => {
            return response.json()
                .then(responseJSON => {
                    return {wikiID: responseJSON.results.bindings[0].wikiID.value}
                })
                .catch(handleError)
        })
        .catch(handleError)
}

/**
 * Logs a given error to console and returns undefined.
 *
 * @param err
 * @return undefined
 */
function handleError(err) {
    console.log("error fetching dbpedia query:")
    console.log(err)
    return undefined
}

exports.queryPlant = queryPlant
