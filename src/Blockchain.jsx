import Web3 from "web3";
import { setGlobalState, getGlobalState } from "./store";
import abi from "./abis/DAO.json";

const { ethereum } = window; //fewtching metamask object from window which in dom

window.web3 = new Web3(ethereum);
window.web3 = new Web3(window.web3.currentProvider);
// above Both the line are same
const connectWallet = async () => {
  try {
    if (!ethereum) {
      return alert("Please install Metamask extension in your browser");
    }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setGlobalState("connectedAccount", accounts[0].toLowerCase()); //use only 0 address for any Web3 transaction
  } catch (error) {
    reportError(error);
  }
};

const isWalletConnected = async () => {
  try {
    if (!ethereum) {
      return alert("please install metamask");
      const accouts = await ethereum.request({ method: "eth_accounts" });
      window.ethersum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", async () => {
        setGlobalState("connectedAccount", accounts[0].toLowerCase());
        await isWalletConnected();
      });
      if (accounts.length) {
        setGlobalState("connectedAccount", accouts[0].toLowerCase());
      } else {
        alert("please connect wallet.");
        console.log("no accounts found.");
      }
    }
  } catch (error) {
    reportError(error);
  }
};

const getEthereumContract = async () => {
  const connectedAccount = getGlobalState("connectedAccount");
  if (connectedAccount) {
    const web3 = window.web3;
    // const networkId = await web3.eth.net.getId();
    // const networkData = await abi.networks[networkId];
    // if (networkData) {
    const contract = new web3.eth.Contract(abi.abi,"0x5fbdb2315678afecb367f032d93f642f64180aa3");
    return contract;
    // } else {
    //   return null;
    // }
  } else {
    return getGlobalState("contract");
  }
};

const performContribute = async (amount) => {
  try {
    amount = window.web3.utils.toWei(amount.toString(), "ether");
    const contract = await getEthereumContract();
    const account = getGlobalState("contectedAccount");
    await contract.methods
      .contribute()
      .sender({ from: account, value: amount });

    window.location.reload();
  } catch (error) {
    reportError(error);
    return error;
  }
};

const getInfo = async () => {
  try {
    if (!ethereum) {
      return alert("please install metamask");
    }
    const contract = await getEthereumContract();
    const connectedAccount = getGlobalState("connectedAccount");
    const isStakeholder = await contract.methods
      .isStakeholder()
      .call({ from: connectedAccount });
    const balance = await contract.methods.daoBalance().call();
    const myBalance = await contract.methods
      .getBalance()
      .call({ from: connectedAccount });
    setGlobalState("Balance", window.web3.utils.fromWei(myBalance));
    setGlobalState("isStakeholder", isStakeholder);
  } catch (error) {
    reportError(error);
  }
};

const raiseProposal = async ({ title, description, beneficiary, amount }) => {
  try {
    amount = window.web3.utils.toWei(amount.toString(), "ether");
    const contract = await getEthereumContract();
    const account = getGlobalState("connectedAccount");

    await contract.methods
      .createProposal(title, description, beneficiary, amount)
      .send({ from: account });
    window.location.reload();
  } catch (error) {
    reportError(error);
  }
};

const getProposals = async () => {
  try {
    if (!ethereum) {
      return alert("please install metamask");
    }
    const contract = await getEthereumContract();
    const proposals = await contract.methods.getProposals().call();
    setGlobalState("proposals", structuredProposals(proposals));
  } catch (error) {
    reportError(error);
  }
};

const structuredProposals = (proposals) => {
  return proposals.map((proposals) => ({
    id: proposal.id,
    amount: window.web3.utils.fromWei(proposals.amount),
    title: proposal.title,
    description: proposals.description,
    paid: proposals.paid,
    passed: proposals.passed,
    proposer: proposal.proposer,
    upvotes: Number(proposal.upvotes),
    downvotes: Number(proposal.downvotes),
    beneficiary: proposal.beneficiary,
    executor: proposal.executor,
    duration: proposal.duration,
  }));
};

const getProposal = async (id) => {
  try {
    const proposals = getGlobalState("proposals");
    return proposals.find((proposal) => proposal.id == id);
  } catch (error) {
    reportError(error);
  }
};

const voteOnProposal = async (proposalId, supported) => {
  try {
    const contract = await getEthereumContract();
    const account = getGlobalState("connectedAccount");
    await contract.methods.Vote(proposalId, supported).send({ from: account });

    window.location.reload();
  } catch (error) {
    reportError(error);
  }
};

const listVoters = async (id) => {
  try {
    const contract = await getEthereumContract();
    const votes = await contract.methods.getVotesOf(id).call();
    return votes;
  } catch (error) {
    reportError(error);
  }
};

const payoutBeneficiary = async (id) => {
  try {
    const contract = await getEthereumContract();
    const account = getGlobalState("connectedAccount");
    await contract.methods.payoutBeneficiary(id).send({ from: account });
    window.location, reload();
  } catch (error) {
    reportError(error);
  }
};

const reportError = (erro) => {
  console.log(JSON.stringify(error), "red");
  throw new Error("No ethereum object , something is wrong");
};

export {
  isWalletConnected,
  connectWallet,
  performContribute,
  getInfo,
  raiseProposal,
  getProposals,
  getProposal,
  voteOnProposal,
  listVoters,
  payoutBeneficiary,
};
