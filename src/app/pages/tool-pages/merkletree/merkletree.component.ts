import { Component, OnInit } from '@angular/core';
import { MerkleTree } from 'merkletreejs';
import { sha256 } from 'js-sha256';
import  keccak256  from 'keccak256';

import { WHITELIST } from '../../../contracts/addresses_v2'

@Component({
  selector: 'app-merkletree',
  templateUrl: './merkletree.component.html',
  styleUrls: ['./merkletree.component.less']
})
export class MerkletreeComponent implements OnInit {

  private _hashFn = {
    sha256: sha256,
    keccak256: keccak256
  }

  level;
  get levels() {
    return Object.keys(WHITELIST);
  }

  tree: any;
  merkle = {
    leaves: '',
    hashFnChecked: 'sha256',
    hashFn: [
      {id: 1, name: 'sha256'},
      {id: 2, name: 'keccak256'}
    ],
    options: [
      {id: 1, name: 'hashLeaves', selected: false},
      {id: 2, name: 'sortLeaves', selected: false},
      {id: 3, name: 'sortPairs', selected: false},
      {id: 4, name: 'duplicateOdd', selected: false},
      {id: 5, name: 'isBitcoinTree', selected: false},
      // {id: 6, name: 'fillDefaultHash', selected: false},
    ]
  };


  verifiction = {
    proof: '',
    leaf: '',
    root: '',
    result: null
  }


  leave = '';
  proof = [];



  output = {
    root: '',
    leaves: []
  }

  constructor() { }

  ngOnInit(): void {
  }

  changeLevel(level): void {
    this.merkle.leaves = JSON.stringify(WHITELIST[level.toString()])
  }

  submitInput(): void {
    this.clear();

    const leaves = this.getLeaves();
    const hashFn = this.getHashFn();
    const options = this.getOptions();
    this.tree = new MerkleTree(leaves, hashFn, options);
    this.output.root = this.tree.getHexRoot();
    this.output.leaves = this.tree.getHexLeaves();
    console.log('leaves', leaves)
    console.log('hashFn', hashFn)
    console.log('options', options)
    console.log('output.root', this.output.root)
    console.log('output.leaves', this.output.leaves)
  }

  clear(): void {
    this.leave = '';
    this.proof = [];
    this.output = {
      root: '',
      leaves: []
    }
  }

  getLeaves() {
    let leaves = this.merkle.leaves.trim();
    leaves = leaves.replace(/'/gi, '"');
    try {
      return JSON.parse(leaves)
    } catch (err) {
      return leaves.split('\n')
        .map(function (line) { return line.trim() })
        .filter(function (line) { return line })
    }
  }
  getHashFn() {
    return this._hashFn[this.merkle.hashFnChecked];
  }
  getOptions() {
    let options = {};
    this.merkle.options.forEach(item => {
      options[item.name] = item.selected
    })
    return options;
  }

  getProof(leave) {
    this.proof = this.tree.getHexProof(leave);
  }

  verify() {
    this.verifiction.result = null;

    const verifyproof = this.getVerifyProof();
    const hashFn = this.getHashFn();
    const options = this.getOptions();

    this.verifiction.result = MerkleTree.verify(verifyproof, this.verifiction.leaf, this.verifiction.root, hashFn, options);
  }

  getVerifyProof() {
    let leaves = this.verifiction.proof.trim();
    leaves = leaves.replace(/'/gi, '"');
    try {
      return JSON.parse(leaves)
    } catch (err) {
      return leaves.split('\n')
        .map(function (line) { return line.trim() })
        .filter(function (line) { return line })
    }
  }
}
