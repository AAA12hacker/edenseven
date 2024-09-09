import React, { useState } from 'react';
import axios from 'axios';
import UseNotification from '../notify/UseNotification';

const UploadMusic = ({ onNewMusic }) => {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const { notifyInfo, notifySuccess, notifyError } = UseNotification();
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isUploadFormVisible, setIsUploadFormVisible] = useState(true); // Form visibility state

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        const token = localStorage.getItem('token');
        formData.append('title', title);
        formData.append('music', file);
        try {
            const response = await axios.post(`${apiUrl}/api/music`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            notifySuccess('Music uploaded successfully');
            setTitle('');
            setFile(null);

            if (onNewMusic) {
                onNewMusic(response.data); // Call onNewMusic with the new music data
            }
            setIsUploadFormVisible(false);
        } catch (error) {
            console.error('Error uploading music:', error);
            notifyError('Error uploading music, Try again later');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-light-background dark:bg-dark-background p-4 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl mb-4 text-light-heading dark:text-dark-heading">Upload Music</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-light-text dark:text-dark-text mb-2">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        required
                        className="w-full p-2 rounded-md bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border"
                    />
                </div>
                <div>
                    <label className="block text-light-text dark:text-dark-text mb-2">Music File:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="w-full p-2 rounded-md bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border"
                    />
                </div>
                {loading ? (
                    <div className="text-center font-semibold">Loading...</div>
                ) : (
                    <button
                        type="submit"
                        className="w-full bg-light-button1 hover:bg-light-button1h dark:bg-dark-button1 dark:hover:bg-dark-button1h text-light-text dark:text-dark-text font-medium py-2 px-4 rounded-md transition duration-300"
                        >
                            Upload
                        </button>
                    )}
                </form>
            </section>
        );
    };
    
    export default UploadMusic;
