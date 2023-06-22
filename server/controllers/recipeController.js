require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/*
  * GET /
  * Homepage
 */
exports.homepage = async(req,res) => {
    try {
       const limitNumber=5;
       const categories = await Category.find({}).limit(limitNumber);
       const latest = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
       const NorthIndian = await Recipe.find({ 'Category' : 'North Indian'}).limit(limitNumber);
       const SouthIndian = await Recipe.find({'Category' : 'South Indian'}).limit(limitNumber);
       const BakedGoods = await Recipe.find({'Category' : 'Baked Goods'}).limit(limitNumber);
       const Punjabi = await Recipe.find({'Category' : 'Punjabi'}).limit(limitNumber);
       const chinese = await Recipe.find({'Category' : 'Chinese'}).limit(limitNumber);
       const Rajasthani = await Recipe.find({'Category' : 'Rajasthani'}).limit(limitNumber);
       const Gujarati = await Recipe.find({'Category' : 'Gujarati'}).limit(limitNumber);
       const Mughlai = await Recipe.find({'Category' : 'Mughlai'}).limit(limitNumber);
       const Bengali = await Recipe.find({'Category' : 'Bengali'}).limit(limitNumber);

       const food = {latest, NorthIndian, SouthIndian, BakedGoods, Punjabi, chinese, Rajasthani, Gujarati, Mughlai, Bengali};
      res.render('index',{title : 'FlavorfulFare - HOME', categories, food});
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured"});
    }
}


/*
  * GET /categories
  * Categories
 */
exports.exploreCategories = async(req,res) => {
  try {
     const limitNumber=20;
     const categories = await Category.find({}).limit(limitNumber);

    res.render('categories',{title : 'FlavorfulFare - Categories', categories});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}



/*
  * GET /categories/:id
  * Categories By Id
 */
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'Category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'FlavorfulFare - Categories', categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 





/*
  * GET / recipe/ :id
  * Recipe
 */
exports.exploreRecipe = async(req,res) => {
  try {
     let recipeId = req.params.id;
     const recipe = await Recipe.findById(recipeId);
    res.render('recipe',{title : 'FlavorfulFare - Recipe',recipe});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}



/*
  * POST / search
  * Recipe
 */
exports.searchRecipe = async(req,res) => {

    // searchTerm
    try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find({ $text:{ $search: searchTerm, $diacriticSensitive:true}});
    res.render('search',{title : 'FlavorfulFare - Search' , recipe});
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured"});
    }
}



/*
  * GET / explore-latest
  * Explore Latest
 */
exports.exploreLatest = async(req,res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
    res.render('explore-latest',{title : 'FlavorfulFare - Explore Latest',recipe});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}


/*
  * GET / show-random
  * Show Random
 */
exports.showRandom = async(req,res) => {
  try {
   let count = await Recipe.find().countDocuments();
   let random = Math.floor(Math.random() * count);
   let recipe = await Recipe.findOne().skip(random).exec();
  
  res.render('show-random',{title : 'FlavorfulFare - Random Recipe',recipe});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}



/*
  * GET / submit-recipe
  * Submit Recipe
 */
exports.submitRecipe = async(req,res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe',{title : 'FlavorfulFare - Submit Recipe',infoErrorsObj, infoSubmitObj});
}

/*
  * POST / submit-recipe
  * Submit Recipe
 */
exports.submitRecipeOnPost = async(req,res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.status(500).send(err);
      })

    }

    const newRecipe = new Recipe({
       name: req.body.name,
       description: req.body.description,
       Email: req.body.email,
       Ingredients: req.body.ingredients,
       Category: req.body.category,
       image: newImageName
    });

    await newRecipe.save();

    req.flash('infoSubmit','Recipe has been added Successfully');
    res.redirect('submit-recipe');
  } catch (error) {
    req.flash('infoErrors',error);
    res.redirect('submit-recipe');
  }
  
}





/*
  * GET /about
  * About
 */
exports.about = async(req,res) => {
  try {
     
     

    res.render('about',{title : 'FlavorfulFare - About'});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}


/*
  * GET /contactus
  * Contact us
 */
exports.contactUs = async(req,res) => {
  try {

    res.render('contactus',{title : 'FlavorfulFare - Contact Us'});
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured"});
  }
}












// async function insertDymmyRecipeData(){
//   try {
//    await Recipe.insertMany([
//        {
//          "name": "Spring Rolls",
//          "description" : 
//         `1. To make the spring roll wrappers, in a mixing bowl, combine maida, corn flour, salt, and oil. Gradually add water while whisking continuously to make a smooth batter. Let it rest for 20-30 minutes.
//          2. Heat a non-stick pan or tawa over medium heat. Grease it lightly with oil.
//          3. Pour a ladleful of the batter onto the center of the pan and quickly spread it in a circular motion to form a thin pancake-like wrapper. Cook until the edges start to lift and the bottom side turns golden. Remove the wrapper and repeat the process to make more wrappers with the remaining batter. Let the wrappers cool down.
//          4. In a separate pan, heat 2 tablespoons of oil over medium heat. Add the finely chopped garlic and sauté for a minute until fragrant.
//          5. Add the chopped green chillies and sliced onions. Stir-fry until the onions turn translucent.
//          6. Add the julienned carrots, chopped cabbage, chopped beans, and chopped capsicum. Stir-fry for about 2-3 minutes until the vegetables are slightly cooked but still retain some crunch.
//          7. Add vinegar, soy sauce, chilli sauce, pepper powder, and salt to the pan. Mix well and cook for another minute. Remove from heat and let the filling cool down.
//          8. To assemble the spring rolls, place a spring roll wrapper on a clean surface. Spoon a portion of the vegetable filling onto one corner of the wrapper. Roll the corner tightly over the filling, then fold in the sides. Continue rolling until the entire wrapper is sealed. Use the maida paste to seal the edges of the wrapper.
//          9. Repeat the process with the remaining wrappers and filling.
//          10. Heat oil for frying in a deep pan or skillet. Once the oil is hot, carefully add a few spring rolls at a time and fry until they turn golden brown and crispy. This should take about 3-4 minutes per batch.
//          11. Use a slotted spoon to remove the fried spring rolls from the oil and place them on a paper towel-lined plate to drain excess oil.
//          12. Serve the hot and crispy vegetable spring rolls with your favorite dipping sauce.`,
//          "Email" : "Deepanshu123@gmail.com",
//          "Ingredients" : ["2 cup maida / plain flour","oil (for frying)","2 tbsp corn flour","½ tsp salt","2½ cup water"," 2 tbsp oil"," 3 clove garlic (finely chopped)","2 chilli (finely chopped)","  2 tbsp spring onion (chopped)","2 Green Chillies (Chopped)"," ½ onion (sliced)","  1 carrot (julienne)","2 cup cabbage (chopped)"," 5 beans (chopped)","½ capsicum (chopped)"," 2 tbsp vinegar" ,"2 tbsp soy sauce"," 2 tsp chilli sauce","¼ tsp pepper powder","½ tsp salt","½ cup maida paste (for sealing)"],
//          "Category" : "Chinese",
//          "image": "SpringRolls.jpg"
//        },
//        {
//         "name": "Masala Dosa",
//         "description" : 
//        `1. To make the dosa batter, rinse the rice, urad dal, and fenugreek seeds separately and soak them in water for about 4 to 6 hours.
//         2. Drain the water and grind the rice, urad dal, and fenugreek seeds separately to a smooth paste using a grinder or blender. Add water gradually while grinding to get a thick yet flowing batter.
//         3. Mix the ground rice and urad dal batter together in a large bowl. Add salt and mix well. Ferment the batter by keeping it in a warm place for 8 to 10 hours or overnight until it rises and becomes slightly sour.
//         4. To make the potato filling, heat oil in a pan over medium heat. Add mustard seeds and let them splutter. Then, add cumin seeds, split black gram, and chana dal. Sauté until they turn golden brown.
//         5. Add chopped onions, green chili, grated ginger, and curry leaves. Sauté until the onions turn translucent.
//         6. Add turmeric powder and salt. Mix well and cook for a minute.
//         7. Add the boiled and mashed potatoes to the pan. Mix everything together and cook for 2 to 3 minutes. Remove from heat and garnish with chopped coriander leaves. Keep the filling aside.
//         8. Heat a dosa tawa or a non-stick skillet over medium-high heat. Grease it lightly with oil.
//         9. Pour a ladleful of dosa batter onto the center of the tawa and spread it in a circular motion to form a thin dosa.
//        10. Drizzle a little oil around the edges of the dosa and cook until it turns golden brown and crisp.
//        11. Place a portion of the potato filling on one side of the dosa and fold it over to form a semi-circle or roll it into a cylindrical shape.
//        12. Remove the masala dosa from the tawa and serve hot with coconut chutney and sambar.`,
//         "Email" : "Deepanshu123@gmail.com",
//         "Ingredients" : ["2 cups parboiled rice","1/2 cup urad dal (split black gram)","1/2 teaspoon fenugreek seeds"," Salt to taste","3 to 4 medium-sized potatoes, boiled and mashed","1 tablespoon oil","1 teaspoon mustard seeds","1 teaspoon cumin seeds","1/2 teaspoon split black gram (urad dal)","1/2 teaspoon chana dal (split Bengal gram)","1 onion, finely chopped","1 green chili, finely chopped","1/2 inch ginger, grated","8-10 curry leaves","1/2 teaspoon turmeric powder" ,"Salt to taste","2 tablespoons chopped coriander leaves"],
//         "Category" : "South Indian",
//         "image": "Dosa.jpg"
//       },
//       {
//       "name": "Amritsari Lassi",
//       "description" : 
//      ` 1. In a blender or mixer, add plain yogurt, chilled water, sugar, cardamom powder, and saffron strands (if using).
//        2. Blend everything together until you get a smooth and frothy consistency. You can adjust the amount of water and sugar according to your taste preference.
//        3. Once the lassi is well blended, pour it into tall glasses.
//        4. Add some crushed ice to the glasses to keep the lassi cool.
//        5. Garnish with chopped pistachios or almonds, and if desired, sprinkle some rose petals on top for an authentic touch.
//        6. Serve the Amritsari lassi immediately and enjoy it chilled.`,
//       "Email" : "Deepanshu123@gmail.com",
//       "Ingredients" : ["1 cup plain yogurt","1 cup chilled water","4 tablespoons sugar (adjust to taste)","1/2 teaspoon cardamom powder","A pinch of saffron strands (optional)","Crushed ice for serving","Chopped pistachios or almonds for garnish (optional)","Rose petals for garnish (optional)"],
//       "Category" : "Punjabi",
//       "image": "Lassi.jpg"
//     }
//      ]);
//   } catch (error) {
//    console.log('err',+error)
//   }
// }

// insertDymmyRecipeData();



























// async function insertDymmyRecipeData(){
//    try {
//     await Recipe.insertMany([
//         {
//           "name": "Pav Bhaji",
//           "description" : 
//          ` 1. Prepare ingredients as mentioned in the list.
//            2. Boil the mixed vegetables along with peas, in a pressure cooker with 1 cup of water, for one whistle. Keep aside.
//            3. Heat oil in a pan, add chopped onions and fry till they turn golden brown. Add ginger garlic paste and fry for 5 minutes. Add tomatoes, green chillies, turmeric powder, chilli powder, coriander powder, cumin powder, and fry for a minute till all the masalas are well combined.
//            4. Add the vegetables along with the water, PAV BHAJI MASALA, salt and mix well. Mash the vegetables well with a spoon. Add the amchur powder and mix well.
//            5. Add the remaining 1 cup water and simmer for 2 minutes to get a thick gravy. Remove from fire and add the lime juice and mix well.
//            6. Garnish with coriander leaves and serve hot with Pav and Butter.
//            Source: https://www.maggi.in/recipes/pav-bhaji/?utm_source=Google&utm_medium=cpc&utm_campaign=IN_MAGG_mgg_en_GO_NonBrand_EX_NA_CON_FLWDRS_NA_Compete_NA&gad=1&gclid=CjwKCAjw-b-kBhB-EiwA4fvKrDze2XXodPVGCh0AZLNFEEoby-ABFN1898fc3zudXIOpfltC6x8nVhoC-jkQAvD_BwE&gclsrc=aw.ds#`,

//           "Email" : "Deepanshu123@gmail.com",
//           "Ingredients" : ["450gms Mixed Vegetables (Potato, Cauliflower, Carrot, Beans, Capsicum)","Pav Bhaji Masala","2 Tablespoons Oil","2 Onion (Chopped)","1 Teaspoon Ginger-Garlic Paste","2 Tomato (Chopped)","50 gms Peas","2 Cups Water","2 Green Chillies (Chopped)","0.5 Teaspoon Turmeric Powder","1 Teaspoon Red Chilli Powder","2 Teaspoons Coriander Powder","1 Teaspoon Cumin Powder","1 Teaspoon Amchur Powder","2 Tablespoons Coriander Leaves (Chopped)" ,"2 Tablespoons Lime Juice","1 Pinch Salt"],
//           "Category" : "North Indian",
//           "image": "PavBhaji.jpg"
//         }
//       ]);
//    } catch (error) {
//     console.log('err',+error)
//    }
// }

// insertDymmyRecipeData();







// async function insertDymmyCategoryData(){
//    try {
//     await Category.insertMany(
//       [
//         {
//           "name": "North Indian",
//           "image": "NorthIndian.jpg"
//         },
//         {
//           "name": "Punjabi",
//           "image": "Punjabi.jpg"
//         },
//         {
//           "name": "South Indian",
//           "image": "SouthIndian.jpg"
//         },
//         {
//           "name": "Mughlai",
//           "image": "Mughlai.jpg"
//         },
//         {
//           "name": "Bengali",
//           "image": "Bengali.jpg"
//         },
//         {
//           "name": "Gujarati",
//           "image": "Gujarati.jpg"
//         },
//         {
//           "name": "Rajasthani",
//           "image": "Rajasthani.jpg"
//         }
//       ]
//     );
//    } catch (error) {
//     console.log('err',+error)
//    }
// }

// insertDymmyCategoryData();



// {
//   "name": "Masala Dosa",
//   "image": "MasalaDosa.jpg"
// },
// {
//   "name": "Uttapam",
//   "image": "Uttapam.jpg"
// },
// {
//   "name": "Sarso ka Saag with Makke ki Roti",
//   "image": "Sarso.jpg"
// },
// {
//   "name": "Patiala Shahi Lassi",
//   "image": "Lassi.jpg"
// },
// {
//   "name": "Manchurian",
//   "image": "manchurian.jpg"
// },
// {
//   "name": "Hakka Noodles",
//   "image": "Noodles.jpg"
// },
// {
//   "name": "Bhakarwadi",
//   "image": "Bhakar.jpg"
// },
// {
//   "name": "Undhiyu",
//   "image": "Undhiyu.jpg"
// },
// {
//   "name": "Gatte ki khichdi",
//   "image": "Khichdi.jpg"
// },
// {
//   "name": "Dal baati churma",
//   "image": "DBC.jpg"
// },
// {
//   "name": "Biryani",
//   "image": "Biryani.jpg"
// },
// {
//   "name": "Haleem",
//   "image": "Haleem.jpg"
// },
// {
//   "name": "Mishti Doi",
//   "image": "Mishti.jpg"
// },
// {
//   "name": "Shukto",
//   "image": "Shukto.jpg"
// }