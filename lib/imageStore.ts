import { openDB, DBSchema, IDBPDatabase } from "idb";

interface ImageRecord {
  id: string;
  userId: string;
  name: string;
  tags: string[];
  createdAt: string;
  blob: Blob;
}

interface ImageDB extends DBSchema {
  images: {
    key: string;
    value: ImageRecord;
    indexes: { "by-user": string };
  };
}

const DB_NAME = "image-uploader-db";
const DB_VERSION = 1;
const STORE_NAME = "images";

let dbPromise: Promise<IDBPDatabase<ImageDB>> | null = null;

function getDB(): Promise<IDBPDatabase<ImageDB>> {
  if (!dbPromise) {
    dbPromise = openDB<ImageDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("by-user", "userId");
        }
      },
    });
  }
  return dbPromise;
}

export async function addImages(
  userId: string,
  files: File[]
): Promise<ImageRecord[]> {
  const db = await getDB();
  const records: ImageRecord[] = [];

  for (const file of files) {
    const record: ImageRecord = {
      id: crypto.randomUUID(),
      userId,
      name: file.name,
      tags: [],
      createdAt: new Date().toISOString(),
      blob: file,
    };
    
    await db.add(STORE_NAME, record);
    records.push(record);
  }

  return records;
}

export async function listImages(userId: string): Promise<Omit<ImageRecord, "blob">[]> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const index = tx.store.index("by-user");
  const records = await index.getAll(userId);

  // Return without blob for list view (more efficient)
  return records.map(({ blob, ...rest }) => rest);
}

export async function getImageBlob(id: string): Promise<Blob | null> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, id);
  return record?.blob || null;
}

export async function deleteImage(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function renameImage(id: string, name: string): Promise<void> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, id);
  
  if (record) {
    record.name = name;
    await db.put(STORE_NAME, record);
  }
}

export async function updateTags(id: string, tags: string[]): Promise<void> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, id);
  
  if (record) {
    record.tags = tags;
    await db.put(STORE_NAME, record);
  }
}

export async function getImage(id: string): Promise<ImageRecord | null> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, id);
  return record || null;
}
