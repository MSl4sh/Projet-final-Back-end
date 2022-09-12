const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema({

    posterId :{
        type: mongoose.Types.ObjectId,
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
                commenterId: mongoose.Types.ObjectId,
                commenterPseudo: String,
                commentText: String,
                timestamp: String
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
