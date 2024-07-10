import { useState } from 'react';

function Card({ stakeContent, rewardContent }) {
    const [activeTab, setActiveTab] = useState('stake');

    return (
        <div className="border rounded p-4 h-[25rem] bg-gradient-to-r bg-white">
            <div className="flex justify-between border-b pb-2 mb-2">
                <button
                    onClick={() => setActiveTab('stake')}
                    className={`flex-grow text-white mr-2 px-4 py-2 rounded transition duration-300 ease-in-out ${activeTab === 'stake' ? 'bg-blue-800 text-black hover:bg-blue-700' : 'bg-gray-700 text-black hover:bg-gray-600'}`}
                >
                    Stake
                </button>
                <button
                    onClick={() => setActiveTab('reward')}
                    className={`flex-grow ml-2 px-4 py-2 text-white rounded transition duration-300 ease-in-out ${activeTab === 'reward' ? 'bg-blue-800 text-black hover:bg-blue-700' : 'bg-gray-700 text-black hover:bg-gray-600'}`}
                >
                    Reward
                </button>

            </div>
            {activeTab === 'stake' ? stakeContent : rewardContent}
        </div>
    );
}

export default Card;
