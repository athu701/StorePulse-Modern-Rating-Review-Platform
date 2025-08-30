const storeRepo = require("../repositories/store.repository");

async function createStore(data) {
  return storeRepo.createStore(data);
}

async function listStores(filters) {
  console.log("without user in service");
  return storeRepo.getAllStores(filters);
}

async function listStoresWithReaction(userId, filters) {
  console.log("with user in service");
  return storeRepo.getAllStoresWithReaction(userId, filters);
}

async function getStore(id) {
  return storeRepo.findStoreById(id);
}

module.exports = { createStore, listStores, listStoresWithReaction, getStore };
