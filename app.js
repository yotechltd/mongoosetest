const app = require("express")();
require("./db");
app.listen(4000,(err)=>{
    console.log(!err ? "4000" : "error");
});

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  
var personSchema = Schema({
  _id     : Number,
  name    : String,
  age     : Number,
  stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
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
})

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