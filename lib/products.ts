// 상품 저장소 (Turso 데이터베이스의 products 테이블). 서버에서만 사용합니다.
// 처음 실행될 때 예전 저장소(Upstash Redis)의 상품을 한 번만 그대로 옮겨 옵니다.
// Redis의 원래 데이터는 지우지 않고 백업으로 남겨 둡니다.
import { execute } from "./turso";
import { readDb, redisConfigured } from "./db";
import type { Product, ProductStatus, Target } from "./types";

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT '',
    tagline TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image_url TEXT NOT NULL DEFAULT '',
    price INTEGER NOT NULL,
    original_price INTEGER,
    badges TEXT NOT NULL DEFAULT '[]',
    targets TEXT NOT NULL DEFAULT '[]',
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    cold_chain INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  "CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
];

const MIGRATED_KEY = "products_imported_from_redis";

const COLS =
  "id, name, region, tagline, description, image_url, price, original_price, badges, targets, stock, status, cold_chain, sort_order, created_at, updated_at";

function insertStmt(p: Product, sortOrder: number, orIgnore = false) {
  return {
    sql: `INSERT ${orIgnore ? "OR IGNORE " : ""}INTO products (${COLS}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      p.id,
      p.name,
      p.region ?? "",
      p.tagline ?? "",
      p.description ?? "",
      p.imageUrl ?? "",
      p.price,
      p.originalPrice ?? null,
      JSON.stringify(p.badges ?? []),
      JSON.stringify(p.targets ?? []),
      p.stock,
      p.status,
      p.coldChain ? 1 : 0,
      sortOrder,
      p.createdAt,
      p.updatedAt,
    ],
  };
}

function parseList(s: string | null): string[] {
  try {
    const v = JSON.parse(s ?? "[]");
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function toProduct(r: Record<string, string | null>): Product {
  return {
    id: r.id ?? "",
    name: r.name ?? "",
    region: r.region ?? "",
    tagline: r.tagline ?? "",
    description: r.description ?? "",
    imageUrl: r.image_url ?? "",
    price: Number(r.price ?? 0),
    originalPrice: r.original_price === null || r.original_price === undefined ? null : Number(r.original_price),
    badges: parseList(r.badges),
    targets: parseList(r.targets) as Target[],
    stock: Number(r.stock ?? 0),
    status: (r.status === "hidden" ? "hidden" : "active") as ProductStatus,
    coldChain: r.cold_chain === "1",
    createdAt: r.created_at ?? "",
    updatedAt: r.updated_at ?? "",
  };
}

/** Redis → Turso 상품 옮기기 (한 번만). 옮긴 뒤에는 app_meta 에 표시해 두어 다시 하지 않습니다. */
async function importFromRedisOnce() {
  const [meta] = await execute([{ sql: "SELECT value FROM app_meta WHERE key = ?", args: [MIGRATED_KEY] }]);
  if (meta.length > 0) return;
  // Redis가 연결된 곳(실제 사이트)에서만 옮깁니다. 내 컴퓨터의 시험용 데이터가 섞이지 않도록.
  if (!redisConfigured()) {
    throw new Error("상품 데이터를 아직 Turso로 옮기지 않았습니다. 실제 사이트(Vercel)에서 한 번 열면 자동으로 옮겨집니다.");
  }
  const { products } = await readDb();
  await execute([
    { sql: "BEGIN" },
    ...products.map((p, i) => insertStmt(p, i, true)),
    {
      sql: "INSERT OR IGNORE INTO app_meta (key, value) VALUES (?, ?)",
      args: [MIGRATED_KEY, `${new Date().toISOString()} · ${products.length}개`],
    },
    { sql: "COMMIT" },
  ]);
  console.log(`상품 ${products.length}개를 Redis에서 Turso로 옮겼습니다.`);
}

let ready: Promise<unknown> | null = null;
function ensureProducts() {
  ready ??= execute(SCHEMA.map((sql) => ({ sql })))
    .then(importFromRedisOnce)
    .catch((e) => {
      ready = null;
      throw e;
    });
  return ready;
}

// ── 읽기 ──────────────────────────────────────────────

/** 전체 상품 (관리자용, 숨김 포함). 목록 순서: 최근 등록한 상품이 위 */
export async function listProducts(): Promise<Product[]> {
  await ensureProducts();
  const [rows] = await execute([{ sql: `SELECT ${COLS} FROM products ORDER BY sort_order ASC, created_at DESC` }]);
  return rows.map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  await ensureProducts();
  const [rows] = await execute([{ sql: `SELECT ${COLS} FROM products WHERE id = ?`, args: [id] }]);
  return rows[0] ? toProduct(rows[0]) : null;
}

// ── 쓰기 ──────────────────────────────────────────────

export type ProductFields = Omit<Product, "id" | "createdAt" | "updatedAt">;

/** 새 상품은 목록 맨 위에 놓입니다. */
export async function createProduct(fields: ProductFields) {
  await ensureProducts();
  const now = new Date().toISOString();
  const product: Product = { id: `p-${Date.now().toString(36)}`, ...fields, createdAt: now, updatedAt: now };
  const [[top]] = await execute([{ sql: "SELECT COALESCE(MIN(sort_order), 0) AS m FROM products" }]);
  await execute([insertStmt(product, Number(top?.m ?? 0) - 1)]);
  return product;
}

/** 수정. 상품이 없으면 false */
export async function updateProduct(id: string, f: ProductFields) {
  await ensureProducts();
  const [rows] = await execute([
    {
      sql: `UPDATE products SET name = ?, region = ?, tagline = ?, description = ?, image_url = ?, price = ?,
              original_price = ?, badges = ?, targets = ?, stock = ?, status = ?, cold_chain = ?, updated_at = ?
            WHERE id = ? RETURNING id`,
      args: [
        f.name,
        f.region,
        f.tagline,
        f.description,
        f.imageUrl,
        f.price,
        f.originalPrice,
        JSON.stringify(f.badges),
        JSON.stringify(f.targets),
        f.stock,
        f.status,
        f.coldChain ? 1 : 0,
        new Date().toISOString(),
        id,
      ],
    },
  ]);
  return rows.length > 0;
}

export async function toggleProduct(id: string) {
  await ensureProducts();
  await execute([
    {
      sql: "UPDATE products SET status = CASE status WHEN 'active' THEN 'hidden' ELSE 'active' END, updated_at = ? WHERE id = ?",
      args: [new Date().toISOString(), id],
    },
  ]);
}

export async function removeProduct(id: string) {
  await ensureProducts();
  await execute([{ sql: "DELETE FROM products WHERE id = ?", args: [id] }]);
}

/** 결제완료 시 재고 1개 차감 (0 아래로는 내려가지 않음) */
export async function decreaseStock(id: string) {
  await ensureProducts();
  await execute([
    {
      sql: "UPDATE products SET stock = MAX(0, stock - 1), updated_at = ? WHERE id = ?",
      args: [new Date().toISOString(), id],
    },
  ]);
}
