import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faTrash, faEdit, faChevronDown, faChevronUp, faPlay } from '@fortawesome/free-solid-svg-icons';

const ScriptsList = ({ scripts, onEditClick, onDelete, onMarkComplete }) => {
    const [editingScriptId, setEditingScriptId] = useState(null);
    const [expandedTaskIds, setExpandedTaskIds] = useState([]);
    const [activePomodoroTask, setActivePomodoroTask] = useState(null);
    const navigate = useNavigate();

    const handleEditClick = (script) => {
        setEditingScriptId(script._id);
        onEditClick(script);
        navigate(`/edit/${script._id}`);
    };

    const handleCancelClick = () => {
        setEditingScriptId(null);
        onEditClick(null);
    };

    const formatDate = (date) => {
        if (!date) return 'No Date';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const parsedDate = new Date(date);
        return isNaN(parsedDate) ? 'Invalid Date' : parsedDate.toLocaleDateString(undefined, options);
    };

    const todayISO = new Date().toISOString().split('T')[0];

    const todaysTasks = scripts.filter(script => {
        const scheduledISO = new Date(script.scheduledOn).toISOString().split('T')[0];
        return scheduledISO === todayISO && !script.completed;
    });

    const pendingTasks = scripts.filter(script => {
        const scheduledISO = new Date(script.scheduledOn).toISOString().split('T')[0];
        return scheduledISO < todayISO && !script.completed;
    });

    const scheduledTasks = scripts.filter(script => {
        const scheduledISO = new Date(script.scheduledOn).toISOString().split('T')[0];
        return scheduledISO > todayISO && !script.completed;
    });

    const completedTasks = scripts.filter(script => script.completed);

    const handleNewScriptClick = () => {
        navigate('/create');
    };

    const toggleTaskContent = (taskId) => {
        if (expandedTaskIds.includes(taskId)) {
            setExpandedTaskIds(expandedTaskIds.filter(id => id !== taskId));
        } else {
            setExpandedTaskIds([...expandedTaskIds, taskId]);
        }
    };

    const handlePlayClick = (script) => {
        setActivePomodoroTask(script);
        navigate('/pomodoro'); // Navigate to Pomodoro Timer page
    };

    const renderTask = (script, isExpanded) => (
        <div key={script._id} className="flex flex-col mb-4 p-4 bg-light-button2 hover:bg-light-button2h dark:bg-dark-button2 dark:hover:bg-dark-button2h rounded-md shadow-md">
            <div className="flex justify-between items-center">
                <button className="text-blue-500 hover:text-blue-600 transition duration-300 text-xs sm:text-sm md:text-base" onClick={() => handlePlayClick(script)}>
                    <FontAwesomeIcon icon={faPlay} />
                </button>
                <span className='text-xs sm:text-sm md:text-base lg:text-lg'>{script.name} (Scheduled on {formatDate(script.scheduledOn)})</span>
                <div className="flex space-x-1 sm:space-x-2 md:space-x-3">
                    <button className="text-red-500 hover:text-red-600 transition duration-100 text-xs sm:text-sm" onClick={() => onDelete(script._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    {editingScriptId === script._id ? (
                        <button className="text-yellow-500 hover:text-yellow-600 transition duration-100 text-xs sm:text-sm" onClick={handleCancelClick}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    ) : (
                        <button className="text-blue-500 hover:text-blue-600 transition duration-100 text-xs sm:text-sm" onClick={() => handleEditClick(script)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                    )}
                    <button className="text-green-500 hover:text-green-600 transition duration-300 text-xs sm:text-sm" onClick={() => onMarkComplete(script._id)}>
                        <FontAwesomeIcon icon={faSquareCheck} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-600 transition duration-300 text-xs sm:text-sm" onClick={() => toggleTaskContent(script._id)}>
                        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-2 text-xs sm:text-sm md:text-base">
                    <p>{script.content}</p>
                </div>
            )}
        </div>
    );

    const renderCTask = (script, isExpanded) => (
        <div key={script._id} className="flex flex-col mb-4 p-4 bg-light-button2 hover:bg-light-button2h dark:bg-dark-button2 dark:hover:bg-dark-button2h rounded-md shadow-md">
            <div className="flex justify-between items-center">
                <span className='text-xs sm:text-sm md:text-base lg:text-lg'>{script.name} (Completed on {formatDate(script.completionDate)})</span>
                <div className="flex space-x-1 sm:space-x-2 md:space-x-3">
                    <button className="text-red-500 hover:text-red-600 transition duration-100 text-xs sm:text-sm" onClick={() => onDelete(script._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-600 transition duration-300 text-xs sm:text-sm" onClick={() => toggleTaskContent(script._id)}>
                        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-2 text-xs sm:text-sm md:text-base">
                    <p>{script.content}</p>
                </div>
            )}
        </div>
    );

    return (
        <section className="flex justify-center items-center min-h-screen bg-light-background dark:bg-dark-background pt-16 px-4">
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 mt-4 sm:mt-6 mb-4 sm:mb-6  text-light-text dark:text-dark-text w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl border-2 sm:border-4 md:border-4 lg:border-4 border-light-border dark:border-dark-border rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl shadow-md">
                <div className="bg-light-navbg dark:bg-dark-navbg p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl mb-4 sm:mb-6 ">
                    <h3 className="text-lg sm:text-xl  font-semibold mb-2 sm:mb-4  text-light-heading dark:text-dark-heading">Today's Tasks</h3>
                    <div className="overflow-y-auto max-h-[300px] sm:max-h-[350px]  scrollbar-thin scrollbar-thumb-light-button2 scrollbar-track-light-navbg dark:scrollbar-thumb-dark-button2 dark:scrollbar-track-dark-navbg">
                        {todaysTasks.length > 0 ? (
                            todaysTasks.map(script => renderTask(script, expandedTaskIds.includes(script._id)))
                        ) : (
                            <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg">No tasks for today</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleNewScriptClick}
                    className="w-full bg-light-button1 hover:bg-light-button1h dark:bg-dark-button1 dark:hover:bg-dark-button1h text-light-text dark:text-dark-text p-2   rounded-md mt-2  shadow-md text-xs sm:text-sm md:text-base lg:text-lg"
                >
                    Create New Task
                </button>
                <div className="bg-light-navbg dark:bg-dark-navbg p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl mt-4 sm:mt-6 ">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-light-heading dark:text-dark-heading">Pending Tasks</h3>
                    <div className="overflow-y-auto max-h-[300px] sm:max-h-[350px]  scrollbar-thin scrollbar-thumb-light-button2 scrollbar-track-light-navbg dark:scrollbar-thumb-dark-button2 dark:scrollbar-track-dark-navbg">
                        {pendingTasks.length > 0 ? (
                            pendingTasks.map(script => renderTask(script, expandedTaskIds.includes(script._id)))
                        ) : (
                            <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg">No pending tasks</p>
                        )}
                    </div>
                </div>
                <div className="bg-light-navbg dark:bg-dark-navbg p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl mt-4 sm:mt-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-light-heading dark:text-dark-heading">Scheduled Tasks</h3>
                    <div className="overflow-y-auto max-h-[300px] sm:max-h-[350px] scrollbar-thin scrollbar-thumb-light-button2 scrollbar-track-light-navbg dark:scrollbar-thumb-dark-button2 dark:scrollbar-track-dark-navbg">
                        {scheduledTasks.length > 0 ? (
                            scheduledTasks.map(script => renderTask(script, expandedTaskIds.includes(script._id)))
                        ) : (
                            <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg">No scheduled tasks</p>
                        )}
                    </div>
                </div>
                <div className="bg-light-navbg dark:bg-dark-navbg p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl mt-4 sm:mt-6">
                    <h3 className="text-lg sm:text-xl  font-semibold mb-2 sm:mb-4 md:mb-6 lg:mb-8 text-light-heading dark:text-dark-heading">Completed Tasks</h3>
                    <div className="overflow-y-auto max-h-[300px] sm:max-h-[350px]  scrollbar-thin scrollbar-thumb-light-button2 scrollbar-track-light-navbg dark:scrollbar-thumb-dark-button2 dark:scrollbar-track-dark-navbg">
                        {completedTasks.length > 0 ? (
                            completedTasks.map(script => renderCTask(script, expandedTaskIds.includes(script._id)))
                        ) : (
                            <p className="text-center text-xs sm:text-sm md:text-base lg:text-lg">No completed tasks</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ScriptsList;
