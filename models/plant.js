let mongoose = require('mongoose');
let colourStringToNums = require("../utils").colourStringToNums;

let Schema = mongoose.Schema;

const plantSchema = new Schema(
    {
        name: String,
        description: String,
        characteristics: {
            hasFlowers: { type: Boolean, default: false},
            hasLeaves: { type: Boolean, default: false},
            hasFruit: { type: Boolean, default: false},
            hasSeeds: { type: Boolean, default: false},
            sunExposure: {type: String, enum: ["full", "partial", "shade"]},
            height: Number,
            spread: Number,
            colour: String // hexadecimal number given by <input type="color"></input
        },
        imagePath: String,
        nameStatus: {type: String, enum: ["Completed", "In-progress"]},
        username: String,
        chatMessages:[{
            message: String,
            username: String,
            datetime: Date
        }],
        //TODO location: type: ? ,
        date: {type: Date, default: Date.now},
    }
);

plantSchema.virtual('characteristics.colourNums').get( function() {
    const colour = this.characteristics.colour;

    if (colour === undefined) {
        return undefined
    } else {
        return colourStringToNums(colour)
    }
})

plantSchema.set('toObject',  {getters: true, virtuals: true});
plantSchema.set('toJSON', {virtuals: true})

let Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
