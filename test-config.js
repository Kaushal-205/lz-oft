const { EndpointId } = require('@layerzerolabs/lz-definitions');

console.log('EndpointId.BASE_V2_TESTNET:', EndpointId.BASE_V2_TESTNET);
console.log('EndpointId.OPTIMISM_V2_TESTNET:', EndpointId.OPTIMISM_V2_TESTNET);
console.log('EndpointId.SOLANA_V2_TESTNET:', EndpointId.SOLANA_V2_TESTNET);
console.log('EndpointId.SEPOLIA_V2_TESTNET:', EndpointId.SEPOLIA_V2_TESTNET);

// Test loading our config
async function testConfig() {
    try {
        const config = await import('./layerzero.config.ts');
        const result = await config.default();
        console.log('Config loaded successfully:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error loading config:', error.message);
        console.error('Stack:', error.stack);
    }
}

testConfig(); 