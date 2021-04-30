const web3 = require("web3");
const artifact = artifacts.require("KineOracleV2");

const me = '0x47123547cA5472d82155eCcBecFB69b329327e82';

const kaptain = me;

//   0 CHAINLINK, // priceUnit is aggregator decimals, baseUnit depends on underlying
//   1 KAPTAIN    // KAPTAIN priceUnit is 6 digit
//   2 LP,        // LP baseUnit is 1e18, priceUnit is 1e18

const configs = [
  // MCD
  {
    "kToken": "0x03bBd0A9857Aa4Aa36d861e13899a2e38FDD7bE2",
    "underlying": "0x03bBd0A9857Aa4Aa36d861e13899a2e38FDD7bE2",
    "symbolHash": "0xb4e390f51b7b166e80aa2bd4ca6a7efd11d137edbc0329a84b39d48eaf9f084c",
    "baseUnit": "1000000000000000000",
    "priceUnit": "1000000",
    "priceSource": 1 // KAPTAIN - MCD
  },
  // KINE
  {
    "kToken": "0x3843742f0C6E341a155Fc386eb1309294dF0a69A",
    "underlying": "0x0246e3847a59b90b9F692EdF5352ce31A3376c10",
    "symbolHash": "0xeb48ef9150b594762681c5b8a89019528e4a6af2dc81fe0a4cc42c194c8cbda1",
    "baseUnit": "1000000000000000000",
    "priceUnit": "1000000",
    "priceSource": 1 // KAPTAIN
  },
  // xKINE (lowercase x)
  {
    "kToken": "0xfc48a7A767CC290f70E07F483647A7917A0511c9",
    "underlying": "0x97262116B1ee5d4db7Bb5245Ac4073501c2D18C8",
    "symbolHash": "0xe7dd417ce0d2c9663d253c6661ea04b9315c5630aac8b872e96a5225abd507d1",
    "baseUnit": "1000000000000000000",
    "priceUnit": "1000000",
    "priceSource": 1 // KAPTAIN
  },
  // BNB
  {
    "kToken": "0xbec2164C45Ab3faE8CADE3916117F72F99E06a4e",
    "underlying": "0xae13d989dac2f0debff460ac112a837c89baa7cd",
    "symbolHash": "0x3ed03c38e59dc60c7b69c2a4bf68f9214acd953252b5a90e8f5f59583e9bc3ae",
    "baseUnit": "1000000000000000000",
    "priceUnit": "100000000",
    "priceSource": 0 // CHAINLINK
  },
  // USDT
  {
    "kToken": "0x5A8aE999EA4Cdb35Ed675A3357f25d2B4A119bDb",
    "underlying": "0xAf491cE1d719397b71a8368604b390EDDE83BAEF",
    "symbolHash": "0x8b1a1d9c2b109e527c9134b25b1a1833b16b6594f92daa9f6d9b7a6024bce9d0",
    "baseUnit": "1000000000000000000",
    "priceUnit": "100000000",
    "priceSource": 0 // CHAINLINK
  },
  // BTC
  {
    "kToken": "0x840Cda8011dCBB58c5c85e86B2B1D9C84331d261",
    "underlying": "0x0575e5766B2CA4A4ae227d5daCbE5a3933677e67",
    "symbolHash": "0xe98e2830be1a7e4156d656a7505e65d08c67660dc618072422e9c78053c261e9",
    "baseUnit": "1000000000000000000",
    "priceUnit": "100000000",
    "priceSource": 0 // CHAINLINK
  },
  // LP-KINE-BNB
  {
    "kToken": "0x898A05b58e471b6cC184381E058b2634196DE6C8",
    "underlying": "0x1dc00be1d361a19bda95fcfce1266dca4d767e62",
    "symbolHash": "0x3309cf72aa317295d4bc968cf8f7f2b2775c76996b7e1e06012c188ff3c3ea3a",
    "baseUnit": "1000000000000000000",
    "priceUnit": "1000000000000000000",
    "priceSource": 2 // LP
  },
  // LP-KUSD-USDT
  {
    "kToken": "0x72815A1F8DA5B8ab0f5d6d91C3B9Bd2E664aa958",
    "underlying": "0x969f0049a73d08e22728adc70c2837350f1a735b",
    "symbolHash": "0x53bfc5e9ce219990757e0afb43789388a22395f73344019743a2fdc29213b504",
    "baseUnit": "1000000000000000000",
    "priceUnit": "1000000000000000000",
    "priceSource": 2 // LP
  },
  // KUSD
  {
    "kToken": "0x19bF4F156d17976bBa58aa2AAF232c1c7705089C",
    "underlying": "0x19bF4F156d17976bBa58aa2AAF232c1c7705089C",
    "symbolHash": "0x5d9079ae37aaddb178a8043ea872a326b9a242a4e27cbce4194642203cafea86",
    "baseUnit": "1000000000000000000",
    "priceUnit": "1000000",
    "priceSource": 1 // KAPTAIN
  },
];

// BSC Aggregator
// ["USDT","BTC", "BNB"]
// ["0xEca2605f0BCF2BA5966372C99837b1F182d3D620","0x5741306c21795FdCBb9b265Ea0255F499DFe515C", "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"]

// Kovan Aggregator
// ["USDT","BTC", "BNB"]
// ["0x2ca5A90D34cA333661083F89D831f757A9A50148","0x6135b13325bfC4B00278B4abC5e20bbce2D6580e", "0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16"]

// KAPTAIN Price
// ["KINE", "xKINE"]
// [3090000, 3100000]

module.exports = (deployer) => {
  for(let i = 0; i < configs.length; i++){
    let baseUnitBN = web3.utils.toBN(configs[i].baseUnit);
    let priceUnitBN = web3.utils.toBN(configs[i].priceUnit)
    configs[i]["priceMantissa"] = baseUnitBN.mul(priceUnitBN).toString();
  }
  
  deployer.deploy(artifact, kaptain, configs);
};


