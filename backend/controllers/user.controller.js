const db = require("../config/database");

exports.getAllUsers = async (req, res) => {
  try {
    console.log("req comes to get user");
    const users = await db("users").select(
      "id",
      "name",
      "username",
      "email",
      "address",
      "role",
      "created_at"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.getUserDetail = async (req, res) => {
  const { id } = req.params;
  console.log("come dto fetch user", id);

  try {
    const user = await db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    const likedStores = await db("store_reactions")
      .join("stores", "store_reactions.store_id", "stores.id")
      .select("stores.id", "stores.name")
      .where({ "store_reactions.user_id": id, reaction: "like" });

    const reviewedStoresRaw = await db("ratings")
      .join("stores", "ratings.store_id", "stores.id")
      .select("stores.id", "stores.name", "ratings.rating", "ratings.review")
      .where({ "ratings.user_id": id })
      .whereNull("ratings.parent_review_id"); // ✅ FIX

    const reviewedStores = reviewedStoresRaw.map((store) => ({
      ...store,
      userRating: {
        rating: store.rating,
        review: store.review,
      },
    }));

    res.json({ user, likedStores, reviewedStores });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db("users").where({ id }).del();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.makeAdmin = async (req, res) => {
  console.log("req comes to make admin");
  const { id } = req.params;

  try {
    if (req.user.role !== "system_admin") {
      return res
        .status(403)
        .json({ error: "Only system_admin can promote users" });
    }

    await db("users").where({ id }).update({ role: "admin" });
    console.log("made admin");
    res.json({ message: "User promoted to admin" });
  } catch (err) {
    console.error("Error making admin:", err);
    res.status(500).json({ error: "Failed to make user admin" });
  }
};

exports.removeAdmin = async (req, res) => {
  console.log("req comes to remove admin");
  const { id } = req.params;
  console.log("id", id);

  try {
    if (req.user.role !== "system_admin") {
      return res
        .status(403)
        .json({ error: "Only system_admin can remove admin rights" });
    }

    const hasStore = await db("stores").where({ owner_id: id }).first("id");

    const newRole = hasStore ? "store_owner" : "normal_user";

    await db("users").where({ id }).update({ role: newRole });

    console.log(`removed admin, new role: ${newRole}`);
    res.json({ message: `User demoted from admin → ${newRole}` });
  } catch (err) {
    console.error("Error removing admin:", err);
    res.status(500).json({ error: "Failed to remove admin" });
  }
};

exports.DeleteStore = async (req, res) => {
  const storeId = parseInt(req.params.id);

  const trx = await db.transaction();

  try {
    const store = await trx("stores").where({ id: storeId }).first();
    if (!store) {
      await trx.rollback();
      return res.status(404).json({ message: "Store not found" });
    }

    const ownerId = store.owner_id;

    await trx("stores").where({ id: storeId }).del();

    const hasStore = await trx("stores")
      .where({ owner_id: ownerId })
      .first("id");

    const owner = await trx("users").where({ id: ownerId }).first("role");

    if (
      !hasStore &&
      owner &&
      owner.role !== "admin" &&
      owner.role !== "system_admin"
    ) {
      await trx("users").where({ id: ownerId }).update({ role: "normal_user" });
    }

    await trx.commit();

    return res.status(200).json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error("DeleteStore error:", err);
    await trx.rollback();
    return res.status(500).json({ message: "Internal server error" });
  }
};
