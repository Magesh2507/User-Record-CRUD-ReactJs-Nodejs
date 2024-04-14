import React, { useEffect, useState } from 'react'
import './crud.css'
import axios from 'axios'

const Crud = () => {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [ismodal, setIsModal] = useState(false)
    const [newUser, setNewUser] = useState({ name: "", age: "", city: "" })
    const [isError, setIsError] = useState(false)
    const [noData, setNoData] = useState(false)
    const [isAddingRecord, setIsAddingRecord] = useState(false);

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async () => {
        await axios.get('https://user-crud-reactjs-nodejs.onrender.com/users').then(res => {
            setUsers(res.data)
            setFilteredUsers(res.data)
        }).catch(err => console.log(err))
    }

    const search = (e) => {
        const text = e.target.value.toLowerCase()
        const filtered = users.filter(user => user.name.toLowerCase().includes(text) || user.city.toLowerCase().includes(text))
        if(!filtered.length){setNoData(true)}  
        else{setNoData(false)      
        setFilteredUsers(filtered)}
    }

    const addRecord = () => {
        setIsError(false)
        setIsModal(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    }

    const handleSubmit = async () => {

        if (newUser.name && newUser.age && newUser.city) {
            setIsAddingRecord(true);
            if (newUser.id) {
                await axios.patch(`https://user-crud-reactjs-nodejs.onrender.com/users/${newUser.id}`, newUser).then(res => {
                    setUsers(res.data.data)
                    setFilteredUsers(res.data.data)
                }).catch(err => console.log(err))
            }

            else {
                await axios.post('https://user-crud-reactjs-nodejs.onrender.com/users', newUser).then(res => {
                    setUsers(res.data.data)
                    setFilteredUsers(res.data.data)
                }).catch(err => console.log(err))
            }
            setIsError(false)
            setIsModal(false)
            setNewUser({ name: "", age: "", city: "" })
            setIsAddingRecord(false);
        }
        else {
            setIsError(true)
        }

    }

    const editUser = (user) => {
        setIsModal(true)
        setNewUser(user)
    }

    const deleteUser = async (id) => {
        if (window.confirm("Confirm to delete User")) {
            await axios.delete(`https://user-crud-reactjs-nodejs.onrender.com/users/${id}`).then(res => {
                setUsers(res.data.data)
                setFilteredUsers(res.data.data)
            }).catch(err => console.log(err))
        }
    }

    const closeModal = () => {
        setIsModal(false)
        setNewUser({ name: "", age: "", city: "" })
    }

    return (
        <div className='container'>
            <h1>CRUD operation using React-Nodejs</h1>
            <div className='input-container'>
                <input placeholder='search' onChange={search} />
                <button className='add-btn' onClick={addRecord}>Add Record</button>
            </div>
            {!noData ?(
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>City</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers && filteredUsers.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.age}</td>
                                    <td>{user.city}</td>
                                    <td><button className='table-btn edit' onClick={() => editUser(user)}>Edit</button></td>
                                    <td><button className='table-btn delete' onClick={() => deleteUser(user.id)}>Delete</button></td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>):(
                    <div className='no-data'>No data found</div>
                )}
            {ismodal && <div className='modal-container'>
                <div className='modal'>

                    <div className='record-container'>
                        <button className='close-btn' onClick={closeModal}>&times;</button>
                        {isError && <p className='error-message'>All fields are mandatory</p>}
                        <label htmlFor='name' >Name</label>
                        <input id='name' type='text' name='name' value={newUser.name} onChange={handleChange}></input>
                        <label htmlFor='age' >Age</label>
                        <input id='age' type='number' name='age' value={newUser.age} onChange={handleChange}></input>
                        <label htmlFor='city' >City</label>
                        <input id='city' type='text' name='city' value={newUser.city} onChange={handleChange}></input>
                        <div className='btn-div'><button className='add-rec-btn' onClick={handleSubmit} disabled={isAddingRecord}>
                    {isAddingRecord ? 'Adding Record...' : 'Add Record'}</button></div>
                    </div>
                </div>
            </div>
            }
        </div>
    )
}

export default Crud
