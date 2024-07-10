import { ethers } from 'ethers';
import ERC20 from "./ERC20.json" assert { type: 'json' };
import STAKING from "./staking.json" assert { type: 'json' };

let provider = new ethers.providers.JsonRpcProvider("https://rpc.pulsechain.com"); // MAINNET
// let provider = new ethers.providers.JsonRpcProvider("https://pulsechain-testnet.publicnode.com"); // TESTNET

const VDOTokenAddress = "0xb6503f4dB938A6e66e00385116e6cE397f756Bba";
const stakingAddressss = "0xD3CE81f94488a4b7f119b9b223ad85ce39e74968";


export const approveVDOToken = async (signer, amount) => {
    try {
        let erc20Contract = new ethers.Contract(VDOTokenAddress, ERC20.abi, signer);
        let amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        let approve = await erc20Contract.approve(stakingAddressss, amountInWei);
        return approve;
    } catch (error) {
        console.error(`Error in approveVDOToken: ${error}`);
    }
}

// console.log("Approve", await approveVDOToken(signerOwner, 10))


export const stakeVDOToken = async (signer, amount, rewardToken, duration) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddressss, STAKING.abi, signer);
        let amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
        let stake = await stakingContract.stake(amountInWei, rewardToken, duration);
        return stake;
    } catch (error) {
        console.error(`Error in stakeVDOToken: ${error}`);
    }
}


// console.log("Stake Token", await stakeVDOToken(signerOwner, 10, 1, (60*60*24*60)))

export const unStakeVDOToken = async (signer, stakingIndex) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddressss, STAKING.abi, signer);
        let unstake = await stakingContract.unstake(stakingIndex);
        return unstake;
    } catch (error) {
        console.error(`Error in unStakeVDOToken: ${error}`);
    }
}

export const getUserStakingsCount = async (addr) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddressss, STAKING.abi, provider);
        let getUserStakingsCount = await stakingContract.getUserStakingsCount(addr);
        return getUserStakingsCount;
    } catch (error) {
        console.error(`Error in getUserStakingsCount: ${error}`);
    } 
}


export const getAllUserStakings = async (addr) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddressss, STAKING.abi, provider);
        let getAllUserStakings = await stakingContract.getAllUserStakings(addr);
        return getAllUserStakings;
    } catch (error) {
        console.error(`Error in getAllUserStakings: ${error}`);
    } 
}

// let addre = await signerOwner.getAddress()
// console.log("All staking", await getAllUserStakings(addre))

export const allowanceCheaker = async (signer, amount) => {
    try {
        let tokenInstance = new ethers.Contract(VDOTokenAddress, ERC20.abi, signer);
        const addr = await signer.getAddress();
        const allowance = await tokenInstance.allowance(addr, stakingAddressss);
        const allowanceInNumber = ethers.utils.formatUnits(allowance, 'ether');
        console.log("ALLOWANCE IN NUMBERS ", allowanceInNumber)
        if(allowanceInNumber >= amount){
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error in allowanceCheaker: ${error}`);
    } 
}

// console.log("ALLOWANCE CHEAKER", await allowanceCheaker(signerOwner, VDOTokenAddress, 100))


export const getIsLockingEnabled = async () => {
    try {
        let stakingContract = new ethers.Contract(stakingAddressss, STAKING.abi, provider);
        let isEnabled = await stakingContract.isLockingEnabled();
        return isEnabled;
    } catch (error) {
        console.error(`Error in getIsLockingEnabled: ${error}`);
    } 
}

// console.log("IsLock Enabled", await getIsLockingEnabled())

export const toggleLocking = async (signer) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddressss, STAKING.abi, signer);
        let locking = await stakingContract.toggleLocking();
        return locking;
    } catch (error) {
        console.error(`Error in toggleLocking: ${error}`);
    } 
}

// console.log("Toggle Locking", await toggleLocking(signerOwner))