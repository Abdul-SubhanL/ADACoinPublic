const SHA256 = require('crypto-js/sha256'); //looks in the node_modules folder for the library
const uuid = require('uuid');
const moment = require('moment')

class Block {
  constructor(ts, transaction, phash) {
    //ts - indicates the time stamp when the block was created
    //transaction - holds information to be stored, e.g. details of transaction, how much money transferred, sender, recipient 
    //phash - holds the hash value of the 'previous' block; essential to ensure integrity 
    
    this.ts = ts;
    this.transaction = transaction;
    this.phash = phash;
    
    //we also need to include a hash for this block
    this.hash = this.calculatehash(); //lets execute our hash function and store the function
  }
  
  calculatehash() {
    //returns a calculated hash based on the stored values
    let hash = SHA256( this.ts + JSON.stringify(this.transaction) + this.phash ); //this creates an object
    return hash.toString(); //lets return a string rather than an object
  }

  //additional feature
  validtransaction() {
    //checks if uuid is unique
    if (!uuid.validate(this.transaction.tid)) {
      return false
    }

    //check transaction type name is either 'credit' or 'debit'
    if (!('credit' in this.transaction) && !('debit' in this.transaction)) {
      return false;
    }

    //credit transactions
    if ('credit' in this.transaction) {
      var credit = this.transaction.credit;
      //note: transaction value must be a string to conserve 2 d.p.
      //check string isn't empty
      if (credit.length > 0) {
        // checks if string is not a number
        if (isNaN(credit)) {
          return false
        }
      }
      else {
        return false
      }

      // transaction value is 2 d.p.
      //3rd last character should be a decimal point
      if (credit[credit.length-3] != '.') {
        return false
      }

      //credit within range 0-1000
      if (credit <= 0 || credit > 1000) { 
        return false
      }
    }

    //check debit transaction
    if ('debit' in this.transaction) {
      var debit = this.transaction.debit;
      // note: transaction value must be a string to conserve 2 d.p.
      //check string isn't empty
      if (debit.length > 0) {
        // checks if string is not a number
        if (isNaN(debit)) {
          return false
        }
      }
      else {
        return false
      }

      // transaction value is 2 d.p.
      //3rd last character should be a decimal point
      if (debit[debit.length-3] != '.') {
        return false
      }
      
      //checks if debit within range -1000-0
      if (debit >= 0 || debit < -1000) { 
        return false
      }
    }
    
    return true
  }
}

class Chain {
  constructor() {
    this.chain = [ this.genesisblock() ];
  }

  genesisblock() {
    //returns a new genesis block, the required starting block
    return new Block('1/1/1970', 'Genesis Block', 0); //idx, ts, data, phash
  }

  lastblock() {
    //gets the length of the chain and uses that to return the last block (object)
    return this.chain[this.chain.length - 1];
  }

  addblock(newblock) {
    if (this.checkblock(newblock) == false) {
      return
    }
    //responsible for adding additional blocks into the chain
    //needs to do some work first
    //1, get the hash of the previous block and add that at this new blocks previous hash
    newblock.phash = this.lastblock().hash;
    newblock.hash = newblock.calculatehash(); //calculate the hash value for the newblock
    
    this.chain.push(newblock); //add the new block to the chain - not normally this simple in 'real-life'
  }

  checkblock(newblock) {
    for( let b = 1; b < this.chain.length; b++ ) { // 0 = genesis
      if (newblock.transaction.tid == this.chain[b].transaction.tid) {
        return false
      }
    }

    //check date format
    let acceptableDateFormats = ['DD/MM/YYYY', 'DD/MM/YY', 'D/MM/YYYY', 'D/MM/YY', 'DD/M/YYYY', 'DD/M/YY',  'D/M/YYYY', 'D/M/YY']
    if (!moment(newblock.ts, acceptableDateFormats, true).isValid()) {
      return false
    }

    let newblockDate = newblock.ts.split('/'); //splits date string into array containing day, month, year separately
    let currentDate = new Date();

    //check date before current date
    //check if year is less than current year
    if (newblockDate[2] <= currentDate.getFullYear()) {
      //check if month is less than current month
      if (newblockDate[1] <= currentDate.getMonth()+1) { //month index starts at 0
        //check if day is more than current day
        if (newblockDate[0] > currentDate.getDate()) {
          return false
        }
      }
      else {
        return false
      }
    }
    else {
      return false
    }

    return true
  }

  isvalid() {
    //returns true or false depending on whether the enire chain is valid
    for( let b = 1; b < this.chain.length; b++ ) { // 0 = genesis
      const current = this.chain[ b ]; //the current block being iterated
      const previous = this.chain[ b - 1 ]; // the previous iterated block

      //check the block hashes
      if( current.hash !== current.calculatehash() ) { // is the current block hash incorrect?
        return false;
      }

      if( current.phash !== previous.hash ) { // is the current previous hash not the same as the previous hash?
        return false;
      }      
    }
    //if we have iterated through the entire chain we should be all good
    return true;
  }

  //additional feature
  balance() {
    if (this.chain.length <= 1) {
      return '0.00'
    }

    let count = 0; 
    for( let b = 1; b < this.chain.length; b++ ) {
      count += Number(this.chain[b].transaction.credit) || Number(this.chain[b].transaction.debit)
    }
    return count.toFixed(2)
  }

  //additional feature
  rebuild() {
    //recalculate hashes of all blocks
    for( let a = 0; a < this.chain.length; a++ ) {
      this.chain[a].hash = this.chain[a].calculatehash();
    }

    //change phash of blocks to reflect any changes
    for( let b = 1; b < this.chain.length; b++ ) {
      this.chain[b].phash = this.chain[b-1].hash;
    }
  }
}

module.exports = { Block, Chain }; // this allows the classes to be exported