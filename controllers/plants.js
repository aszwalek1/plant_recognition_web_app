const Plant = require('../models/plant')

/**
 * Creates a plant document in the database.
 * @param plantData object with plant data in its field, aka 'req.body' from POST form
 * @param imagePath relative path to plant's image, see lab 5 exercise 3
 * @returns {Promise<string>} result of saving plant in db, either plant as string or null if error
 */
function create(plantData, imagePath) {
    let characteristics = {
        hasFlowers: plantData.characteristics.includes('flowers'),
        hasLeaves: plantData.characteristics.includes('leaves'),
        hasFruit: plantData.characteristics.includes('fruit'),
        hasSeeds: plantData.characteristics.includes('seeds'),
        sunExposure: plantData.sunExposure,
        // height: TODO add height to create form
        // spread: TODO add spread to create form
        // colour: TODO change colour in create form to colour picker
    }

    if (imagePath.startsWith("public\\")) {
        imagePath = imagePath.substring(7)
    }

    let plant = new Plant(
        {
            name: plantData.name,
            description: plantData.description,
            characteristics: characteristics,
            imagePath: imagePath,
            nameStatus: plantData.status,
            username: plantData.username,
            // TODO add location to plant model
        }
    )

    let result = plant.save().then(
        plant => {
            return JSON.stringify(plant)
        }
    ).catch(
        err => {
            console.log(err)
            return null
        }
    )

    return result
}

/**
 * Get a plant by its id
 * @param id the plants id
 * @returns {Promise<string>} a promise, either plant as string or null if error
 * */
function get(id) {
    let result = Plant.findById(id).then(
        plant => {
            return JSON.stringify(plant)
        }
    ).catch(
        err => {
            console.log(err)
            return null
        }
    )

    return result
}

/**
 * Gets all the plant documents in the database.
 * @returns {Promise<list<string>>} all the plants in db as JSON strings, or null if error occurred
 * */
function getAll() {
    let result = Plant.find({}).then(
        plants => {
            return JSON.stringify(plants)
        }
    ).catch(
        err => {
            console.log(err)
            return null
        }
    )

    return result
}

exports.create = create
exports.get = get
exports.getAll = getAll
