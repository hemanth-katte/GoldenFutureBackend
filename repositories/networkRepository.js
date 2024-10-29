const Network = require("../models/Network");

class NetworkRepository {
  async getAllNetworks() {
    return Network.findAll();
  }

  async createNetwork(networkData) {
    return await Network.create(networkData);
  }

  async getNetworkById(networkId) {
    return await Network.findByPk(networkId);
  }

  async updateNetwork(networkId, networkData) {
    const network = await Network.findByPk(networkId);
    if (!network) {
      throw new Error("Network not found");
    }
    return network.update(networkData);
  }

  async deleteNetwork(networkId) {
    const network = await Network.findByPk(networkId);
    if (!network) {
      throw new Error("Network not found");
    }
    return network.destroy();
  }

  async getMyNetworkConnectionBaseLevel(referenceId, networkLevel) {
    try {
      const transcation = await Network.findAll({
        where: {
          level: networkLevel,
          toReferenceId: referenceId,
          networkStatus: "ACCEPTED",
        },
      });
      return transcation;
    } catch (error) {
      throw error;
    }
  }

  async updatePaymentsStatusByID(id, status) {
    try {
      const network = await Network.findByPk(id);
      if (!network) {
        throw new Error("Network not found");
      }
      network.networkStatus = status;
      await network.save();
      return network;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NetworkRepository;
