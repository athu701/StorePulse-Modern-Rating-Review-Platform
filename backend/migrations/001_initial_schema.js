exports.up = async function (knex) {
  await knex.raw("DROP TYPE IF EXISTS user_role");
  await knex.raw("DROP TYPE IF EXISTS reaction_type");

  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 60).notNullable();
    table.string("username", 50).notNullable().unique();
    table.string("email").unique().notNullable();
    table.string("password_hash").notNullable();
    table.string("address", 400);
    table
      .text("image_url")
      .defaultTo(
        "https://t4.ftcdn.net/jpg/06/59/13/31/360_F_659133125_S0VAnb5NNknokdB47K61zDsczWgZJTMf.jpg"
      );

    table
      .specificType(
        "role",
        "varchar(20) CHECK (role IN ('system_admin','admin','normal_user','store_owner'))"
      )
      .defaultTo("normal_user")
      .notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();

    table.index(knex.raw("LOWER(name)"), "idx_users_name");
    table.index(knex.raw("LOWER(email)"), "idx_users_email");
    table.index(knex.raw("LOWER(address)"), "idx_users_address");
    table.index("role", "idx_users_role");
  });

  await knex.schema.createTable("stores", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email");
    table.string("address", 400);
    table.text("description");
    table
      .text("image_url")
      .defaultTo(
        "https://static.vecteezy.com/system/resources/previews/020/662/330/non_2x/store-icon-logo-illustration-vector.jpg"
      );
    table
      .specificType(
        "category",
        "varchar(30) CHECK (category IN ('restaurant','clothing','electronics','grocery','pharmacy','others'))"
      )
      .defaultTo("others")
      .notNullable();

    table
      .integer("owner_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    table.string("phone_no", 20).defaultTo("");

    table.index(knex.raw("LOWER(name)"), "idx_stores_name");
    table.index(knex.raw("LOWER(address)"), "idx_stores_address");
    table.index("owner_id", "idx_stores_owner_id");
  });

  await knex.schema.createTable("ratings", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("store_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("stores")
      .onDelete("CASCADE");

    table.smallint("rating").notNullable();
    table.text("review");

    table
      .integer("parent_review_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("ratings")
      .onDelete("CASCADE");

    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();

    table
      .unique(["user_id", "store_id"], "unique_user_store")
      .whereNull("parent_review_id");
  });

  await knex.schema.createTable("store_reactions", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("store_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("stores")
      .onDelete("CASCADE");
    table
      .specificType(
        "reaction",
        "varchar(10) CHECK (reaction IN ('like','dislike'))"
      )
      .notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.unique(["user_id", "store_id"]);
  });

  console.log("done");
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("store_reactions");
  await knex.schema.dropTableIfExists("ratings");
  await knex.schema.dropTableIfExists("stores");
  await knex.schema.dropTableIfExists("users");
};
