const mongoose = require('mongoose');
const { updateMany } = require('./Category');

const recipeSchema = new mongoose.Schema({
  name : {
    type: String,
    required: 'This field is required.'
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  Email : {
    type: String,
    required: 'This field is required.'
  },
  Ingredients: {
    type: Array,
    required: 'This field is required.'
  },
  Category: {
    type: String,
    enum: ['North Indian', 'South Indian', 'Punjabi', 'Mughlai', 'Gujarati', 'Bengali', 'Rajasthani', 'Chinese', 'Baked Goods'],
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  }
});
recipeSchema.index({name:'text', description: 'text'});

module.exports = mongoose.model('Recipe', recipeSchema);
