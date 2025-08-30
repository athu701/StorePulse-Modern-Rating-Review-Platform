const db = require("../config/database");
const { getAverageRatingForStore } = require("./rating.repository");

async function createStore(store) {
  const [created] = await db("stores")
    .insert(store)
    .returning([
      "id",
      "name",
      "email",
      "address",
      "description",
      "image_url",
      "owner_id",
    ]);
  return created;
}

async function getAllStores(filters = {}) {
  let query = db("stores").select("*");

  if (filters.name) {
    query = query.whereILike("name", `%${filters.name}%`);
  }
  if (filters.address) {
    query = query.whereILike("address", `%${filters.address}%`);
  }

  const stores = await query;

  const storesWithRatings = await Promise.all(
    stores.map(async (store) => {
      const avg_rating = await getAverageRatingForStore(store.id);
      return {
        ...store,
        avg_rating,
      };
    })
  );

  return storesWithRatings;
}

async function getAllStoresWithReaction(userId, filters = {}) {
  let query = db("stores").select(
    "stores.*",
    db.raw(
      `
        EXISTS (
          SELECT 1 FROM store_reactions 
          WHERE store_reactions.store_id = stores.id 
          AND store_reactions.user_id = ? 
          AND store_reactions.reaction = 'like'
        ) as "isliked"
      `,
      [userId]
    ),
    db.raw(
      `
        EXISTS (
          SELECT 1 FROM ratings 
          WHERE ratings.store_id = stores.id 
          AND ratings.user_id = ?
        ) as "userreview"
      `,
      [userId]
    )
  );

  if (filters.name) {
    query = query.whereILike("stores.name", `%${filters.name}%`);
  }
  if (filters.address) {
    query = query.whereILike("stores.address", `%${filters.address}%`);
  }

  const stores = await query;

  for (let store of stores) {
    store.avg_rating = await getAverageRatingForStore(store.id);
  }

  return stores;
}

async function findStoreById(id) {
  const store = await db("stores")
    .select("stores.*", "users.name as store_owner_name")
    .leftJoin("users", "stores.owner_id", "users.id")
    .where("stores.id", id)
    .first();

  if (!store) return null;

  const avg_rating = await getAverageRatingForStore(store.id);

  return {
    ...store,
    avg_rating,
  };
}

module.exports = {
  createStore,
  getAllStores,
  findStoreById,
  getAllStoresWithReaction,
};
