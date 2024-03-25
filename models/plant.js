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
            //TODO? height:
            //TODO? spread:
            //TODO colour: ?
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

plantSchema.set('toObject',  {getters: true, virtuals: true});

let Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
