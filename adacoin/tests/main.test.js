const { uuid } = require('uuidv4');
const { Block, Chain } = require('../src/main.js'); 
const { validate } = require('uuid')

describe('AdaCoin', () => {
  describe('Transaction value boundaries', () => {
    describe('Credit', () => {
      test('UB+1: 1000.01 invalid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {credit: '1000.01', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeFalsy();
      });
      test('UB: 1000.00 valid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {credit: '1000.00', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeTruthy();
      });
      test('UB-1: 999.99 valid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {credit: '999.99', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeTruthy();
      });
  
      test('LB+1: 0.02 valid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {credit: '0.01', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeTruthy();
      });
      test('LB: 0.01 valid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {credit: '0.01', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeTruthy();
      });
      test('LB-1: 0.00 invalid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {credit: '0.00', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeFalsy();
      });
    });

    describe('Debit', () => {
      test('UB+1: 0.00 invalid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {debit: '0.00', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeFalsy();
      });
      test('UB: -0.01 valid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {debit: '-0.01', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeTruthy();
      });
      test('UB-1: -0.02 valid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {debit: '-0.02', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeTruthy();
      });
  
      test('LB+1: -999.99 valid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {debit: '-999.99', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeTruthy();
      });
      test('LB: -1000.00 valid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {debit: '-1000.00', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeTruthy();
      });
      test('LB -1: -1000.01 invalid', () => {
        let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
        adablock.transaction = {debit: '-1000.01', tid: uuid()}
  
        expect(adablock.validtransaction()).toBeFalsy();
      });
    });
  });
    
  describe('Miscellaneous (random) transaction values', () => {

    test('valid credit: 10.00', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: '10.00', tid: uuid()}

      expect(adablock.validtransaction()).toBeTruthy();
    });
    test('invalid credit: -5.00', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: '-5.00', tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    test('valid debit: -32.00', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {debit: '-32.00', tid: uuid()}

      expect(adablock.validtransaction()).toBeTruthy();
    });
    test('invalid debit: 2.00', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: '2.00', tid: uuid()}

      expect(adablock.validtransaction()).toBeTruthy();
    });
  });

  describe('Invalid transaction_type value datatypes', () => {
    test('Extra decimals invalid', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: '3.14159', tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    test('Less decimals invalid', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: '3.1', tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    test('char value invalid', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: 'a', tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    test('array containing valid string number invalid', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: ['1.00'], tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    test('actual number invalid', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: 21.00, tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    test('boolean value invalid', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: true, tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
  });

  describe('Invalid transaction_type key', () => {
    it('invalid spelling of credit key', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {creodit: '1.00', tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    it('invalid spelling of debit key', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {dbeit: '-1.00', tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    it('invalid case of credit key', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {CREDIT: '2.00', tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    it('invalid case of debit key', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {DEBIT: '-2.00', tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
    it('invalid name key', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {random: 2.00, tid: uuid()}

      expect(adablock.validtransaction()).toBeFalsy();
    });
  });

  describe('Transaction tid', () => {
    it('valid UUID', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: '1.00', tid: uuid()}

      expect(validate(adablock.transaction.tid)).toBeTruthy();
    });
    it('invalid UUID (not autogenerated)', () => {
      let adablock = new Block('1/1/1970', {}, 0); //ts and phash not relevant for this test
      adablock.transaction = {credit: '1.00', tid: 0}

      expect(adablock.validtransaction()).toBeFalsy();
    });
  });

  describe('Transaction id within the chain', () => {
    it('unique transaction id exists within the chain', () => {
      let adacoin = new Chain();
      let adablock1= new Block('1/1/1970', {credit: '1.00', tid: uuid()}, adacoin.chain[0].hash) //give block's phash the hash of genesis block
      adacoin.addblock(adablock1)
      let adablock2 = new Block('2/1/1970', {debit: '-2.00', tid: uuid()}, adacoin.chain[1].hash)

      expect(adacoin.checkblock(adablock2)).toBeTruthy();
    });
    it('unique transaction id does not exist within the chain', () => {
      let adacoin = new Chain();
      let tidcopy = uuid(); //unique id to copy for both blocks
      let adablock1= new Block('1/1/1970', {credit: '1.00', tid: tidcopy}, adacoin.chain[0].hash) //give block's phash the hash of genesis block
      adacoin.addblock(adablock1)
      let adablock2 = new Block('2/1/1970', {debit: '-2.00', tid: tidcopy}, adacoin.chain[1].hash)

      expect(adacoin.checkblock(adablock2)).toBeFalsy();
    });
  });

  describe('Adding blocks with invalid dates to the chain', () => {
    it('future date  rejected from the chain', () => {
      let adacoin = new Chain();
      let adablock= new Block('09/02/2025', {credit: '1.00', tid: uuid()}, adacoin.chain[0].hash)
      
      expect(adacoin.checkblock(adablock)).toBeFalsy();
    });
    it('incorrect date rejected from the chain', () => {
      let adacoin = new Chain();
      let adablock= new Block('0', {credit: '1.00', tid: uuid()}, adacoin.chain[0].hash)
      
      expect(adacoin.checkblock(adablock)).toBeFalsy();
    });
    it('valid date can be added to the chain', () => {
      let adacoin = new Chain();
      let adablock= new Block('01/02/2020', {credit: '1.00', tid: uuid()}, adacoin.chain[0].hash)
      
      expect(adacoin.checkblock(adablock)).toBeTruthy();
    });
  });
  
  describe('Balance method', () => {
    it('calculate balance of chain with credit and debit', () => {
      let adacoin = new Chain();
      let adablock1= new Block('1/1/1970', {credit: '13.00', tid: uuid()}, adacoin.chain[0].hash) //give block's phash the hash of genesis block
      adacoin.addblock(adablock1)
      let adablock2 = new Block('2/1/1970', {debit: '-2.00', tid: uuid()}, adacoin.chain[1].hash)
      adacoin.addblock(adablock2)

      expect(adacoin.balance()).toBe('11.00');
    });
    it('calculate balance of empty chain', () => {
      let adacoin = new Chain();
      expect(adacoin.balance()).toBe('0.00');
    });
  });

  describe('Rebuild method', () => {
    it('rebuild chain with incorrect phashes', () => {
      let adacoin = new Chain();
      let adablock1= new Block('1/1/1970', {credit: '13.00', tid: uuid()}, 2)
      adacoin.addblock(adablock1)
      let adablock2 = new Block('2/1/1970', {debit: '-2.00', tid: uuid()}, 3)
      adacoin.addblock(adablock2)
      adacoin.chain[1].hash = 0 //change hash value to break chain

      expect(adacoin.isvalid()).toBeFalsy(); //check chain is broken
      adacoin.rebuild();
      expect(adacoin.isvalid()).toBeTruthy();

    });
  });
}); 
 