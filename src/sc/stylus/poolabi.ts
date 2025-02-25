const poolabi = [
    "function initialize(address _token, address admin, address bank_admin, address deployer) external",
    "function deposit(uint256 amount) external returns (bool)",
    "function getDeposit(address user) external view returns (uint256)",
    "function contractBalance() external view returns (uint256)",
    "function emergencyWithdraw() external returns (bool)",
    "function rewardWinners(address host, address[] memory winners) external returns (bool)",
    "function tokenBalance(address owner) external view returns (uint256)"
]
export default poolabi;