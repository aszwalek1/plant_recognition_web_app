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

exports.filterPlants = async function(formData) {
    try {
        let filteredPlants;

        // Logic to filter plants based on the selected date option
        if (formData.date === 'recent') {
            // Sort by most recent
            filteredPlants = await Plant.find().sort({ date: -1 }); // Sort by descending order of date
        } else if (formData.date === 'oldest') {
            // Sort by oldest
            filteredPlants = await Plant.find().sort({ date: 1 }); // Sort by ascending order of date
        } else {
            // No date filter applied, return all plants
            filteredPlants = await Plant.find();
        }

        if (formData.ident || formData.flower || formData.leaf || formData.seeds || formData.fruit) {
            filteredPlants = filteredPlants.filter(plant => {
                // Filter plants that match any selected characteristic
                return (
                    (formData.ident && plant.nameStatus === "Completed") ||
                    (formData.flower && plant.characteristics.hasFlowers === true) ||
                    (formData.leaf && plant.characteristics.hasLeaves === true) ||
                    (formData.seeds && plant.characteristics.hasSeeds === true) ||
                    (formData.fruit && plant.characteristics.hasFruit === true)
                );
            });
        }

        if (formData.sunExposure) {
            console.log("Filtering by Sun Exposure:", formData.sunExposure);
            filteredPlants = filteredPlants.filter(plant => {
                // Filter plants that match the selected sun exposure
                console.log("Plant Sun Exposure:", plant.characteristics.sunExposure);
                return plant.characteristics.sunExposure === formData.sunExposure;
            });
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
