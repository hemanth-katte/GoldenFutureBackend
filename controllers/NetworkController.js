const express = require('express');
const NetworkService = require('../services/networkService');
const router = express.Router();
const networkService = new NetworkService();

class NetworkController {

  async getAllNetworks(req, res) {
    try {
      const networks = await networkService.getAllNetworks();
      res.json(networks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createNetwork(req, res) {
    try {
      const networkData = req.body;
      const newNetwork = await networkService.createNetwork(networkData);
      res.status(201).json(newNetwork);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getNetworkById(req, res) {
    try {
      const networkId = req.params.id;
      const network = await networkService.getNetworkById(networkId);
      if (!network) {
        return res.status(404).json({ message: 'Network not found' });
      }
      res.json(network);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateNetwork(req, res) {
    try {
      const networkId = req.params.id;
      const networkData = req.body;
      const updatedNetwork = await networkService.updateNetwork(networkId, networkData);
      res.json(updatedNetwork);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteNetwork(req, res) {
    try {
      const networkId = req.params.id;
      await networkService.deleteNetwork(networkId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
}

const networkController = new NetworkController();


router.post('/createNetwork', networkController.createNetwork.bind(networkController));
router.get('/getAllNetworks', networkController.getAllNetworks.bind(networkController)); 
router.get('/getNetworkById/:id', networkController.getNetworkById.bind(networkController));
router.put('/updateNetwork/:id', networkController.updateNetwork.bind(networkController));
router.delete('/deleteNetwork/:id', networkController.deleteNetwork.bind(networkController));

module.exports = router;
