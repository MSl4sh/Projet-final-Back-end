const S = require('mongoose');

const PublicationSchema = new mongoose.Schema({

    posterId :{
        type: String,
        required: true,
    },
    message:{
        type: String,
        trim: true,
        manlength: 500,
    },
    picture:{
        type: String,
    },
    video: {
        type: String,
    },
    likers:{
        type:[String],
        required: true,
    },
    comments:{
        type:[
            {
                commenterId: String,
                commenterPseudo: String,
                comment: String,
                timestamp: Number
            }
        ],
        required: true,
    },
    
},
{
    timestamps:true,
}
)

module.exports= mongoose.model('publication', PublicationSchema);
