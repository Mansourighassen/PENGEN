var attrib = {

}


const generatedbconfig =(host,user,password,db)=>{
    let data = `module.exports = {
        HOST: "${host}",
        USER: "${user}",
        PASSWORD: "${password}",
        DB: "${db}",
        dialect: "postgres",
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      };`;

      return data;

};

const generatemodel =(name,attributes)=>{
  let dataheader= `module.exports = (sequelize, Sequelize) => {
    const ${name} = sequelize.define("${name}", {
      `;
    let databody="";
    attributes.forEach(element =>{
        databody=databody+generateattributes(element.attribname,element.attributetype[0]);
      })
    
  let datafooter =` });
  return ${name};
  };`;
  let data =dataheader+databody+datafooter;
  return data;
  
}

const generateattributes =(attributename,type)=>{
  let attrib = `
   ${attributename}: {
    type: Sequelize.${type}
  },
  `
  return attrib;
}

const generateindexjs =(modelarray)=>{
let indexa=`const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
` 
let indbody="";
modelarray.forEach(element => {
indbody = indbody+`db.${element} = require("./${element}.model.js")(sequelize, Sequelize); \n`

})


let footerindex=`module.exports = db;`

indexa=indexa+indbody+footerindex;
return indexa;



}
const generate_crud=(name,attributes)=>{
  let crudfile=`const db = require("../models");
  const ${name} = db.${name};
  const Op = db.Sequelize.Op;`
 let createbody = generate_createmethod(name,attributes);

  let bodyfile= `

  exports.findAll = (req, res) => {
     
      ${name}.findAll()
      .then(data=>{
          res.status(200).send(data);
      })
      .catch(err=>{
          res.status(500).send({
              message:err.message||"Some error occured while retrieving ${name}."
          })
      })
  };
  
  // Find a single  ${name} with an id
  exports.findOne = (req, res) => {
    const id = req.params.id; 
    ${name}.findByPK(id)
    .then(data=>{
        res.status(200).send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message:err.message||"Some error occured while retrieving ${name}. with id "+id
        })
    })
  };
  
  // Update  ${name} by the id in the request
  exports.update = (req, res) => {
    const id = req.params.id; 
    ${name}.update(req.body,{
        where:{id:id}
      
    }).then(num=>{
        if(num==1){
            res.status(200).send({
                message:"${name} has updated successfully"
            })
        }
    })
  };
  
  // Delete a  ${name} with the specified id in the request
  exports.delete = (req, res) => {
    const id=req.params.id;
    ${name}.destroy({
        where:{id:id}
    })
    .then(num=>{
        if(num==1){
        res.status(200).send({
            message:"${name} has deleted successfully!"
        })
      }else{
      res.status(200).send({
          message:"cannot delete ${name} with id="+id
      })
      }
    }).catch(err=>{
        res.status(500).send({
            message:"Could not delete ${name} with id="+id
        })
    })
  };
  
  // Delete all  ${name}s from the database.
  exports.deleteAll = (req, res) => {
    ${name}.destroy({
        where:{},
        truncate:false
    })
    .then(nums=>{
        res.status(200).send({message:nums+"."+"${name} were deleted successfully!"})
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all ${name}."
      });
    });
  };
  
 


  `

  return crudfile+createbody+bodyfile;

}


const generate_createmethod=(model,attributes)=>{

let dataif =""
let modelobj=``;
attributes.forEach(element=>{
  
  dataif=dataif+`!req.body.${element.attribname}||`
  modelobj=modelobj+`${element.attribname}:req.body.${element.attribname},\n`
})
dataif=dataif.slice(0,dataif.length-2); 
let template_function=`
exports.create = (req, res) => {
  if(${dataif}){
      res.status(400).send({
          message:"Content can not be empty !"
      })
      return
  }

  //create ${model} 
  const ${model.toUpperCase()} ={
      ${modelobj}
  }

  //persist ${model}  
  ${model}.create(${model.toUpperCase()})
  .then(data =>{
      res.status(200).send(data);
  })
  .catch(err =>{
      res.status(500).send({
          message:
          err.message||"Some error occurred while creating the ${model}."
      })
  })

};
`

return template_function;

}


const generatemodelroutes=(model)=>{
  let bodyfile =`
    module.exports = app => {
    const ${model} = require(".././controller/${model}.controller");
  
    var router = require("express").Router();
  
    // Create a new ${model}
    router.post("/", ${model}.create);
  
    // Retrieve all ${model}
    router.get("/", ${model}.findAll);
  
    
    // Retrieve a single ${model} with id
    router.get("/:id", ${model}.findOne);
  
    // Update a ${model} with id
    router.put("/:id", ${model}.update);
  
    // Delete a ${model} with id
    router.delete("/:id", ${model}.delete);
  
    // Delete all ${model}s
    router.delete("/", ${model}.deleteAll);
  
    app.use('/api/${model}', router);
  };`
  return bodyfile;
}

const generate_mainjs=(models)=>{
  let mainj=`const express = require("express");
  const bodyParser = require("body-parser");
  const cors = require("cors");
  
  const app = express();
  
  var corsOptions = {
    origin: "http://localhost:8081"
  };
  
  app.use(cors(corsOptions));
  
  // parse requests of content-type - application/json
  app.use(bodyParser.json());
  
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // simple route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });
  
  const db = require("./models");
  db.sequelize.sync();
  
  // set port, listen for requests
  
  const PORT = process.env.PORT || 8080;`

  let mainfooter =` app.listen(PORT, () => {
    console.log("Server is running on port ."+PORT);
  });`
  let mainbody="";
  models.forEach(element=>{
    mainbody=mainbody+`require("./routes/${element[0]}.routes.js")(app); \n`
  })
  return mainj+mainbody+mainfooter;
  
 
}


exports.generatemodelroutes=generatemodelroutes;
exports.generate_mainjs=generate_mainjs;
exports.generate_crud=generate_crud;
exports.generateindexjs=generateindexjs;
exports.generatedbconfig=generatedbconfig;
exports.generateattributes=generateattributes;
exports.generatemodel=generatemodel;