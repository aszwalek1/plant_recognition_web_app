const Plants = require('../models/plant')

/**
 * Creates a plant document in the database.
 * @param plantData object with plant data in its field, aka 'req.body' from POST form
 * @param imagePath relative path to plant's image, see lab 5 exercise 3
 * @returns {Promise<string>} result of saving plant in db, either plant as string or null if error
 */
function create(plantData, imagePath) {
    let plant = new Plants(
        {
            name: plantData.name,
            description: plantData.description,
            characteristics: {
                hasFlowers: plantData.hasFlowers,
                hasLeaves: plantData.hasLeaves,
                hasFruit: plantData.hasFruit,
                hasSeeds: plantData.hasSeeds,
                sunExposure: plantData.sunExposure,
                //TODO? height:
                //TODO? spread:
                //TODO colour
            },
            imagePath: imagePath,
            nameStatus: plantData.nameStatus,
            username: plantData.username,
            //TODO location
            date: plantData.date,
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

exports.create = create

