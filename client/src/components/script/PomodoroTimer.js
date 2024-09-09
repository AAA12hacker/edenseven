import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MusicList from '../play/MusicList';
import './ScrollbarHid.css';
import './transition.css';

const PomodoroTimer = () => {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const [time, setTime] = useState(300); // Time in seconds (25 minutes)
    const [isRunning, setIsRunning] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState('');
    const [selectedTime, setSelectedTime] = useState(25); // Time in minutes

    const audioRef = useRef(null);

    useEffect(() => {
        setTime(selectedTime * 60); // Update the time when selectedTime changes
    }, [selectedTime]);

    useEffect(() => {
        let interval = null;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            clearInterval(interval);
            alert('Time is up!');
            if (audioRef.current) {
                audioRef.current.play();
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, time]);

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(selectedTime * 60);
    };

    const handleMusicSelect = (filePath) => {
        const baseUrl = `${apiUrl}/api/music/files/`;
        const selectedUrl = `${baseUrl}${filePath}`;
        console.log('Selected music URL:', selectedUrl);
        setSelectedMusic(selectedUrl);
        if (audioRef.current) {
            audioRef.current.src = selectedUrl;
            audioRef.current.play();
        }
    };

    const handleTimeSelect = (minutes) => {
        setSelectedTime(minutes);
        setTime(minutes * 60);
    };

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const percentage = (time / (selectedTime * 60)) * 100;

    return (
        <section className="flex flex-col justify-center items-center min-h-screen bg-light-background dark:bg-dark-background py-4 sm:px-4 pt-20 px-4">
            <div className="p-4 sm:p-6 md:p-8 bg-light-background dark:bg-dark-background w-full max-w-lg border-4 border-light-border dark:border-dark-border rounded-3xl shadow-lg">
                <div className='overflow-y-auto max-h-80vh bg-light-navbg dark:bg-dark-navbg p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-light-button2 scrollbar-track-light-navbg dark:scrollbar-thumb-dark-button2 dark:scrollbar-track-dark-navbg rounded-xl shadow-md'>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 text-light-heading dark:text-dark-heading">Pomodoro Timer</h1>
                    <div className="relative mb-4 sm:mb-6">
                        <CircularProgressbar
                            value={percentage}
                            text={`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
                            styles={buildStyles({
                                textColor: '#4a4a4a',
                                pathColor: '#4a4a4a',
                                trailColor: '#e0e0e0',
                            })}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                        <button
                            onClick={handleStartPause}
                            className={`px-4 py-2 rounded-full text-light-text dark:text-dark-text ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-light-button1 hover:bg-light-button1h dark:bg-dark-button1 hover:dark:bg-dark-button1h'} transition duration-300`}
                        >
                            {isRunning ? 'Pause' : 'Start'}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 rounded-full bg-light-button2 hover:bg-light-button2h dark:bg-dark-button2 hover:dark:bg-dark-button2h text-light-text dark:text-dark-text transition duration-300"
                        >
                            Reset
                        </button>
                    </div>
                    <div className="mb-4 sm:mb-6">
                        <label htmlFor="timeSelect" className="block text-light-text dark:text-dark-text mb-2">Select Duration:</label>
                        <select
                            id="timeSelect"
                            value={selectedTime}
                            onChange={(e) => handleTimeSelect(Number(e.target.value))}
                            className="w-full bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-2 rounded-lg border border-light-border dark:border-dark-border"
                        >
                            {[5, 10, 15, 20, 25, 30, 45, 60].map(minutes => (
                                <option key={minutes} value={minutes}>{minutes} minutes</option>
                            ))}
                        </select>
                    </div>
                    <MusicList onSelect={handleMusicSelect} />
                    {selectedMusic && (
                        <audio ref={audioRef} src={selectedMusic} preload="auto" />
                    )}
                </div>
            </div>
        </section>
    );
};

export default PomodoroTimer;
