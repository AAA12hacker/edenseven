import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadMusic from '../play/UploadMusic';

const MusicList = ({ onSelect }) => {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const [musicOptions, setMusicOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showUpload, setShowUpload] = useState(false);

    // Fetch music options from the server
    useEffect(() => {
        const fetchMusicOptions = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiUrl}/api/music`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (Array.isArray(response.data)) {
                    setMusicOptions(response.data);
                } else {
                    throw new Error('Unexpected data format');
                }
            } catch (error) {
                setError('Failed to load music options.');
            } finally {
                setLoading(false);
            }
        };

        fetchMusicOptions();
    }, [apiUrl]);

    // Toggle upload component visibility
    const toggleUploadMusic = () => {
        setShowUpload(prevState => !prevState);
    };

    // Handle music selection
    const handleMusicChange = (filePath) => {
        if (onSelect) onSelect(filePath);
    };

    // Handle new music addition
    const handleNewMusic = (newMusic) => {
        setMusicOptions(prevOptions => [...prevOptions, newMusic]);
    };

    // Utility function to truncate long titles
    const truncateTitle = (title) => title.length > 12 ? `${title.substring(0, 12)}...` : title;

    return (
        <section className="bg-light-background dark:bg-dark-background p-4 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4 flex-wrap">
                <h2 className="text-xl text-light-heading dark:text-dark-heading mb-2 md:mb-0">Select Music</h2>
                <button
                    onClick={toggleUploadMusic}
                    className={`flex items-center justify-center px-4 py-2 rounded-3xl transition duration-300 ${
                        showUpload
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-light-button1 hover:bg-light-button1h dark:bg-dark-button1 dark:hover:bg-dark-button1h text-light-text dark:text-dark-text'
                    }`}
                >
                    {showUpload ? 'Hide' : 'Add'}
                </button>
            </div>
            {showUpload && (
                <div className={`mt-4 transition-opacity duration-500 ${showUpload ? 'opacity-100' : 'opacity-0'}`}>
                    <UploadMusic onNewMusic={handleNewMusic} />
                </div>
            )}

            {loading ? (
                <div className="text-center font-semibold">Loading...</div>
            ) : error ? (
                <div className="text-center font-semibold text-red-500">{error}</div>
            ) : (
                <>
                    <div className="flex overflow-x-auto hide-scrollbar space-x-4 mb-4 rounded-3xl">
                        {musicOptions.length > 0 ? (
                            musicOptions.map(music => (
                                <button
                                    key={music._id}
                                    onClick={() => handleMusicChange(music.filePath)}
                                    className="bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-full px-6 py-2 whitespace-nowrap"
                                >
                                    {truncateTitle(music.title)}
                                </button>
                            ))
                        ) : (
                            <div className="text-center font-semibold">No music available</div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

export default MusicList;
