const Plant = require('../models/plant')
let colourStringToNums = require("../utils").colourStringToNums;

/**
 * Creates a plant document in the database.
 * @param plantData object with plant data in its field, aka 'req.body' from POST form
 * @param imagePath relative path to plant's image, see lab 5 exercise 3
 * @returns {Promise<string>} result of saving plant in db, either plant as string or null if error
 */
function create(plantData, imagePath) {

    let characteristics = {
        hasFlowers: plantData.characteristics !== undefined && plantData.characteristics.includes('flowers'),
        hasLeaves: plantData.characteristics !== undefined && plantData.characteristics.includes('leaves'),
        hasFruit: plantData.characteristics !== undefined && plantData.characteristics.includes('fruit'),
        hasSeeds: plantData.characteristics !== undefined && plantData.characteristics.includes('seeds'),
        sunExposure: plantData.sunExposure,
        height: plantData.height,
        spread: plantData.spread,
        colour: plantData.colour
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

    return plant.save()
        .then(plant => {
            return JSON.stringify(plant)
        })
        .catch(err => {
            console.log(err)
            return null
        })
}

/**
 * Get a plant by its id
 * @param id the plants id
 * @returns {Promise<string>} a promise, either plant as string or null if error
 * */
function get(id) {
    return Plant.findById(id)
        .then(
        plant => {
            return JSON.stringify(plant)
        })
        .catch(err => {
            console.log(err)
            return null
        })
}

/**
 * Gets all the plant documents in the database.
 * @returns {Promise<string>} all the plants in db as JSON strings, or null if error occurred
 * */
function getAll() {
    return Plant.find({}).then(
        plants => {
            return JSON.stringify(plants)
        }
    ).catch(
        err => {
            console.log(err)
            return null
        }
    )
}

exports.filterPlants = async function(filterFormData) {
    try {
        let filteredPlants;

        const colourFilterRange = Number(filterFormData.colourRange)
        const [redFilter, greenFilter, blueFilter] = colourStringToNums(filterFormData.colour)
        const RGB_MIN = 0;
        const RGB_MAX = 255;
        const [
            [redFilterMin, redFilterMax],
            [greenFilterMin, greenFilterMax],
            [blueFilterMin, blueFilterMax]
        ] = [
            [Math.max(redFilter - colourFilterRange, RGB_MIN), Math.min(redFilter + colourFilterRange, RGB_MAX)],
            [Math.max(greenFilter - colourFilterRange, RGB_MIN), Math.min(greenFilter + colourFilterRange, RGB_MAX)],
            [Math.max(blueFilter - colourFilterRange, RGB_MIN), Math.min(blueFilter + colourFilterRange, RGB_MAX)],
        ]

        if (filterFormData.date === 'recent') {
            filteredPlants = await Plant.find().sort({ date: -1 }); // Sort by descending order of date
        } else if (filterFormData.date === 'oldest') {
            filteredPlants = await Plant.find().sort({ date: 1 }); // Sort by ascending order of date
        } else {
            filteredPlants = await Plant.find();
        }

        if (filterFormData.identified) {
            filteredPlants = filteredPlants.filter(plant => {
                return plant.nameStatus === "Completed"
            })
        }

        if (filterFormData.flower) {
            filteredPlants = filteredPlants.filter(plant => {
                return plant.characteristics.hasFlowers
            })
        }

        if (filterFormData.leaf) {
            filteredPlants = filteredPlants.filter(plant => {
                return plant.characteristics.hasLeaves
            })
        }

        if (filterFormData.seeds) {
            filteredPlants = filteredPlants.filter(plant => {
                return plant.characteristics.hasSeeds
            })
        }

        if (filterFormData.fruit) {
            filteredPlants = filteredPlants.filter(plant => {
                return plant.characteristics.hasFruit
            })
        }

        if (filterFormData.sunExposure) {
            filteredPlants = filteredPlants.filter(plant => {
                return plant.characteristics.sunExposure === filterFormData.sunExposure;
            });
        }

        if (filterFormData.shouldFilterColour === "on") {
            filteredPlants = filteredPlants.filter(plant => {
                const [plantRed, plantGreen, plantBlue] = plant.characteristics.colourNums

                return (
                    (plantRed >= redFilterMin && plantRed <= redFilterMax) &&
                    (plantGreen >= greenFilterMin && plantGreen <= greenFilterMax) &&
                    (plantBlue >= blueFilterMin && plantBlue <= blueFilterMax)
                )
            })
        }

        return filteredPlants;

    } catch (error) {
        console.error("Error filtering plants:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

exports.create = create
exports.get = get
exports.getAll = getAll