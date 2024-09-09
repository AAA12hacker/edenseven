import React from 'react';
import axios from 'axios';
import UseNotification from '../notify/UseNotification';

const Script = ({ script, onDelete }) => {
    const apiUrl = process.env.REACT_APP_BACKEND_URL
    const { notifyInfo, notifySuccess, notifyError } = UseNotification();

    const handleDelete = async () => {
        try {
            alert("Do You really want to delete this task?")
            await axios.delete(`${apiUrl}/api/scripts/${script._id}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            onDelete(script._id);
            notifySuccess("Deleted task successfully.")
        } catch (error) {
            console.error('Error deleting script:', error);
            notifyError("Error deleting task, Try again later.");
        }
    };

    return (
        <div>
            <h3>{script.name}</h3>
            <p>{script.content}</p>
            <button onClick={handleDelete} className='transition duration-300'>Delete</button>
        </div>
    );
};

export default Script;

