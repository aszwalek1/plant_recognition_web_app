let mongoose = require('mongoose');

let Schema = mongoose.Schema;

const plantSchema = new Schema(
    {
        name: String,
        description: String,
        characteristics: {
            hasFlowers: Boolean,
            hasLeaves: Boolean,
            hasFruit: Boolean,
            hasSeeds: Boolean,
            sunExposure: {type: String, enum: ["full", "partial", "shade"]},
            height: Number,
            spread: Number,
            colour: String // hexadecimal number given by <input type="color"></input
        },
        imagePath: String,
        nameStatus: {type: String, enum: ["completed", "in-progress"]},
        username: String,
        chatMessages:[{
            message: String,
            username: String,
            datetime: Date
        }],
        //TODO location: type: ? ,
        date: Date,
    }
);

plantSchema.virtual('characteristics.colourNums').get( function() {
    const colour = this.characteristics.colour;

    if (colour === undefined) {
        return undefined
    } else {
        return [
            Number("0x" + colour.substring(1, 3)), // red,
            Number("0x" + colour.substring(3, 5)), // green,
            Number("0x" + colour.substring(5, 7)) // blue
        ]
    }
})

plantSchema.set('toObject',  {getters: true, virtuals: true});
plantSchema.set('toJSON', {virtuals: true})

let Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
