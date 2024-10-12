import express from "express";
import bodyParser from "body-parser";
import  pg  from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const db = new pg.Client({
  user : '', 
  host : '',
  database : '',
  password : '123456', 
  port : 5432
}); 

try{
  db.connect()
  console.log("database Connected"); 
}catch(err){ 
  console.err("Error while connecting to the database" , err.message);
};

app.get("/", async(req, res) => {

  try{
    const result = await db.query("SELECT * FROM items ORDER BY id ASC "); 

    let items = result.rows
    
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  }); }
  catch(error){ 
    console.log("error while rendering the home page " + error.message)
  };
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
try{ 
  const newitem = await db.query(`insert into items(title) values('${item}')` )
  console.log("Done added new task " + item);
}catch(err){ 
  console.log("Erro while adding new task" , err.message);
};
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
try{
const id = req.body.updatedItemId; 
const newitem = req.body.updatedItemTitle;
await db.query(`UPDATE items
SET title = '${newitem}'
WHERE id = '${id}';`);
res.redirect("/")
}catch(err){
  console.log("Error while editing the task " + err.message);
}; 
});

app.post("/delete", async(req, res) => {
 const id = req.body.deleteItemId; 
 await db.query("Delete from items where id = $1" ,[id]);
 res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
