const NetworkRepository = require("../repositories/networkRepository");

class NetworkService {
  constructor() {
    this.networkRepository = new NetworkRepository();
  }

  async getAllNetworks() {
    return this.networkRepository.getAllNetworks();
  }

  async createNetwork(networkData) {
    return this.networkRepository.createNetwork(networkData);
  }

  async getNetworkById(networkId) {
    return this.networkRepository.getNetworkById(networkId);
  }

  async updateNetwork(networkId, networkData) {
    return this.networkRepository.updateNetwork(networkId, networkData);
  }

  async deleteNetwork(networkId) {
    return this.networkRepository.deleteNetwork(networkId);
  }
}

module.exports = NetworkService;
