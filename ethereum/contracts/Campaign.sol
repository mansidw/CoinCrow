pragma solidity ^0.8.11;

contract CampaignFactory{
    address [] public deployedCampaigns;

    function createCampaign(uint minimum) public{
        address campaign = address(new Campaign(minimum,msg.sender));
        deployedCampaigns.push(campaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
}

contract Campaign{

    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    Request[] public requests;
    uint public totApprovers=0;
    mapping(address => bool) public approvers;

    constructor(uint minimum, address creator){
         manager = creator;
         minimumContribution = minimum;
    }

    modifier restricted(){
        require(manager == msg.sender);
        _;
    }

    function contribute() public payable{
        require(msg.value > minimumContribution);
        if(!approvers[msg.sender]){
            totApprovers++;
            approvers[msg.sender] = true;
        }
        
    }

    function createRequest(string memory description,uint value,address payable recipient) restricted public{
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint reqindex) public{
        Request storage request = requests[reqindex];
        // check that the person has contributed
        require(approvers[msg.sender]);
        // and also has not voted earlier
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount ++; 
    }

    function finalizeRequest(uint reqindex) restricted public{
        Request storage request = requests[reqindex];
        require(!request.complete);
        if(request.approvalCount > (totApprovers/2)){
            request.recipient.transfer(request.value);
            request.complete = true;
        }
    }

    function getSummary() public view returns(uint,uint,uint,uint,address){
        return(
            minimumContribution,
            address(this).balance,
            requests.length,
            totApprovers,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}