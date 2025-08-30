const storeService = require("../services/store.service");
const {
  storeSchema,
  storeFilterSchema,
} = require("../validators/store.validator");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const streamifier = require("streamifier");
const db = require("../config/database");
const { hashPassword, comparePasswords } = require("../utils/hash.util");

const DEFAULT_IMAGE_URL =
  "https://static.vecteezy.com/system/resources/previews/020/662/330/non_2x/store-icon-logo-illustration-vector.jpg";

async function createStore(req, res) {
  console.log("req comes to create store");
  const trx = await db.transaction();
  try {
    let imageUrl = DEFAULT_IMAGE_URL;

    if (req.file) {
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "stores" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadStream();
      imageUrl = result.secure_url;
    }

    const [store] = await trx("stores")
      .insert({
        name: req.body.store_name,
        email: req.body.email,
        address: req.body.address,
        description: req.body.description,
        category: req.body.category || "others",
        image_url: imageUrl,
        owner_id: req.body.owner_id,
        phone_no: req.body.phone_no || "",
      })
      .returning("*");

    const owner = await trx("users")
      .where({ id: req.body.owner_id })
      .first("role");

    if (owner && owner.role !== "admin" && owner.role !== "system_admin") {
      await trx("users")
        .where({ id: req.body.owner_id })
        .update({ role: "store_owner" });
    }

    await trx.commit();

    console.log("req goes to create store");

    res.status(201).json(store);
  } catch (err) {
    console.error("Error creating store:", err);
    await trx.rollback();
    res.status(500).json({ error: "Failed to create store" });
  }
}

async function listStores(req, res) {
  try {
    const filters = await storeFilterSchema.validateAsync(req.query);
    const userId = req.params.id;
    console.log("in list store", userId);
    let stores;
    if (userId) {
      console.log("user id found");

      console.log("with userId:", userId);
      stores = await storeService.listStoresWithReaction(userId, filters);
    } else {
      console.log("without userId");
      stores = await storeService.listStores(filters);
    }

    res.json(stores);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getinfo(req, res) {
  const storeId = req.params.id;

  try {
    const store = await storeService.getStore(storeId);

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    console.log("store in controlller", store);
    res.json({ store });
  } catch (err) {
    console.log("error occur controller");
    console.error("Failed to fetch store info:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getreviews(req, res) {
  try {
    const reviews = await knex("ratings as r")
      .join("users as u", "r.user_id", "u.id")
      .select(
        "r.id",
        "r.store_id",
        "r.user_id",
        "u.username",
        "r.rating",
        "r.review",
        "r.parent_review_id",
        "r.created_at",
        "r.updated_at"
      )
      .where("r.store_id", req.params.id)
      .orderBy("r.created_at", "asc");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

async function updateStore(req, res) {
  try {
    console.log("req come in try box");
    const { id } = req.params;
    const { name, email, address, description, category, phone_no } = req.body;

    const store = await db("stores").where({ id }).first();
    if (!store) return res.status(404).json({ error: "Store not found" });

    let image_url = store.image_url;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "stores" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      image_url = uploadResult.secure_url;
    }

    console.log("done with img_url", image_url);

    const updatedData = {
      name: name?.trim() || store.name,
      email: email?.trim() || store.email,
      address: address?.trim() || store.address,
      description: description?.trim() || store.description,
      category: category || store.category,
      phone_no: phone_no || store.phone_no,
      image_url,
      updated_at: new Date(),
    };

    await db("stores").where({ id }).update(updatedData);

    const updatedStore = await db("stores")
      .select(
        "id",
        "name",
        "email",
        "address",
        "description",
        "category",
        "phone_no",
        "image_url",
        "created_at",
        "updated_at"
      )
      .where({ id })
      .first();

    return res.json({ store: updatedStore });
  } catch (err) {
    console.error("Update store failed", err);
    return res.status(500).json({ error: "Update store failed" });
  }
}

async function verifyStoreOwnerPassword(req, res) {
  const storeId = parseInt(req.params.id);
  let { password } = req.body;

  console.log("password type:", typeof password, "password value:", password);

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  password = password.toString();

  try {
    const store = await db("stores").where({ id: storeId }).first();
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const owner = await db("users").where({ id: store.owner_id }).first();
    console.log("check", owner.password_hash);

    if (!owner) {
      return res.status(404).json({ message: "Store owner not found" });
    }

    const isMatch = await comparePasswords(password, owner.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({ message: "Password verified" });
  } catch (err) {
    console.error("verifyStoreOwnerPassword error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function DeleteStore(req, res) {
  const storeId = parseInt(req.params.id);
  const userId = req.user.id;

  const trx = await db.transaction();

  try {
    const store = await trx("stores").where({ id: storeId }).first();
    if (!store) {
      await trx.rollback();
      return res.status(404).json({ message: "Store not found" });
    }

    if (store.owner_id !== userId) {
      await trx.rollback();
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this store" });
    }

    await trx("stores").where({ id: storeId }).del();

    const hasStore = await trx("stores")
      .where({ owner_id: userId })
      .first("id");

    if (!hasStore) {
      await trx("users").where({ id: userId }).update({ role: "normal_user" });
    }

    await trx.commit();

    return res.status(200).json({ message: "Store deleted successfully" });
  } catch (err) {
    console.error("DeleteStore error:", err);
    await trx.rollback();
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createStore,
  listStores,
  getinfo,
  getreviews,
  createStore,
  updateStore,
  verifyStoreOwnerPassword,
  DeleteStore,
};
