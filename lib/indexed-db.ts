// This file would contain the IndexedDB setup and utility functions
// For demonstration purposes, we're showing a simplified version

const DB_NAME = "product_ledger"
const DB_VERSION = 1

// Define the object stores (tables) and their key paths
const STORES = {
  ledger: { keyPath: "id", indices: ["date", "type", "status"] },
  products: { keyPath: "id", indices: ["name", "sku", "category"] },
  customers: { keyPath: "id", indices: ["name", "email"] },
  settings: { keyPath: "id" },
}

// Initialize the IndexedDB database
export async function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    // Create object stores when the database is first created or upgraded
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object stores and indices
      Object.entries(STORES).forEach(([storeName, storeConfig]) => {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, { keyPath: storeConfig.keyPath })

          // Create indices for faster querying
          if ('indices' in storeConfig && storeConfig.indices) {
            storeConfig.indices.forEach((indexName: string) => {
              store.createIndex(indexName, indexName, { unique: false })
            })
          }
        }
      })
    }

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      resolve(db)
    }

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error)
    }
  })
}

// Generic function to add an item to an object store
export async function addItem<T>(storeName: string, item: T) {
  const db = (await initIndexedDB()) as IDBDatabase

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.add(item)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Generic function to get all items from an object store
export async function getAllItems(storeName: string) {
  const db = (await initIndexedDB()) as IDBDatabase

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Generic function to get an item by its ID
export async function getItemById(storeName: string, id: string) {
  const db = (await initIndexedDB()) as IDBDatabase

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Generic function to update an item
export async function updateItem<T>(storeName: string, item: T) {
  const db = (await initIndexedDB()) as IDBDatabase

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.put(item)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Generic function to delete an item by its ID
export async function deleteItem(storeName: string, id: string) {
  const db = (await initIndexedDB()) as IDBDatabase

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.delete(id)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)

    transaction.oncomplete = () => db.close()
  })
}

// Function to sync data with the server
export async function syncWithServer(storeName: string) {
  // Get all items from IndexedDB
  const items = (await getAllItems(storeName)) as unknown[]

  // Send items to the server
  try {
    const response = await fetch(`/api/${storeName}/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    })

    if (!response.ok) {
      throw new Error(`Failed to sync ${storeName}`)
    }

    // Get updated data from the server
    const updatedData = await response.json()

    // Update local IndexedDB with the server data
    for (const item of updatedData) {
      await updateItem(storeName, item)
    }

    return updatedData
  } catch (error) {
    console.error(`Error syncing ${storeName}:`, error)
    throw error
  }
}
