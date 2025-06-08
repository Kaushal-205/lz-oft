import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

import { getOftStoreAddress } from './tasks/solana'

// Canonical OFT on Base Sepolia
const baseSepoliaOft: OmniPointHardhat = {
    eid: EndpointId.BASESEP_V2_TESTNET,
    contractName: 'TGNToken',
    address: '0x1F81975cb418183deaf9d3852930743Eff06DF80',
}

// Non-canonical OFT on OP Sepolia
const opSepoliaOft: OmniPointHardhat = {
    eid: EndpointId.OPTSEP_V2_TESTNET,
    contractName: 'TGNToken',
    address: '0x1F81975cb418183deaf9d3852930743Eff06DF80',
}

// Non-canonical OFT on Solana
const solanaOft: OmniPointHardhat = {
    eid: EndpointId.SOLANA_V2_TESTNET,
    address: getOftStoreAddress(EndpointId.SOLANA_V2_TESTNET),
}

// Message execution options
const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
]

const SOLANA_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 200000,
        value: 2500000,
    },
]

export default async function () {
    const connections = await generateConnectionsConfig([
        // Base ↔ Solana
        [
            baseSepoliaOft,
            solanaOft,
            [['LayerZero Labs'], []],
            [15, 32],
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // Base ↔ OP Sepolia
        [
            baseSepoliaOft,
            opSepoliaOft,
            [['LayerZero Labs'], []],
            [15, 15],
            [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],

        // OP Sepolia ↔ Solana
        [
            opSepoliaOft,
            solanaOft,
            [['LayerZero Labs'], []],
            [15, 32],
            [SOLANA_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS],
        ],
    ])

    return {
        contracts: [
            { contract: baseSepoliaOft },
            { contract: opSepoliaOft },
            { contract: solanaOft },
        ],
        connections,
    }
}
