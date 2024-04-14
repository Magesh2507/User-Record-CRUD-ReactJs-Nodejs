const express = require('express')
const cors = require('cors')
const fs = require('fs')
const Users = require('./data.json')
const port = 8000
const app = express()
app.use(express.json())

app.use(cors({
    origin: 'https://crud-users-react-nodejs.netlify.app',
    modes: ["GET", "POST", "PATCH", "DELETE"]
}))


app.get('/users', (req, res) => {
    //console.log(Users)
    return res.json(Users)
})

app.post('/users', (req, res) => {
    const id =Date.now()
    const userData = {...req.body, id}   
    Users.push(userData); 
    fs.writeFile('./data.json', JSON.stringify(Users), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    return res.json({ "data": Users, "message": "User added succefully" })
})

app.patch('/users/:id', (req, res) => {
    const userData = req.body;
    const userId = Number(req.params.id);   
    const updatedUserData = Users.map(user=> user.id === Number(userId) ? userData : user); 
    fs.writeFile('./data.json', JSON.stringify(updatedUserData), (err) => {
        if (err) throw err;
    });
    return res.json({ "data": updatedUserData, "message": "User data updated succefully" })
    
})

app.delete('/users/:id',  (req, res) => {
    const id = Number(req.params.id)
    const filtered = Users.filter(user => user.id !== id)
    fs.writeFile('./data.json', JSON.stringify(filtered), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });
    return res.json({ "data": filtered, "message": "User deleted succefully" })
})

app.listen(port, (err) => {
    if (err) console.log(err)
})
