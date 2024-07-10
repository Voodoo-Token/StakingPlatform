import Footer from '../components/Footer';
import Card from '../components/Card';
import CountingTimer from '../components/CountingTimer';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Select from 'react-select';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Web3Provider } from '@ethersproject/providers';
import {
    approveVDOToken,
    stakeVDOToken,
    unStakeVDOToken,
    getAllUserStakings,
    getUserStakingsCount,
    allowanceCheaker,
} from '../Scripting/interaction.mjs'

export default function Home() {
    const [isApproved, setIsApproved] = useState(false);
    const [secondsLeft1, setSecondsLeft1] = useState(0);
    const [secondsLeft2, setSecondsLeft2] = useState(0);
    const [secondsLeft3, setSecondsLeft3] = useState(0);
    const [secondsLeft4, setSecondsLeft4] = useState(0);
    const [secondsLeft5, setSecondsLeft5] = useState(0);
    const [secondsLeft6, setSecondsLeft6] = useState(0);
    const [address, setAddress] = useState('');
    const [signer, setSigner] = useState('');
    const [stakedAmount1, setStakedAmount1] = useState(0);
    const [stakedAmount2, setStakedAmount2] = useState(0);
    const [stakedAmount3, setStakedAmount3] = useState(0);
    const [stakedAmount4, setStakedAmount4] = useState(0);
    const [stakedAmount5, setStakedAmount5] = useState(0);
    const [stakedAmount6, setStakedAmount6] = useState(0);
    const [userStakes, setUserStakes] = useState({
        magicPool1: [],
        magicPool2: [],
        magicPool3: [],
        poisonPool1: [],
        poisonPool2: [],
        poisonPool3: []
    });

    const [selectedStakeIndex, setSelectedStakeIndex] = useState({
        magicPool1: null,
        magicPool2: null,
        magicPool3: null,
        poisonPool1: null,
        poisonPool2: null,
        poisonPool3: null
    });

    const poolMapping = {
        MAGIC: {
            '15': 'magicPool1', // 15% APY for 30 days
            '20': 'magicPool2', // 20% APY for 60 days
            '30': 'magicPool3'  // 30% APY for 120 days
        },
        POISON: {
            '15': 'poisonPool1',
            '20': 'poisonPool2',
            '30': 'poisonPool3'
        }
    };

    const [unstake1, setUnstake1] = useState(0);
    const [unstake2, setUnstake2] = useState(0);
    const [unstake3, setUnstake3] = useState(0);
    const [unstake4, setUnstake4] = useState(0);
    const [unstake5, setUnstake5] = useState(0);
    const [unstake6, setUnstake6] = useState(0);

    const startDate = '2023-08-27T00:00:00';

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    useState('');
    const [web3Modal, setWeb3Modal] = useState(null);
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                rpc: {
                    940: 'https://pulsechain-testnet.publicnode.com'
                }
            },
        },
    };


    useEffect(() => {
        const web3ModalInstance = new Web3Modal({
            network: 'mainnet',
            cacheProvider: false,
            providerOptions,
        });

        setWeb3Modal(web3ModalInstance);
    }, []);

    useEffect(() => {
        const fetchStakings = async () => {
            if (address) {
                try {
                    const stakings = await getAllUserStakings(address);

                    let categorizedStakes = {
                        magicPool1: [],
                        magicPool2: [],
                        magicPool3: [],
                        poisonPool1: [],
                        poisonPool2: [],
                        poisonPool3: []
                    };
                    console.log("=======", stakings)

                    stakings.forEach(stake => {
                        const poolType = stake.rewardType === 0 ? 'MAGIC' : 'POISON'; // Assuming 0 is MAGIC and 1 is POISON based on your enum
                        const pool = poolMapping[poolType][stake.rewardRate.toString()];
                        if (pool) {
                            categorizedStakes[pool].push(stake);
                        }
                    });

                    setUserStakes(categorizedStakes);
                    console.log("=========", categorizedStakes)
                } catch (error) {
                    console.error("Error fetching user stakings:", error);
                }
            }
        };

        fetchStakings();
    }, [address]);




    // ________________ SELECT STATEMENT ________________

    const magicPool1Options = userStakes.magicPool1.map((stake, index) => ({
        value: index,
        label: `${(stake.amount) / 10 ** 18} tokens staked on ${new Date(stake.stakeTime * 1000).toLocaleDateString()}`
    }));

    const magicPool2Options = userStakes.magicPool2.map((stake, index) => ({
        value: index,
        label: `${(stake.amount) / 10 ** 18} tokens staked on ${new Date(stake.stakeTime * 1000).toLocaleDateString()}`
    }));

    const magicPool3Options = userStakes.magicPool3.map((stake, index) => ({
        value: index,
        label: `${(stake.amount) / 10 ** 18} tokens staked on ${new Date(stake.stakeTime * 1000).toLocaleDateString()}`
    }));

    const poisonPool1Options = userStakes.poisonPool1.map((stake, index) => ({
        value: index,
        label: `${(stake.amount) / 10 ** 18} tokens staked on ${new Date(stake.stakeTime * 1000).toLocaleDateString()}`
    }));

    const poisonPool2Options = userStakes.poisonPool2.map((stake, index) => ({
        value: index,
        label: `${(stake.amount) / 10 ** 18} tokens staked on ${new Date(stake.stakeTime * 1000).toLocaleDateString()}`
    }));

    const poisonPool3Options = userStakes.poisonPool3.map((stake, index) => ({
        value: index,
        label: `${(stake.amount) / 10 ** 18} tokens staked on ${new Date(stake.stakeTime * 1000).toLocaleDateString()}`
    }));

    // ____________________________________________________




    async function connectWallet() {
        // web3Modal.clearCachedProvider();
        if (!web3Modal) {
            console.error('Web3Modal is not initialized yet');
            return;
        }
        try {
            const provider = await web3Modal.connect();
            const web3Provider = new Web3Provider(provider);
            const signer = web3Provider.getSigner();
            setSigner(signer);
            const connectedAddress = await signer.getAddress();
            setAddress(connectedAddress);
        } catch (error) {
            console.error('Error connecting to the wallet:', error);
            alert('Failed to connect to the wallet. Please try again.');
        }
    }

    const formatWalletAddress = (address) => {
        if (!address) return "";
        return address.slice(0, 6) + "..." + address.slice(-4);
    };

    // APPROVE FUNCTION
    const handleApprove = async (amount) => {
        // console.log(amount)
        await approveVDOToken(signer, amount);
        setIsApproved(true);
    };



    // ---------------------------------------- STAKING FUNCTIONS MAGIC
    const magicNumber = 0;
    const poisonNumber = 1;
    const time_one = 2592000;
    const time_two = 5184000;
    const time_three = 10368000;

    // 30 days Magic
    const handleStakeM1 = async (amount) => {
        try {
            const val = await allowanceCheaker(signer, amount);

            if (!val) {
                alert("Insufficient Approved Tokens");
                return; // Exit the function early
            }

            await stakeVDOToken(signer, amount, magicNumber, time_one);
        } catch (err) {
            console.log(err);
        }
    };


    // 60 days Magic
    const handleStakeM2 = async (amount) => {
        try {
            const val = await allowanceCheaker(signer, amount);

            if (!val) {
                alert("Insufficient Approved Tokens");
                return; // Exit the function early
            }

            await stakeVDOToken(signer, amount, magicNumber, time_two)
        } catch (err) { console.log(err) }
    };

    // 120 days Magic
    const handleStakeM3 = async (amount) => {
        try {
            const val = await allowanceCheaker(signer, amount);

            if (!val) {
                alert("Insufficient Approved Tokens");
                return; // Exit the function early
            }

            await stakeVDOToken(signer, amount, magicNumber, time_three)
        } catch (err) { console.log(err) }
    };

    // STAKING FUNCTIONS MAGIC
    // 30 days Poison
    const handleStakeP1 = async (amount) => {
        try {
            const val = await allowanceCheaker(signer, amount);

            if (!val) {
                alert("Insufficient Approved Tokens");
                return; // Exit the function early
            }

            await stakeVDOToken(signer, amount, poisonNumber, time_one)
        } catch (err) { console.log(err) }
    };

    // 60 days Poison
    const handleStakeP2 = async (amount) => {
        try {
            const val = await allowanceCheaker(signer, amount);

            if (!val) {
                alert("Insufficient Approved Tokens");
                return; // Exit the function early
            }

            await stakeVDOToken(signer, amount, poisonNumber, time_two)
        } catch (err) { console.log(err) }
    };

    // 120 days Poison
    const handleStakeP3 = async (amount) => {
        try {
            const val = await allowanceCheaker(signer, amount);

            if (!val) {
                alert("Insufficient Approved Tokens");
                return; // Exit the function early
            }

            await stakeVDOToken(signer, amount, poisonNumber, time_three)
        } catch (err) { console.log(err) }
    };



    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


    // ________________________ UNSTAKE __________________________

    const handleUnstake = async (index, seconds) => {
        // const selectedIndex = selectedStakeIndex[pool];
        if (index !== null) {
            try {

                if (seconds > 0) {
                    alert("Unstaking before time will cause a 20% reduction in your Voodoo tokens and also provide no reward");
                }

                console.log(",,,,,,", index)
                await unStakeVDOToken(signer, index); // Convert BigNumber to string

            } catch (error) {
                console.error("Error unstaking:", error);
            }
        }
    };




    // TIMER USEEFFECT
    const stateSetters = [setSecondsLeft1, setSecondsLeft2, setSecondsLeft3, setSecondsLeft4, setSecondsLeft5, setSecondsLeft6];

    useEffect(() => {
        const intervals = stateSetters.map((setter) => {
            return setInterval(() => {
                setter((prevSeconds) => {
                    if (prevSeconds > 0) {
                        return prevSeconds - 1;
                    }
                    return 0;
                });
            }, 1000);
        });

        return () => {
            intervals.forEach(interval => clearInterval(interval));
        };
    }, []);




    // ---------------------------------TIMER ------------------------------------

    const formatTimeM1 = (seconds) => {
        if (selectedStakeIndex.magicPool1 === null || seconds <= 0) {
            return "0d 0h 0m 0s";
        }

        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };


    const formatTimeM2 = (seconds) => {
        if (selectedStakeIndex.magicPool2 === null || seconds <= 0) {
            return "0d 0h 0m 0s";
        }

        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    const formatTimeM3 = (seconds) => {
        if (selectedStakeIndex.magicPool3 === null || seconds <= 0) {
            return "0d 0h 0m 0s";
        }

        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    const formatTimeM4 = (seconds) => {
        if (selectedStakeIndex.poisonPool1 === null || seconds <= 0) {
            return "0d 0h 0m 0s";
        }

        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    const formatTimeM5 = (seconds) => {
        if (selectedStakeIndex.poisonPool2 === null || seconds <= 0) {
            return "0d 0h 0m 0s";
        }

        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    const formatTimeM6 = (seconds) => {
        if (selectedStakeIndex.poisonPool3 === null || seconds <= 0) {
            return "0d 0h 0m 0s";
        }

        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    // ------------------------------------------------------------------------------------------------




    return (
        <div className="min-h-screen flex flex-col font-hk-grotesk-wide">
            <nav className="flex items-center p-4 shadow-md bg-white">
                <div className="flex items-center flex-grow pl-4">
                    <a href="https://voodootoken.com/staking-quide/" target="_blank" rel="noopener noreferrer">
                        <Image src="/2.png" alt="Logo" width={40} height={40} className="mr-4" />
                    </a>
                </div>

                <div className="flex-shrink-0 flex justify-end pr-0">
                    {address ? (
                        <span className="text-black ml-auto mr-4">{formatWalletAddress(address)}</span>
                    ) : (
                        <button
                            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded ml-auto mr-4"
                            onClick={connectWallet}
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </nav>

            <div class="flex justify-center mt-4 mb-1">
                <img src="./icons.png" alt="icons" class="w-64 h-auto" />
            </div>





            
            <CountingTimer startDate={startDate} />;

            <main className="flex-grow p-4 mx-4 md:mx-16">
                <br />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>




                        {/*................. MAGIC POOL 1 ....................*/}
                        <div className="text-center mb-4">
                            <img src="/magic-reward-token.png" alt="Poison Logo" className="mx-auto mb-2 w-32 h-32" />
                            <h2 className="text-lg font-medium text-white">Pool 1</h2>
                        </div>
                        <Card
                            stakeContent={
                                <div className="text-black space-y-4">
                                    <label htmlFor="stakedAmount1" className="mt-7 block text-lg font-medium">Staked Token Amount</label>
                                    <input
                                        type="number"
                                        id="stakedAmount1"
                                        min="0"
                                        value={stakedAmount1}
                                        onChange={(e) => setStakedAmount1(e.target.value)}
                                        className="p-2 rounded bg-slate-300 text-black w-full"
                                    />


                                    <div className="mt-7 flex justify-between">
                                        <span>ROI</span>
                                        <span>15% APY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>LOCK</span>
                                        <span>30 Days</span>
                                    </div>
                                    <br /> <br />
                                    <div className="flex space-x-4 mt-6">
                                        <button onClick={() => handleApprove(stakedAmount1)} disabled={!address} className="flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 transition duration-300 ease-in-out text-white">Approve</button>
                                        <button onClick={() => handleStakeM1(stakedAmount1)} disabled={!address} className={`flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 text-white transition duration-300 ease-in-out`}>Stake</button>
                                    </div>
                                </div>
                            }
                            index
                            rewardContent={
                                <div className="text-black flex flex-col items-center justify-center space-y-4">
                                    <div>
                                        <span className="block text-lg font-medium">Unlocks in:</span>
                                        <span className="block text-lg">{formatTimeM1(secondsLeft1)}</span>
                                    </div>
                                    <Select
                                        options={magicPool1Options}
                                        className="w-full mb-4"
                                        placeholder="Select a stake to unstake..."
                                        onChange={(selectedOption) => {
                                            setSelectedStakeIndex(prevState => ({ ...prevState, magicPool1: selectedOption.value }));

                                            const currentTime = Math.floor(Date.now() / 1000);
                                            const stakeTime = userStakes.magicPool1[selectedOption.value].stakeTime.toNumber();
                                            const lockDuration = userStakes.magicPool1[selectedOption.value].lockDuration.toNumber();
                                            const remainingTime = lockDuration - (currentTime - stakeTime);

                                            setSecondsLeft1(remainingTime);
                                            console.log("........", userStakes.magicPool1[selectedOption.value].id.toNumber());
                                            const val = userStakes.magicPool1[selectedOption.value].id.toNumber();
                                            setUnstake1(val);
                                        }}
                                    />
                                    <button
                                        disabled={!address || selectedStakeIndex.magicPool1 === null}
                                        onClick={() => handleUnstake(unstake1, secondsLeft1)}
                                        className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out w-full">
                                        Unstake
                                    </button>

                                    <p className="text-xs mt-2 text-center">Unstaking after the specified time will also transfer generated rewards to the wallet.</p>
                                </div>
                            }


                        />
                    </div>




                    <div>
                        {/*................. MAGIC POOL 2 ....................*/}
                        <div className="text-center mb-4">
                            <img src="/magic-reward-token.png" alt="Poison Logo" className="mx-auto mb-2 w-32 h-32" />
                            <h2 className="text-lg font-medium text-white">Pool 2</h2>
                        </div>
                        <Card
                            stakeContent={
                                <div className="text-black space-y-4">
                                    <label htmlFor="stakedAmount2" className="mt-7 block text-lg font-medium">Staked Token Amount</label>
                                    <input
                                        type="number"
                                        id="stakedAmount2"
                                        min="0"
                                        value={stakedAmount2}
                                        onChange={(e) => setStakedAmount2(e.target.value)}
                                        className="p-2 rounded bg-slate-300 text-black w-full"
                                    />

                                    <div className="mt-7 flex justify-between">
                                        <span>ROI</span>
                                        <span>20% APY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>LOCK</span>
                                        <span>60 Days</span>
                                    </div>
                                    <br /> <br />
                                    <div className="flex space-x-4 mt-6">
                                        <button onClick={() => handleApprove(stakedAmount2)} disabled={!address} className="flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 transition duration-300 ease-in-out text-white">Approve</button>
                                        <button onClick={() => handleStakeM2(stakedAmount2)} disabled={!address} className={`flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 text-white transition duration-300 ease-in-out`}>Stake</button>
                                    </div>
                                </div>
                            }

                            rewardContent={
                                <div className="text-black flex flex-col items-center justify-center space-y-4">
                                    <div>
                                        <span className="block text-lg font-medium">Unlocks in:</span>
                                        <span className="block text-lg">{formatTimeM2(secondsLeft2)}</span>
                                    </div>
                                    <Select
                                        options={magicPool2Options}
                                        className="w-full mb-4"
                                        placeholder="Select a stake to unstake..."
                                        onChange={(selectedOption) => {
                                            setSelectedStakeIndex(prevState => ({ ...prevState, magicPool2: selectedOption.value }));

                                            const currentTime = Math.floor(Date.now() / 1000);
                                            const stakeTime = userStakes.magicPool2[selectedOption.value].stakeTime.toNumber();
                                            const lockDuration = userStakes.magicPool2[selectedOption.value].lockDuration.toNumber();
                                            const remainingTime = lockDuration - (currentTime - stakeTime);

                                            setSecondsLeft2(remainingTime);

                                            const val = userStakes.magicPool2[selectedOption.value].id.toNumber();
                                            setUnstake2(val);
                                        }}
                                    />
                                    <button
                                        disabled={!address || selectedStakeIndex.magicPool2 === null}
                                        onClick={() => handleUnstake(unstake2, secondsLeft2)}
                                        className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out w-full">
                                        Unstake
                                    </button>

                                    <p className="text-xs mt-2 text-center">Unstaking after the specified time will also transfer generated rewards to the wallet.</p>
                                </div>
                            }


                        />
                    </div>




                    <div>
                        {/*................. MAGIC POOL 3 ....................*/}
                        <div className="text-center mb-4">
                            <img src="/magic-reward-token.png" alt="Poison Logo" className="mx-auto mb-2 w-32 h-32" />
                            <h2 className="text-lg font-medium text-white">Pool 3</h2>
                        </div>
                        <Card
                            stakeContent={
                                <div className="text-black space-y-4">
                                    <label htmlFor="stakedAmount3" className="mt-7 block text-lg font-medium">Staked Token Amount</label>
                                    <input
                                        type="number"
                                        id="stakedAmount3"
                                        min="0"
                                        value={stakedAmount3}
                                        onChange={(e) => setStakedAmount3(e.target.value)}
                                        className="p-2 rounded bg-slate-300 text-black w-full"
                                    />

                                    <div className="mt-7 flex justify-between">
                                        <span>ROI</span>
                                        <span>30% APY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>LOCK</span>
                                        <span>120 Days</span>
                                    </div>
                                    <br /> <br />
                                    <div className="flex space-x-4 mt-6">
                                        <button onClick={() => handleApprove(stakedAmount3)} disabled={!address} className="flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 transition duration-300 ease-in-out text-white">Approve</button>
                                        <button onClick={() => handleStakeM3(stakedAmount3)} disabled={!address} className={`flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 text-white transition duration-300 ease-in-out`}>Stake</button>
                                    </div>
                                </div>
                            }

                            rewardContent={
                                <div className="text-black flex flex-col items-center justify-center space-y-4">
                                    <div>
                                        <span className="block text-lg font-medium">Unlocks in:</span>
                                        <span className="block text-lg">{formatTimeM3(secondsLeft3)}</span>
                                    </div>
                                    <Select
                                        options={magicPool3Options}
                                        className="w-full mb-4"
                                        placeholder="Select a stake to unstake..."
                                        onChange={(selectedOption) => {
                                            setSelectedStakeIndex(prevState => ({ ...prevState, magicPool3: selectedOption.value }));

                                            const currentTime = Math.floor(Date.now() / 1000);
                                            const stakeTime = userStakes.magicPool3[selectedOption.value].stakeTime.toNumber();
                                            const lockDuration = userStakes.magicPool3[selectedOption.value].lockDuration.toNumber();
                                            const remainingTime = lockDuration - (currentTime - stakeTime);

                                            setSecondsLeft3(remainingTime);
                                            const val = userStakes.magicPool3[selectedOption.value].id.toNumber();
                                            setUnstake3(val);
                                        }}
                                    />
                                    <button
                                        disabled={!address || selectedStakeIndex.magicPool3 === null}
                                        onClick={() => handleUnstake(unstake3, secondsLeft3)}
                                        className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out w-full">
                                        Unstake
                                    </button>

                                    <p className="text-xs mt-2 text-center">Unstaking after the specified time will also transfer generated rewards to the wallet.</p>
                                </div>
                            }

                        />
                    </div>
                </div>

                <br /> <br />




                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        {/*................. POISON POOL 1 ....................*/}
                        <div className="text-center mb-4">
                            <img src="/poison-reward-token.png" alt="Poison Logo" className="mx-auto mb-2 w-32 h-32" />
                            <h2 className="text-lg font-medium text-white">Pool 4</h2>
                        </div>
                        <Card
                            stakeContent={
                                <div className="text-black space-y-4">
                                    <label htmlFor="stakedAmount4" className="mt-7 block text-lg font-medium">Staked Token Amount</label>
                                    <input
                                        type="number"
                                        id="stakedAmount4"
                                        min="0"
                                        value={stakedAmount4}
                                        onChange={(e) => setStakedAmount4(e.target.value)}
                                        className="p-2 rounded bg-slate-300 text-black w-full"
                                    />

                                    <div className="mt-7 flex justify-between">
                                        <span>ROI</span>
                                        <span>15% APY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>LOCK</span>
                                        <span>30 Days</span>
                                    </div>
                                    <br /> <br />
                                    <div className="flex space-x-4 mt-6">
                                        <button onClick={() => handleApprove(stakedAmount4)} disabled={!address} className="flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 transition duration-300 ease-in-out text-white">Approve</button>
                                        <button onClick={() => handleStakeP1(stakedAmount4)} disabled={!address} className={`flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 text-white transition duration-300 ease-in-out`}>Stake</button>
                                    </div>
                                </div>
                            }

                            rewardContent={
                                <div className="text-black flex flex-col items-center justify-center space-y-4">
                                    <div>
                                        <span className="block text-lg font-medium">Unlocks in:</span>
                                        <span className="block text-lg">{formatTimeM4(secondsLeft4)}</span>
                                    </div>
                                    <Select
                                        options={poisonPool1Options}
                                        className="w-full mb-4"
                                        placeholder="Select a stake to unstake..."
                                        onChange={(selectedOption) => {
                                            setSelectedStakeIndex(prevState => ({ ...prevState, poisonPool1: selectedOption.value }));

                                            const currentTime = Math.floor(Date.now() / 1000);
                                            const stakeTime = userStakes.poisonPool1[selectedOption.value].stakeTime.toNumber();
                                            const lockDuration = userStakes.poisonPool1[selectedOption.value].lockDuration.toNumber();
                                            const remainingTime = lockDuration - (currentTime - stakeTime);

                                            setSecondsLeft4(remainingTime);
                                            const val = userStakes.poisonPool1[selectedOption.value].id.toNumber();
                                            setUnstake4(val);
                                        }}
                                    />
                                    <button
                                        disabled={!address || selectedStakeIndex.poisonPool1 === null}
                                        onClick={() => handleUnstake(unstake4, secondsLeft4)}
                                        className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out w-full">
                                        Unstake
                                    </button>
                                    <p className="text-xs mt-2 text-center">Unstaking after the specified time will also transfer generated rewards to the wallet.</p>
                                </div>
                            }

                        />
                    </div>




                    <div>
                        {/*................. POISON POOL 2 ....................*/}

                        <div className="text-center mb-4">
                            <img src="/poison-reward-token.png" alt="Poison Logo" className="mx-auto mb-2 w-32 h-32" />
                            <h2 className="text-lg font-medium text-white">Pool 5</h2>
                        </div>

                        <Card
                            stakeContent={
                                <div className="text-black space-y-4">
                                    <label htmlFor="stakedAmount5" className="mt-7 block text-lg font-medium">Staked Token Amount</label>
                                    <input
                                        type="number"
                                        id="stakedAmount5"
                                        min="0"
                                        value={stakedAmount5}
                                        onChange={(e) => setStakedAmount5(e.target.value)}
                                        className="p-2 rounded bg-slate-300 text-black w-full"
                                    />

                                    <div className="mt-7 flex justify-between">
                                        <span>ROI</span>
                                        <span>20% APY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>LOCK</span>
                                        <span>60 Days</span>
                                    </div>
                                    <br /> <br />
                                    <div className="flex space-x-4 mt-6">
                                        <button onClick={() => handleApprove(stakedAmount5)} disabled={!address} className="flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 transition duration-300 ease-in-out text-white">Approve</button>
                                        <button onClick={() => handleStakeP2(stakedAmount5)} disabled={!address} className={`flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 text-white transition duration-300 ease-in-out`}>Stake</button>
                                    </div>
                                </div>
                            }

                            rewardContent={
                                <div className="text-black flex flex-col items-center justify-center space-y-4">
                                    <div>
                                        <span className="block text-lg font-medium">Unlocks in:</span>
                                        <span className="block text-lg">{formatTimeM5(secondsLeft5)}</span>
                                    </div>
                                    <Select
                                        options={poisonPool2Options}
                                        className="w-full mb-4"
                                        placeholder="Select a stake to unstake..."
                                        onChange={(selectedOption) => {
                                            setSelectedStakeIndex(prevState => ({ ...prevState, poisonPool2: selectedOption.value }));

                                            const currentTime = Math.floor(Date.now() / 1000);
                                            const stakeTime = userStakes.poisonPool2[selectedOption.value].stakeTime.toNumber();
                                            const lockDuration = userStakes.poisonPool2[selectedOption.value].lockDuration.toNumber();
                                            const remainingTime = lockDuration - (currentTime - stakeTime);

                                            setSecondsLeft5(remainingTime);
                                            const val = userStakes.poisonPool2[selectedOption.value].id.toNumber();
                                            setUnstake5(val);
                                        }}
                                    />
                                    <button
                                        disabled={!address || selectedStakeIndex.poisonPool2 === null}
                                        onClick={() => handleUnstake(unstake5, secondsLeft5)}
                                        className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out w-full">
                                        Unstake
                                    </button><p className="text-xs mt-2 text-center">Unstaking after the specified time will also transfer generated rewards to the wallet.</p>
                                </div>
                            }

                        />
                    </div>



                    <div>
                        {/*................. POISON POOL 3 ....................*/}

                        <div className="text-center mb-4">
                            <img src="/poison-reward-token.png" alt="Poison Logo" className="mx-auto mb-2 w-32 h-32" />
                            <h2 className="text-lg font-medium text-white">Pool 6</h2>
                        </div>
                        <Card
                            stakeContent={
                                <div className="text-black space-y-4">
                                    <label htmlFor="stakedAmount6" className="mt-7 block text-lg font-medium">Staked Token Amount</label>
                                    <input
                                        type="number"
                                        id="stakedAmount6"
                                        min="0"
                                        value={stakedAmount6}
                                        onChange={(e) => setStakedAmount6(e.target.value)}
                                        className="p-2 rounded bg-slate-300 text-black w-full"
                                    />

                                    <div className="mt-7 flex justify-between">
                                        <span>ROI</span>
                                        <span>30% APY</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>LOCK</span>
                                        <span>120 Days</span>
                                    </div>
                                    <br /> <br />
                                    <div className="flex space-x-4 mt-6">
                                        <button onClick={() => handleApprove(stakedAmount6)} disabled={!address} className="flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 transition duration-300 ease-in-out text-white">Approve</button>
                                        <button onClick={() => handleStakeP3(stakedAmount6)} disabled={!address} className={`flex-grow px-4 py-2 rounded bg-blue-800 hover:bg-blue-700 text-white transition duration-300 ease-in-out`}>Stake</button>
                                    </div>
                                </div>
                            }

                            rewardContent={
                                <div className="text-black flex flex-col items-center justify-center space-y-4">
                                    <div>
                                        <span className="block text-lg font-medium">Unlocks in:</span>
                                        <span className="block text-lg">{formatTimeM6(secondsLeft6)}</span>
                                    </div>
                                    <Select
                                        options={poisonPool3Options}
                                        className="w-full mb-4"
                                        placeholder="Select a stake to unstake..."
                                        onChange={(selectedOption) => {
                                            setSelectedStakeIndex(prevState => ({ ...prevState, poisonPool3: selectedOption.value }));

                                            const currentTime = Math.floor(Date.now() / 1000);
                                            const stakeTime = userStakes.poisonPool3[selectedOption.value].stakeTime.toNumber();
                                            const lockDuration = userStakes.poisonPool3[selectedOption.value].lockDuration.toNumber();
                                            const remainingTime = lockDuration - (currentTime - stakeTime);

                                            setSecondsLeft6(remainingTime);
                                            const val = userStakes.poisonPool3[selectedOption.value].id.toNumber();
                                            setUnstake6(val);
                                        }}
                                    />
                                    <button
                                        disabled={!address || selectedStakeIndex.poisonPool3 === null}
                                        onClick={() => handleUnstake(unstake6, secondsLeft6)}
                                        className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-300 ease-in-out w-full">
                                        Unstake
                                    </button>
                                    <p className="text-xs mt-2 text-center">Unstaking after the specified time will also transfer generated rewards to the wallet.</p>
                                </div>
                            }

                        />
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
