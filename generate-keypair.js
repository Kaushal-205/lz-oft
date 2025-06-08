const { Keypair } = require('@solana/web3.js');
const fs = require('fs');

// Function to decode base58 manually using a simple implementation
function base58Decode(str) {
    const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const base = alphabet.length;
    let decoded = 0n;
    let multi = 1n;
    
    for (let i = str.length - 1; i >= 0; i--) {
        const char = str[i];
        const index = alphabet.indexOf(char);
        if (index === -1) throw new Error('Invalid base58 character');
        decoded += BigInt(index) * multi;
        multi *= BigInt(base);
    }
    
    // Convert to byte array
    const bytes = [];
    while (decoded > 0n) {
        bytes.unshift(Number(decoded % 256n));
        decoded = decoded / 256n;
    }
    
    // Handle leading zeros
    for (let i = 0; i < str.length && str[i] === '1'; i++) {
        bytes.unshift(0);
    }
    
    return new Uint8Array(bytes);
}

// Function to generate keypair from Phantom private key
function generateKeypairFromPhantomPrivateKey(privateKeyString) {
    try {
        // Validate input
        if (!privateKeyString || typeof privateKeyString !== 'string') {
            throw new Error('Private key string is required and must be a string');
        }

        // Decode the base58 private key
        const decodedKey = base58Decode(privateKeyString);
        
        // Create keypair from private key
        const keypair = Keypair.fromSecretKey(decodedKey);
        
        // Save the keypair to a file
        const keypairData = {
            publicKey: keypair.publicKey.toString(),
            secretKey: Array.from(keypair.secretKey)
        };
        
        fs.writeFileSync('keypair.json', JSON.stringify(keypairData, null, 2));
        console.log('Keypair generated and saved to keypair.json');
        console.log('Public Key:', keypair.publicKey.toString());
        
        return keypair;
    } catch (error) {
        console.error('Error generating keypair:', error.message);
        throw error;
    }
}

// Get private key from command line argument
const privateKeyString = process.argv[2];

if (!privateKeyString) {
    console.error('Please provide the Phantom private key as a command line argument');
    console.error('Usage: node generate-keypair.js "your_phantom_private_key"');
    process.exit(1);
}

generateKeypairFromPhantomPrivateKey(privateKeyString);