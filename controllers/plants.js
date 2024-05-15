const Plant = require('../models/plant')
let colourStringToNums = require("../utils").colourStringToNums;
const geolib = require('geolib');

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
            location: plantData.location,
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

function sortPlantsByDistance(userLocation, plants, sorttype) {
    // Calculate distances for each plant
    const plantDistances = plants.map(plant => {
        // Assuming plant has a 'location' property with [latitude, longitude]
        const distance = geolib.getDistance(userLocation, plant.location);
        return { plant, distance };
    });

    if (sorttype === 'closest') {
        plantDistances.sort((a, b) => a.distance - b.distance);
    } else {
        plantDistances.sort((a, b) => b.distance - a.distance);

    }

    return plantDistances.map(plant => plant.plant);
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

        if (filterFormData.sort === 'recent') {
            filteredPlants = await Plant.find().sort({ date: -1 }); // Sort by descending order of date
        } else if (filterFormData.sort === 'oldest') {
            filteredPlants = await Plant.find().sort({ date: 1 }); // Sort by ascending order of date
        } else if (filterFormData.sort === 'closest') {
            filteredPlants = sortPlantsByDistance(filterFormData.userLocation, await Plant.find(),"closest");
        } else if (filterFormData.sort === 'furthest') {
            filteredPlants = sortPlantsByDistance(filterFormData.userLocation, await Plant.find(), "furthest");
        }
        else {
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