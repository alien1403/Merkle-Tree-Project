const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {

  const merkleTree = new MerkleTree(niceList);
  const yourName = 'Norman Block'; 
  const proof = merkleTree.getProof(yourName);

  try {
    const { data: gift } = await axios.post(`${serverUrl}/gift`, {
      name: yourName,
      proof: proof
    });

    console.log({ gift });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

main();
