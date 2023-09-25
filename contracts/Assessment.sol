// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 count;

    event Deposit(address _from, address _to, uint256 amount, string remark);
    event Withdraw(address _from, address _to, uint256 amount, string remark); 
    event Transfer(address _from, address _to, uint256 amount, string remark);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    struct TransferStruct {
      address sender;
      address receiver;
      uint256 amount;
      string remark;
      string transaction_type;
    }
    TransferStruct[] transactions;

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(address _to, uint256 _amount, string memory _remark) public payable {
        uint _previousBalance = balance;
        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");
        count +=1;

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);
        transactions.push(TransferStruct(msg.sender, _to, _amount, _remark, "Deposit"));
        // emit the event
        emit Deposit(msg.sender, _to, _amount, _remark);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(address _from, uint _withdrawAmount, string memory _remark) public {
        require(msg.sender == owner, "You are not the owner of this account");
        count +=1;
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({ 
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));
        transactions.push(TransferStruct(_from, msg.sender,_withdrawAmount, _remark, "Withdrawal"));
        // emit the event
        emit Withdraw(msg.sender, _from, _withdrawAmount, _remark);
    }

    function transfer(address payable _to, uint256 amount, string memory remark) public{
      require(msg.sender == owner, "You are not the owner of this account");
      count +=1;
      transactions.push(TransferStruct(msg.sender, _to, amount, remark, "Transfer"));
      balance -= amount;

      emit Transfer(msg.sender, _to, amount, remark);

    }
    function getTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getCount() public view returns (uint256) {
        return count;
    }

}
