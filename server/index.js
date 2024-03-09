const express = require('express');
const verifyProof = require('../utils/verifyProof');
const fs = require('fs');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { bytesToHex } = require('ethereum-cryptography/utils');
const MerkleTree = require('../utils/MerkleTree');

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
const niceListData = fs.readFileSync('../utils/niceList.json', 'utf-8');
const niceList = JSON.parse(niceListData);
const hashedNames = niceList.map(name => keccak256(new Uint8Array(Buffer.from(name)))); // Convert name to Uint8Array
const merkleTree = new MerkleTree(hashedNames);
const merkleRoot = '0x' + merkleTree.getRoot().toString('hex');
// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = merkleRoot;

app.post('/gift', (req, res) => {
  const { name, proof } = req.body;

  // TODO: prove that a name is in the list 
  const isInTheList = verifyProof(proof, MERKLE_ROOT, name)
  if(isInTheList) {
    res.send("You got a toy robot!");
  }
  else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
