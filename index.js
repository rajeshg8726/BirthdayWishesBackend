const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const Connect = require("./contactus")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const port = 4000
const cors = require('cors');
const app = express()
app.use(cors());

app.use(bodyParser.json());
const generateToken = (payload) => {
    const secretKey = 'yourSecretKey';
    const options = {
        expiresIn: '1m',
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
};
app.use((req, res, next) => {
    if (['POST', 'PUT'].includes(req.method) && !Object.keys(req.body).length) {
        return res.status(400).json({ message: 'Request body is empty' });
    }
    next();
});

const mongoURI = "mongodb+srv://technomithlesh123:eDvIecCAieXAUgrt@cluster0.qbg1m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected successfully.");
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });
    const messageSchema = new mongoose.Schema({
        name: String,
        message: String,
        date: { type: Date, default: Date.now },
      });
      const Message = mongoose.model('Message', messageSchema);
// GET all messages
app.get('/birthday-messages', async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
  });
  
  // POST a new message
  app.post('/birthday-messages', async (req, res) => {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json(newMessage);
  });
const user = []
    const date = new Date()
app.post("/register",async(req,res) =>{
    const {username , password} = req.body;

     if(!username){
        return res.status(403).json({message:"user name required"})
     }
     if(!password){
        return res.status(403).json({message:"password required"})
     }
try {

    const exitingUser = await Connect.findOne( {username} );
    if (exitingUser) {
        return res.status(400).json({ message: 'Username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newUser  =new Connect({username, password:hashedPassword});
    await newUser.save();
 return   res.status(201).json({message:"add register successfull!"})
} catch(error){
 console.error("register error!", error)
 res.status(500).json({error :"register error!"})
};
});
app.post("/login",async(req,res) =>{
    const {username,password} = req.body;

    if(!username){
        res.status(403).json({message:"username required"})
    }

    if(!password){
        res.status(403).json({message:"password required"})
    }
    try{
const user = await Connect.findOne({username});
if(!user ){
    return res.status(303).json({message:"invalid user Name"})
} 
if( user.password != password){
    return res.status(303).json({message:"invalid password"})
}

const token = jwt.sign({ id: user._id.toString() }, 'yourSecretKey', { expiresIn: '1h' });
      return  res.status(200).json({message:"Login successfull!",token}) 
    }catch(error){
console.log("login fail!",error)
return res.status(500).json({error:"internal server error",error})
    }
})



app.post('/', async (req, res) => {
    const { username } = req.body;
    console.log(req.body);

    try {
        if (!username) {
            return res.status(400).json({ message: 'Username required' });
        }
        
        // Assuming you want to send the current date
        const currentDate = new Date();
        

        return res.status(200).json({ message: "Date format received!", date: currentDate });
    } catch (error) {
        console.error("Error occurred!", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port,()=>{
    console.log('hello this is testing')
})