import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UseNotification from '../notify/UseNotification';

const ScriptForm = ({ onSubmit }) => {
    const { notifyInfo, notifySuccess, notifyError } = UseNotification();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [scheduledOn, setScheduledOn] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const scriptData = { name, content, scheduledOn: scheduledOn || new Date().toISOString() };
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${apiUrl}/api/scripts`, scriptData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSubmit(response.data);
            setName('');
            setContent('');
            notifySuccess("Added task successfully.");
        } catch (error) {
            console.error('Error creating script:', error);
            notifyError("Error creating task, Try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <section className="flex justify-center items-center min-h-screen bg-light-background dark:bg-dark-background pt-16 px-4">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background w-full max-w-lg border-2 border-light-border dark:border-dark-border rounded-3xl shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-light-heading dark:text-dark-heading">Create New Task</h2>
                
                <div className="mb-4 sm:mb-6">
                    <input 
                        type="text" 
                        placeholder='Task name'
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="w-full p-2 rounded-md bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border"
                    />
                </div>
                
                <div className="mb-4 sm:mb-6">
                    <textarea 
                        value={content} placeholder='Content'
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                        className="w-full p-2 rounded-md bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border"
                    ></textarea>
                </div>
                
                <div className="mb-4 sm:mb-6">
                    <input 
                        type="date" 
                        value={scheduledOn} 
                        onChange={(e) => setScheduledOn(e.target.value)} 
                        className="w-full p-2 rounded-md bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border"
                    />
                </div>

                {loading ? (
                    <div className="text-center font-semibold">Loading...</div>
                ) : (
                    <div className="flex flex-col sm:flex-row justify-between">
                        <button 
                            type="submit" 
                            className="w-full sm:w-1/2 mb-2 sm:mb-0 sm:mr-2 py-2 bg-light-button1 hover:bg-light-button1h dark:bg-dark-button1 dark:hover:bg-dark-button1h text-light-text dark:text-dark-text font-medium rounded-md transition duration-300"
                        >
                            Create Task
                        </button>
                        <button 
                            type="button" 
                            onClick={handleCancel} 
                            className="w-full sm:w-1/2 mt-2 sm:mt-0 sm:ml-2 py-2 bg-light-button2 hover:bg-light-button2h dark:bg-dark-button2 dark:hover:bg-dark-button2h border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium rounded-md transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
};

export default ScriptForm;
