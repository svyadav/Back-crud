var express = require("express");
var router = express.Router();
const { mongodb, dbName, dbUrl, MongoClient } = require("../dbConfig");
const { userModel, mongoose } = require("../dbSchema");
const {
  hashPassword,
  hashCompare,
  createToken,
  jwtDecode,
  validate,
  roleAdmin,
} = require("../auth");
const { ObjectID } = require("bson");

mongoose.connect(dbUrl);

/* GET users listing. */
router.get("/", validate, roleAdmin, async (req, res) => {
  let token = req.headers.authorization.split(" ")[1];
  let data = await jwtDecode(token);
  let user = await userModel.findOne({ email: data.email });
  if (user) {
    let users = await userModel.find({}, { password: 0, __v: 0 });
    res.send({
      statusCode: 200,
      data: users,
    });
  } else {
    res.send({
      statusCode: 404,
      message: "Unauthorized",
    });
  }
});


router.get('/:id',async(req,res)=>{
  try{
    let user=await userModel.findOne({_id:mongodb.ObjectId(req.params.id)})

    res.send({
      statusCode:200,
      data:user
    })

  }
  catch(error){
    console.log(error)
    res.send({statusCode:500,
      message:"Internal server error",
      error
    })
  }
})


router.post("/signup", async (req, res) => {
  try {
    let user = await userModel.find({ email: req.body.email });
    if (user.length) {
      res.send({
        statusCode: 200,
        message: "User already exists",
      });
    } else {
      let hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;
      let newUser = await userModel.create(req.body);
      res.send({
        statusCode: 200,
        message: "Sign up successfull",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    let user = await userModel.find({ email: req.body.email });
    if (user.length) {
      let hash = await hashCompare(req.body.password, user[0].password);
      if (hash) {
        let token = await createToken(user[0].email, user[0].role);

        res.send({
          statusCode: 200,
          message: "Sign in successfull",
          token,
        });
      } else {
        res.send({
          statusCode: 400,
          message: "Invalid credentials",
        });
      }
    } else {
      res.send({
        statusCode: 400,
        message: "User does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

router.delete("/delete-user/:id", validate, roleAdmin, async (req, res) => {
  try {
    let user = await userModel.findOne({
      _id: mongodb.ObjectId(req.params.id),
    });
    if (user) {
      let users = await userModel.deleteOne({
        _id: mongodb.ObjectId(req.params.id),
      });
      res.send({
        statusCode: 200,
        message: "User deleted successfully",
      });
    } else {
      res.send({
        statusCode: 400,
        message: "User does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

router.put("/edit-user/:id",validate,roleAdmin, async (req, res) => {
  try {
    let user = await userModel.findOne({
      _id: mongodb.ObjectId(req.params.id),
    });
    if (user) {
      user.firstName=req.body.firstName
      user.lastName=req.body.lastName
      user.email=req.body.email
      await user.save()
      res.send({
        statusCode: 200,
        message: "User data saved successfully",
      });
    } else {
      res.send({
        statusCode: 400,
        message: "User does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});
module.exports = router;
