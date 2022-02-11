const app = require("express")();
require("./db");
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
app.listen(4000,(err)=>{
    console.log(!err ? "4000" : "error");
});
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  
var personSchema = Schema({
  _id     : Number,
  name    : String,
  age     : Number,
  stories : [{ storyId: { type: Schema.Types.ObjectId, ref: 'Story' }, serial: Number}]
});

var storySchema = Schema({
  _creator : { type: Number, ref: 'Person' },
  title    : String,
  fans     : [{ type: Number, ref: 'Person' }]
});

var Story  = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);

app.post("/person", async(req,res,next)=>{
    var aaron = new Person({ _id: 4, name: 'Jharun', age: 23 });
    let person = await aaron.save();
    res.json({"success": person})
});

app.post("/person/ml/", async(req,res,next)=>{
  var pr = new Person({ _id: req.body.id, name: req.body.name, age: req.body.age, stories: { storyId: req.body.storyId, serial: req.body.serial}});
  let person = await pr.save();
  res.json({"person": person});
});
app.get("/person/ml/", async(req,res,next)=>{
  let person = await Person.find({_id:12}).populate({
    path: "stories",
    populate: {
      path: 'storyId',
      model: "Story",
      //perDocumentLimit: 2,
      options: { limit: 3, skip: 2 }
    }
  }).exec();
  res.json({"person": person});
})

// ,
// populate: {
//   path: 'storyId',
//   model: 'Story'
// }
app.post("/story", async(req,res)=>{
    var story1 = new Story({
        title: "Once upon a timex.",
        _creator: 0,
        fans:[1,2,3,4]   
      });

      let story = await story1.save();
      res.json({"successs": story});
})

app.get("/person",async(req,res)=>{
    let person = await Person.findOne({_id:0}).populate({path:"stories", populate: { path: '_creator fans', populate:{ path:"stories", populate: { path: '_creator fans', populate:{ path:"stories", populate: { path: '_creator fans', populate:{ path:"stories"}}}}}}});
    person.populated('fans');
    res.json({"body":person})
})

app.get("/story", async(req,res)=>{
    let story = await Story.find().populate("_creator fans");
    res.json({"body":story});
})

app.post("/login", async(req,res)=>{
  try{
    const token = await jwt.sign({ name: "kumol", id: "22" }, "secret", { expiresIn: 120 });
    // , { algorithm: 'RS256' }
    return res.json({
      token: token
    });
  }catch(error){
    console.log(error);
    return res.json({
      error: error
    })
  }
})