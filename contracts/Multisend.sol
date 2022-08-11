pragma solidity = 0.8.15;

import "hardhat/console.sol";

contract Multisend {
	event PrintMessage(string msg);
	event PrintAddr(address addr);
	string public message;

	constructor() {
		message = 'initial message';
		console.log('initing');
		emit PrintMessage(message);
	}

	function multisend(address payable[] calldata addresses, uint256 value) public payable {
		console.log('multisending asdf');
		for (uint i = 0; i < addresses.length; i++) {
			addresses[i].transfer(value);
			emit PrintAddr(addresses[i]);
		}
	}

	fallback() external payable {
		emit PrintMessage('asdf fallback');
	}

	receive() external payable {
		emit PrintMessage('receive function called');
	}
}
