const { Keypair, Transaction, Connection, clusterApiUrl, SystemProgram, sendAndConfirmTransaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const jsonFile = require('jsonfile');
const command = process.argv.slice(2) // Get command-line arguments excluding node & filename

const createWallet = async () => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const wallet = Keypair.generate();
        // After generating, get balance and export wallet info as JSON
        const walletBalance = await connection.getBalance(wallet.publicKey);
        jsonFile.writeFile('wallet.json', {
            publicKey: wallet.publicKey.toBase58(),
            secretKey: wallet.secretKey,
            walletBalance: walletBalance
        }, {spaces: 2, EOL: '\r\n'});
    } catch (err) {
        console.error(err);
    }
};

const airdropSol = async (amount = 1) => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const wallet = jsonFile.readFileSync('wallet.json');
        // Airdrop the amount & check the latest blockhash
        const requestAirdrop = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL * amount);
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: requestAirdrop,
        });
    } catch (err) {
        console.error(err);
    }
}

const checkBalance = async () => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const wallet = jsonFile.readFileSync('wallet.json');
        // Check the balance of wallet
        const walletBalance = await connection.getBalance(wallet.publicKey);
        console.log("Balance: " + walletBalance);
    } catch (err) {
        console.error(err);
    }
}

const transferSol = async (target, amount) => {
    try {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const wallet = jsonFile.readFileSync('wallet.json');
        // Build the body of object Transaction...
        const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubKey: wallet.publicKey,
            toPubKey: target.publicKey,
            lamports: LAMPORTS_PER_SOL * amount,
        }),
        );
        // ...and perform the transaction
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet],
        );
    } catch (err) {
        console.error(err);
    }
}

// Call functions based on command-line arguments
switch(command[0]) {
    case 'new':
        createWallet();
        break;
    case 'airdrop':
        airdropSol(command[1]);
        break;
    case 'balance':
        checkBalance();
        break;
    case 'transfer':
        transferSol(command[1], command[2]); // Take otherPublicKey as argument 1 & Amount as argument 2
        break;
    default:
        console.log('Unrecognized command, please try again.');
        break;
} 
