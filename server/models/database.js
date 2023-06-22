const mongoose = require('mongoose');
// const MongoDB_URI = 'mongodb+srv://deepanshusharmae70:Deepsh04@cluster0.veu6mm7.mongodb.net/FlavorfulFare?retryWrites=true&w=majority';
// mongoose.connect(MongoDB_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
   console.log('Connected')
});

//Models
require('./Category');
require('./Recipe');
