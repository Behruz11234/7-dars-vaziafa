const express = require("express")
const { read_file, write_file } = require("./fs/file-manager")
require("dotenv").config()
const cors = require("cors")
const uuid = require("uuid")

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
// GET
app.get("/get_all_products",(req,res) => {
  const products = read_file("product.json")

  res.status(200).json(products)
})
 

////////////////// POST/////////////////////
app.post("/add_product", (req,res) => {
const { title,quantity} = req.body

const products = read_file("product.json")

products.push({
  id:uuid.v4(),
  title,
  quantity
})

write_file("product.json",products)

res.status(201).json({
  massage:"Added new product"
})
})

app.get("/get_one_product/:id",(req,res) => {

  const { id } = req.params

  const product = read_file("product.json")

  const foundedProduct = product.find((item) => item.id === id)

  if(!foundedProduct) {
    return res.status(404).json({
      massage:"Prouct not found"
    })
  }

  res.status(200).json(foundedProduct)
})

// upDate
app.patch("/update_product/:id",(req,res) => {

  const { id } = req.params 
  const { title,quantity } = req.body

  const product = read_file("product.json")

  const foundedProduct = product.find((item) => item.id === id)

  if(!foundedProduct) {
    return res.status(404).json({
      massage:"Prouct not found"
    })
  }
 
  products.forEach((item) => {
    if(item.id === id) {
      item.title = title ? title : item.title
      item.quantity = quantity ? quantity : item.quantity
    }
  })
   
 write_file("product.json", products)

  res.status(200).json({
    massage: "Updated"
  })
})

// Delete 
app.delete("/delete_product/:id", (req,res) => {
  const { id } = req.params

  const product = read_file("product.json")

  const foundedProduct = product.find((item) => item.id === id)

  if(!foundedProduct) {
    return res.status(404).json({
      massage:"Prouct not found"
    })
  }

    products.forEach((item,idx) => {
    if(item.id === id) {
    products.splice(idx, 1 )
    }
  })
   
 write_file("product.json", products)
 
res.status(200).json({
  massage: "Deleted"
})
})


// Users
app.post("/add_user",(req,res) => {
  const { name, email } = req.body 

  if(!name || !email){
    return res.status(400).json({
      massage: "Name and email required"
    })
  }

  const users = read_file("users.json")

  users.push({
    id: uuidv4(),
    name,
    email
  })

  write_file("users.json", users)

  res.status(201).json({
  massage:"User added"
})
})

app.patch("/update_user/:id",(req,res) => {
  const users = read_file('users.json')

  const found = users.find(i => i.id === req.params.id)

  if(!found){
    return res.status(404).json({
      massage: "User not found"
    })
  }

  users.forEach(i=>{
    if(i.id===req.params.id){
      i.name = req.body.name ? req.body.name : i.name
      i.email = req.body.email ? req.body.email : i.email
    }
  })

  write_file("users.json", users)

  res.json({
    massage: "Updated"
  })

  app.delete("/delete_user/:id",(req,res)=>{
  let users = read_file("users.json")

  const found = users.find(i=>i.id===req.params.id)

  if(!found){
    return res.status(404).json({message:"User not found"})
  }

  users = users.filter(i=>i.id!==req.params.id)

  write_file("users.json", users)

  res.json({message:"Deleted"})

})
})

// ORDERS
app.post("/add-order",(req,res) => {
  const { userId,productId } = req.body

  if(!userId || !productId){
    return res.status(400).json({
      massage: "userId and productId required"
    })
  }

  const orders = read_file_("orders.json")

  orders.push({
    id: uuid.v4(),
    userId,
    productId
  })

  write_file("orders.json",orders)

  res.status(201).json({
  massage: "Order added"
  })

  app.patch("/update_order/:id",(req,res)=>{
  const orders = read_file("orders.json")

  const found = orders.find(i=>i.id===req.params.id)

  if(!found){
    return res.status(404).json({message:"Order not found"})
  }

  orders.forEach(i=>{
    if(i.id===req.params.id){
      i.userId = req.body.userId ? req.body.userId : i.userId
      i.productId = req.body.productId ? req.body.productId : i.productId
    }
  })

  write_file("orders.json", orders)

  res.json({message:"Updated"})
})
})

// CATEGORIES
app.post("/add_category",(req,res)=>{
  if(!req.body.name){
    return res.status(400).json({message:"Name required"})
  }

  const categories = read_file("categories.json")

  categories.push({
    id: uuid.v4(),
    name: req.body.name
  })

  write_file("categories.json", categories)

  res.status(201).json({message:"Added"})
})



app.listen(PORT, () => {
  console.log("Server is running at: PORT");
}) 