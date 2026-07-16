const crypto = require("crypto");
const { nanoid } = require("nanoid");

function nowIso() {
  return new Date().toISOString();
}

function mapPurchase(row) {
  if (!row) return null;
  return {
    id: row.id,
    stripeSessionId: row.stripe_session_id,
    checkoutStatus: row.checkout_status,
    paymentStatus: row.payment_status,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    amountTotal: Number(row.amount_total || 0),
    currency: row.currency,
    productSku: row.product_sku,
    downloadToken: row.download_token,
    downloadCount: Number(row.download_count || 0),
    deliveryEmailSentAt: row.delivery_email_sent_at || null,
    fulfilledAt: row.fulfilled_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function createDownloadToken() {
  return crypto.randomBytes(24).toString("hex");
}

function normalizeCurrency(value) {
  return String(value || "usd").trim().toLowerCase();
}

function createSqliteAdapter(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS storefront_purchases (
      id TEXT PRIMARY KEY,
      stripe_session_id TEXT NOT NULL UNIQUE,
      checkout_status TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      customer_email TEXT,
      customer_name TEXT,
      amount_total INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'usd',
      product_sku TEXT NOT NULL,
      download_token TEXT NOT NULL,
      download_count INTEGER NOT NULL DEFAULT 0,
      delivery_email_sent_at TEXT,
      fulfilled_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_storefront_purchases_customer_email ON storefront_purchases(customer_email);
  `);

  const purchaseBySessionStmt = db.prepare(`SELECT * FROM storefront_purchases WHERE stripe_session_id = ?`);
  const purchaseByIdStmt = db.prepare(`SELECT * FROM storefront_purchases WHERE id = ?`);
  const purchaseByIdAndTokenStmt = db.prepare(`SELECT * FROM storefront_purchases WHERE id = ? AND download_token = ?`);
  const insertPurchaseStmt = db.prepare(`
    INSERT INTO storefront_purchases (
      id, stripe_session_id, checkout_status, payment_status, customer_email, customer_name,
      amount_total, currency, product_sku, download_token, download_count,
      delivery_email_sent_at, fulfilled_at, created_at, updated_at
    )
    VALUES (
      @id, @stripeSessionId, @checkoutStatus, @paymentStatus, @customerEmail, @customerName,
      @amountTotal, @currency, @productSku, @downloadToken, 0,
      @deliveryEmailSentAt, @fulfilledAt, @createdAt, @updatedAt
    )
  `);
  const updatePurchaseStmt = db.prepare(`
    UPDATE storefront_purchases
    SET checkout_status = @checkoutStatus,
        payment_status = @paymentStatus,
        customer_email = @customerEmail,
        customer_name = @customerName,
        amount_total = @amountTotal,
        currency = @currency,
        product_sku = @productSku,
        updated_at = @updatedAt,
        fulfilled_at = COALESCE(@fulfilledAt, fulfilled_at)
    WHERE stripe_session_id = @stripeSessionId
  `);
  const incrementDownloadStmt = db.prepare(`
    UPDATE storefront_purchases
    SET download_count = download_count + 1,
        updated_at = @updatedAt
    WHERE id = @id
  `);
  const markDeliveryStmt = db.prepare(`
    UPDATE storefront_purchases
    SET delivery_email_sent_at = @deliveryEmailSentAt,
        updated_at = @updatedAt
    WHERE id = @id
  `);

  return {
    async getBySessionId(sessionId) {
      return purchaseBySessionStmt.get(sessionId) || null;
    },
    async getById(id) {
      return purchaseByIdStmt.get(id) || null;
    },
    async getByIdAndToken(id, token) {
      return purchaseByIdAndTokenStmt.get(id, token) || null;
    },
    async upsertPurchase(input) {
      const existing = purchaseBySessionStmt.get(input.stripeSessionId);
      if (!existing) {
        const row = {
          id: nanoid(12),
          stripeSessionId: input.stripeSessionId,
          checkoutStatus: input.checkoutStatus,
          paymentStatus: input.paymentStatus,
          customerEmail: input.customerEmail,
          customerName: input.customerName,
          amountTotal: Number(input.amountTotal || 0),
          currency: normalizeCurrency(input.currency),
          productSku: input.productSku,
          downloadToken: createDownloadToken(),
          deliveryEmailSentAt: null,
          fulfilledAt: input.fulfilledAt || null,
          createdAt: nowIso(),
          updatedAt: nowIso()
        };
        insertPurchaseStmt.run(row);
        return purchaseBySessionStmt.get(input.stripeSessionId);
      }

      updatePurchaseStmt.run({
        stripeSessionId: input.stripeSessionId,
        checkoutStatus: input.checkoutStatus,
        paymentStatus: input.paymentStatus,
        customerEmail: input.customerEmail || existing.customer_email,
        customerName: input.customerName || existing.customer_name,
        amountTotal: Number(input.amountTotal ?? existing.amount_total ?? 0),
        currency: normalizeCurrency(input.currency || existing.currency),
        productSku: input.productSku || existing.product_sku,
        fulfilledAt: input.fulfilledAt || null,
        updatedAt: nowIso()
      });
      return purchaseBySessionStmt.get(input.stripeSessionId);
    },
    async recordDownload(id) {
      incrementDownloadStmt.run({ id, updatedAt: nowIso() });
      return purchaseByIdStmt.get(id) || null;
    },
    async markDeliveryEmailSent(id) {
      const deliveryEmailSentAt = nowIso();
      markDeliveryStmt.run({ id, deliveryEmailSentAt, updatedAt: deliveryEmailSentAt });
      return purchaseByIdStmt.get(id) || null;
    }
  };
}

function createPostgresAdapter(pool) {
  const ready = (async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS storefront_purchases (
        id TEXT PRIMARY KEY,
        stripe_session_id TEXT NOT NULL UNIQUE,
        checkout_status TEXT NOT NULL,
        payment_status TEXT NOT NULL,
        customer_email TEXT,
        customer_name TEXT,
        amount_total INTEGER NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'usd',
        product_sku TEXT NOT NULL,
        download_token TEXT NOT NULL,
        download_count INTEGER NOT NULL DEFAULT 0,
        delivery_email_sent_at TEXT,
        fulfilled_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_storefront_purchases_customer_email ON storefront_purchases(customer_email);
    `);
  })();

  return {
    async getBySessionId(sessionId) {
      await ready;
      const result = await pool.query(`SELECT * FROM storefront_purchases WHERE stripe_session_id = $1`, [sessionId]);
      return result.rows[0] || null;
    },
    async getById(id) {
      await ready;
      const result = await pool.query(`SELECT * FROM storefront_purchases WHERE id = $1`, [id]);
      return result.rows[0] || null;
    },
    async getByIdAndToken(id, token) {
      await ready;
      const result = await pool.query(`SELECT * FROM storefront_purchases WHERE id = $1 AND download_token = $2`, [id, token]);
      return result.rows[0] || null;
    },
    async upsertPurchase(input) {
      await ready;
      const existing = await this.getBySessionId(input.stripeSessionId);
      if (!existing) {
        const result = await pool.query(`
          INSERT INTO storefront_purchases (
            id, stripe_session_id, checkout_status, payment_status, customer_email, customer_name,
            amount_total, currency, product_sku, download_token, download_count,
            delivery_email_sent_at, fulfilled_at, created_at, updated_at
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,0,$11,$12,$13,$14)
          RETURNING *
        `, [
          nanoid(12),
          input.stripeSessionId,
          input.checkoutStatus,
          input.paymentStatus,
          input.customerEmail || null,
          input.customerName || null,
          Number(input.amountTotal || 0),
          normalizeCurrency(input.currency),
          input.productSku,
          createDownloadToken(),
          null,
          input.fulfilledAt || null,
          nowIso(),
          nowIso()
        ]);
        return result.rows[0] || null;
      }

      const result = await pool.query(`
        UPDATE storefront_purchases
        SET checkout_status = $1,
            payment_status = $2,
            customer_email = $3,
            customer_name = $4,
            amount_total = $5,
            currency = $6,
            product_sku = $7,
            updated_at = $8,
            fulfilled_at = COALESCE($9, fulfilled_at)
        WHERE stripe_session_id = $10
        RETURNING *
      `, [
        input.checkoutStatus,
        input.paymentStatus,
        input.customerEmail || existing.customer_email,
        input.customerName || existing.customer_name,
        Number(input.amountTotal ?? existing.amount_total ?? 0),
        normalizeCurrency(input.currency || existing.currency),
        input.productSku || existing.product_sku,
        nowIso(),
        input.fulfilledAt || null,
        input.stripeSessionId
      ]);
      return result.rows[0] || null;
    },
    async recordDownload(id) {
      await ready;
      const result = await pool.query(`
        UPDATE storefront_purchases
        SET download_count = download_count + 1,
            updated_at = $2
        WHERE id = $1
        RETURNING *
      `, [id, nowIso()]);
      return result.rows[0] || null;
    },
    async markDeliveryEmailSent(id) {
      await ready;
      const timestamp = nowIso();
      const result = await pool.query(`
        UPDATE storefront_purchases
        SET delivery_email_sent_at = $2,
            updated_at = $2
        WHERE id = $1
        RETURNING *
      `, [id, timestamp]);
      return result.rows[0] || null;
    }
  };
}

function createStorefrontService({ db, provider = "sqlite" }) {
  if (!db) throw new Error("db is required");
  const adapter = provider === "postgres" ? createPostgresAdapter(db) : createSqliteAdapter(db);

  return {
    async recordCheckoutSession(session, { productSku = "splitsheet-studio-vst" } = {}) {
      const purchase = await adapter.upsertPurchase({
        stripeSessionId: session.id,
        checkoutStatus: String(session.status || "open"),
        paymentStatus: String(session.payment_status || "unpaid"),
        customerEmail: session.customer_details?.email || session.customer_email || null,
        customerName: session.customer_details?.name || null,
        amountTotal: Number(session.amount_total || 0),
        currency: normalizeCurrency(session.currency),
        productSku,
        fulfilledAt: String(session.payment_status || "").toLowerCase() === "paid" ? nowIso() : null
      });
      return mapPurchase(purchase);
    },
    async getPurchaseBySessionId(sessionId) {
      return mapPurchase(await adapter.getBySessionId(sessionId));
    },
    async getPurchaseById(id) {
      return mapPurchase(await adapter.getById(id));
    },
    async getPurchaseByIdAndToken(id, token) {
      return mapPurchase(await adapter.getByIdAndToken(id, token));
    },
    async recordDownload(id) {
      return mapPurchase(await adapter.recordDownload(id));
    },
    async markDeliveryEmailSent(id) {
      return mapPurchase(await adapter.markDeliveryEmailSent(id));
    }
  };
}

module.exports = {
  createStorefrontService
};
