import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      window.ethereum.on("accountsChanged", (accounts) => {
        handleAccount(accounts);
      });
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({method: "eth_accounts"});
      handleAccount(accounts);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }
  
  const getall = async () => {
      if (atm) {
        let tx=await atm.withdrawall();
        await tx.wait();
        getBalance();

      }
  }  
  const custom_withdraw = async () => {
    if (atm) {
      const a = prompt("Enter value ", 0);
      let tx=await atm.withdraw_custom(a);
      await tx.wait();
      getBalance();

    }
  }
  const custom_deposit = async () => {
    if (atm) {
      const a = prompt("Enter value ", 0);
      let tx=await atm.deposit_custom(a);
      await tx.wait();
      getBalance();

    }
  }
  

  
  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
      
      <>
      <button onClick={connectAccount} style={{position:"relative",marginTop:"75px",width:"137px", border:"10px solid black",borderRadius:"17px",zIndex:"2"}}>click to connect your Metamask wallet</button>
        <span style={{display:"block", width:"148px",height:"80px",position:"relative",marginLeft:"443px",marginTop:"-79px",border:"12px solid #1a081b",borderRadius:"18px",backgroundColor:"#1a081b",}}>   </span>
        </>
    
      )}

    if (balance == undefined) {
      getBalance();
    }
    

    return (
      <div style={{ backgroundColor :"black",display:"inline-block", color:"white" ,padding:"9x", border:"2px solid white", borderRadius:"20px",fontSize:"20px",fontStyle:"bold"}}>
       <div style={{ backgroundColor :"hsl(252deg 13% 46% / 40%)",display:"inline-block", color:"aliceblue" ,padding:"20px", border:"2px solid #f9f9f9", borderRadius:"20px",fontSize:"20px",fontStyle:"bold"}}>
        <div >
          <p > Account: {account}</p>
          <p > Balance: {balance}</p>
    
          <button  onClick={deposit}>
            Deposit 1 unit
          </button>
          <button onClick={withdraw}>
            Withdraw 1 unit
          </button>
        </div>
  
        <div>
          
          
  
          <button  onClick={getall}>
            withdraw all amount
          </button>
          <p>
          
          
          </p>
          <button style={{ width: "167px" }} onClick={custom_withdraw}>
            Withdraw custom amount
          </button> &nbsp;&nbsp;
          <button style={{ width: "167px" }} onClick={custom_deposit}>
            deposit custom amount
          </button>
          
        </div>
        </div>
      </div>
    );
    
  }

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1><br></br>Welcome My Friend!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color:black;
          color:white;
          height:712px;
          width:1058px;
          position:relative;
          margin-bottom: 100px;
          margin-top:152px;
          border:2px solid black;
          border-radius:20px;
          margin-left:400px;
          

        }

        h1{
          background-color:black;
          margin-bottom: 200px;
          border:5px solid white;
          display:inline-block;
          padding:5px;
          padding-bottom:20px;
          text-align:center;
          border-radius:20px;
          color:white;


        }
       
        header {
          background: #d6d6d6;
          margin-bottom: -111px;
          border: 2px solid black;
          border-radius:20px;
          height:500px;
      }
      body{


        background-color:black;
      }
        
      `}
      </style>
    </main>
  )
}
