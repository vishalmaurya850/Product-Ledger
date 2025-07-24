import { openDB, type DBSchema, type IDBPDatabase } from "idb"

// IndexedDB utility for offline-first data management
// Provides real-time synchronization between client and server

const DB_NAME = "ProductLedgerDB"
const DB_VERSION = 1

// Define object stores with their configurations
const STORES = {
  ledger: {
    keyPath: "_id",
    indices: [
      { name: "by-customer", keyPath: "customerId", unique: false },
      { name: "by-type", keyPath: "type", unique: false },
      { name: "by-status", keyPath: "status", unique: false },
      { name: "by-date", keyPath: "createdAt", unique: false },
      { name: "by-company", keyPath: "companyId", unique: false },
    ],
  },
  customers: {
    keyPath: "_id",
    indices: [
      { name: "by-name", keyPath: "name", unique: false },
      { name: "by-email", keyPath: "email", unique: false },
      { name: "by-company", keyPath: "companyId", unique: false },
    ],
  },
  products: {
    keyPath: "_id",
    indices: [
      { name: "by-name", keyPath: "name", unique: false },
      { name: "by-category", keyPath: "category", unique: false },
      { name: "by-company", keyPath: "companyId", unique: false },
    ],
  },
  settings: {
    keyPath: "_id",
    indices: [],
  },
  sync_queue: {
    keyPath: "id",
    indices: [
      { name: "by-status", keyPath: "status", unique: false },
      { name: "by-timestamp", keyPath: "timestamp", unique: false },
    ],
  },
  cache: {
    keyPath: "key",
    indices: [{ name: "by-expiry", keyPath: "expiry", unique: false }],
  },
}

// Define the database schema
interface ProductLedgerDB extends DBSchema {
  ledger: {
    key: string
    value: {
      _id: string
      companyId: string
      customerId: string
      productId?: string
      type: "Sell" | "Buy" | "Payment In" | "Payment Out"
      amount: number
      currency: string
      description: string
      status: "Pending" | "Paid" | "Overdue" | "Partially Paid"
      dueDate?: Date
      settledAt?: Date
      createdAt: Date
      updatedAt: Date
      isDeleted?: boolean
      lastSynced?: Date
    }
    indexes: {
      "by-customer": string
      "by-type": string
      "by-status": string
      "by-date": Date
      "by-company": string
    }
  }
  customers: {
    key: string
    value: {
      _id: string
      companyId: string
      name: string
      email: string
      phone: string
      address: string
      creditSettings: {
        creditLimit: number
        paymentTerms: number
        interestRate: number
        fineAmount: number
      }
      balance: number
      createdAt: Date
      updatedAt: Date
      isDeleted?: boolean
      lastSynced?: Date
    }
    indexes: {
      "by-name": string
      "by-email": string
      "by-company": string
    }
  }
  products: {
    key: string
    value: {
      _id: string
      companyId: string
      name: string
      description: string
      price: number
      stock: number
      category: string
      createdAt: Date
      updatedAt: Date
      isDeleted?: boolean
      lastSynced?: Date
    }
    indexes: {
      "by-name": string
      "by-category": string
      "by-company": string
    }
  }
  settings: {
    key: string
    value: {
      _id: string
      companyId: string
      overdueSettings: {
        gracePeriod: number
        interestRate: number
        fineAmount: number
        compoundingFrequency: "daily" | "weekly" | "monthly"
      }
      emailSettings: {
        enabled: boolean
        reminderDays: number[]
      }
      lastSynced?: Date
    }
  }
  sync_queue: {
    key: string
    value: {
      id: string
      operation: "create" | "update" | "delete"
      storeName: string
      data: any
      timestamp: Date
      retryCount: number
      status: "pending" | "syncing" | "completed" | "error"
      error?: string
    }
    indexes: {
      "by-status": string
      "by-timestamp": Date
    }
  }
  cache: {
    key: string
    value: {
      key: string
      data: any
      expiry: Date
      lastAccessed: Date
    }
    indexes: {
      "by-expiry": Date
    }
  }
}

class IndexedDBManager {
  private db: IDBPDatabase<ProductLedgerDB> | null = null
  private isOnline = navigator.onLine
  private syncInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeDB()
    this.setupEventListeners()
    this.startSyncProcess()
  }

  private async initializeDB(): Promise<void> {
    try {
      this.db = await openDB<ProductLedgerDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Ledger store
          if (!db.objectStoreNames.contains("ledger")) {
            const ledgerStore = db.createObjectStore("ledger", { keyPath: "_id" })
            ledgerStore.createIndex("by-customer", "customerId")
            ledgerStore.createIndex("by-type", "type")
            ledgerStore.createIndex("by-status", "status")
            ledgerStore.createIndex("by-date", "createdAt")
            ledgerStore.createIndex("by-company", "companyId")
          }

          // Customers store
          if (!db.objectStoreNames.contains("customers")) {
            const customersStore = db.createObjectStore("customers", { keyPath: "_id" })
            customersStore.createIndex("by-name", "name")
            customersStore.createIndex("by-email", "email")
            customersStore.createIndex("by-company", "companyId")
          }

          // Products store
          if (!db.objectStoreNames.contains("products")) {
            const productsStore = db.createObjectStore("products", { keyPath: "_id" })
            productsStore.createIndex("by-name", "name")
            productsStore.createIndex("by-category", "category")
            productsStore.createIndex("by-company", "companyId")
          }

          // Settings store
          if (!db.objectStoreNames.contains("settings")) {
            db.createObjectStore("settings", { keyPath: "_id" })
          }

          // Sync queue store
          if (!db.objectStoreNames.contains("sync_queue")) {
            const syncStore = db.createObjectStore("sync_queue", { keyPath: "id" })
            syncStore.createIndex("by-status", "status")
            syncStore.createIndex("by-timestamp", "timestamp")
          }

          // Cache store
          if (!db.objectStoreNames.contains("cache")) {
            const cacheStore = db.createObjectStore("cache", { keyPath: "key" })
            cacheStore.createIndex("by-expiry", "expiry")
          }
        },
      })
    } catch (error) {
      console.error("Failed to initialize IndexedDB:", error)
    }
  }

  private setupEventListeners(): void {
    window.addEventListener("online", () => {
      this.isOnline = true
      this.syncPendingOperations()
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
    })

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      if (this.syncInterval) {
        clearInterval(this.syncInterval)
      }
    })
  }

  private startSyncProcess(): void {
    // Sync every 30 seconds when online
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncPendingOperations()
      }
    }, 30000)
  }

  // CRUD and utility methods moved out of startSyncProcess and into the class scope

  async addItem<T extends keyof ProductLedgerDB>(storeName: T, data: ProductLedgerDB[T]["value"]): Promise<void> {
    if (!this.db) await this.initializeDB()
    if (!this.db) throw new Error("Database not initialized")

    try {
      // Add to local database
      await this.db.add(storeName as any, data)

      // Add to sync queue if online
      if (this.isOnline) {
        await this.addToSyncQueue("create", storeName as string, data)
      }
    } catch (error) {
      console.error(`Failed to add item to ${String(storeName)}:`, error)
      throw error
    }
  }

  async updateItem<T extends keyof ProductLedgerDB>(storeName: T, data: ProductLedgerDB[T]["value"]): Promise<void> {
    if (!this.db) await this.initializeDB()
    if (!this.db) throw new Error("Database not initialized")

    try {
      // Update in local database
      await this.db.put(storeName as any, data)

      // Add to sync queue if online
      if (this.isOnline) {
        await this.addToSyncQueue("update", storeName as string, data)
      }
    } catch (error) {
      console.error(`Failed to update item in ${String(storeName)}:`, error)
      throw error
    }
  }

  async deleteItem<T extends keyof ProductLedgerDB>(storeName: T, id: string): Promise<void> {
    if (!this.db) await this.initializeDB()
    if (!this.db) throw new Error("Database not initialized")

    try {
      // Mark as deleted instead of actually deleting
      const item = await this.db.get(storeName as any, id)
      if (item) {
        const updatedItem = { ...item, isDeleted: true, updatedAt: new Date() }
        await this.db.put(storeName as any, updatedItem)

        // Add to sync queue if online
        if (this.isOnline) {
          await this.addToSyncQueue("delete", storeName as string, { _id: id })
        }
      }
    } catch (error) {
      console.error(`Failed to delete item from ${String(storeName)}:`, error)
      throw error
    }
  }

  async getItemById<T extends keyof ProductLedgerDB>(
    storeName: T,
    id: string,
  ): Promise<ProductLedgerDB[T]["value"] | undefined> {
    if (!this.db) await this.initializeDB()
    if (!this.db) throw new Error("Database not initialized")

    try {
      const item = await this.db.get(storeName as any, id)
      // Only filter isDeleted if the item has that property
      if (item && "isDeleted" in item) {
        return !(item as any).isDeleted ? item : undefined
      }
      return item
    } catch (error) {
      console.error(`Failed to get item from ${String(storeName)}:`, error)
      return undefined
    }
  }

  async getAllItems<T extends keyof ProductLedgerDB>(
    storeName: T,
    companyId?: string,
  ): Promise<ProductLedgerDB[T]["value"][]> {
    if (!this.db) await this.initializeDB()
    if (!this.db) throw new Error("Database not initialized")

    try {
      let items: ProductLedgerDB[T]["value"][]

      if (companyId && storeName !== "sync_queue" && storeName !== "cache") {
        // Use company index if available
        const tx = this.db.transaction(storeName as any)
        const index = (tx.store as any).index("by-company")
        // Use IDBKeyRange.only for companyId
        items = await index.getAll(IDBKeyRange.only(companyId))
      } else {
        items = await this.db.getAll(storeName as any)
      }

      // Filter out deleted items if present
      return items.filter((item) => !("isDeleted" in item) || !(item as any).isDeleted)
    } catch (error) {
      console.error(`Failed to get all items from ${String(storeName)}:`, error)
      return []
    }
  }

  async searchItems<T extends keyof ProductLedgerDB>(
    storeName: T,
    query: string,
    fields: string[],
  ): Promise<ProductLedgerDB[T]["value"][]> {
    const items = await this.getAllItems(storeName)
    const lowerQuery = query.toLowerCase()

    return items.filter((item) => {
      return fields.some((field) => {
        const value = (item as any)[field]
        return value && value.toString().toLowerCase().includes(lowerQuery)
      })
    })
  }

  // Sync Queue Operations
  private async addToSyncQueue(operation: "create" | "update" | "delete", storeName: string, data: any): Promise<void> {
    if (!this.db) return

    const queueItem = {
      id: `${operation}_${storeName}_${data._id}_${Date.now()}`,
      operation,
      storeName,
      data,
      timestamp: new Date(),
      retryCount: 0,
      status: "pending" as const,
    }

    await this.db.add("sync_queue", queueItem)
  }

  private async syncPendingOperations(): Promise<void> {
    if (!this.db || !this.isOnline) return

    try {
      const pendingItems = await this.db.getAllFromIndex("sync_queue", "by-status", "pending")

      for (const item of pendingItems) {
        try {
          await this.syncSingleItem(item)
        } catch (error) {
          console.error("Failed to sync item:", error)
          await this.handleSyncError(item, error as Error)
        }
      }
    } catch (error) {
      console.error("Failed to sync pending operations:", error)
    }
  }

  private async syncSingleItem(item: ProductLedgerDB["sync_queue"]["value"]): Promise<void> {
    if (!this.db) return

    // Update status to syncing
    await this.db.put("sync_queue", { ...item, status: "syncing" })

    const endpoint = this.getApiEndpoint(item.storeName, item.operation, item.data._id)
    const method = this.getHttpMethod(item.operation)

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: item.operation !== "delete" ? JSON.stringify(item.data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Mark as completed
    await this.db.put("sync_queue", { ...item, status: "completed" })

    // Update last synced timestamp in the original item
    if (item.operation !== "delete") {
      const originalItem = await this.db.get(item.storeName as any, item.data._id)
      if (originalItem) {
        await this.db.put(item.storeName as any, {
          ...originalItem,
          lastSynced: new Date(),
        })
      }
    }
  }

  private async handleSyncError(item: ProductLedgerDB["sync_queue"]["value"], error: Error): Promise<void> {
    if (!this.db) return

    const maxRetries = 3
    const updatedItem = {
      ...item,
      retryCount: item.retryCount + 1,
      status: item.retryCount + 1 >= maxRetries ? ("error" as const) : ("pending" as const),
      error: error.message,
    }

    await this.db.put("sync_queue", updatedItem)
  }

  private getApiEndpoint(storeName: string, operation: string, id?: string): string {
    const baseUrl = "/api"

    switch (storeName) {
      case "ledger":
        return operation === "delete" || operation === "update" ? `${baseUrl}/ledger/${id}` : `${baseUrl}/ledger`
      case "customers":
        return operation === "delete" || operation === "update" ? `${baseUrl}/customers/${id}` : `${baseUrl}/customers`
      case "products":
        return operation === "delete" || operation === "update" ? `${baseUrl}/products/${id}` : `${baseUrl}/products`
      default:
        throw new Error(`Unknown store name: ${storeName}`)
    }
  }

  private getHttpMethod(operation: string): string {
    switch (operation) {
      case "create":
        return "POST"
      case "update":
        return "PUT"
      case "delete":
        return "DELETE"
      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }

  // Cache Operations
  async getCachedData(key: string): Promise<any> {
    if (!this.db) await this.initializeDB()
    if (!this.db) return null

    try {
      const cached = await this.db.get("cache", key)

      if (!cached || cached.expiry < new Date()) {
        // Remove expired cache
        if (cached) {
          await this.db.delete("cache", key)
        }
        return null
      }

      // Update last accessed
      await this.db.put("cache", {
        ...cached,
        lastAccessed: new Date(),
      })

      return cached.data
    } catch (error) {
      console.error("Failed to get cached data:", error)
      return null
    }
  }

  async setCachedData(key: string, data: any, ttlMinutes = 5): Promise<void> {
    if (!this.db) await this.initializeDB()
    if (!this.db) return

    try {
      const expiry = new Date()
      expiry.setMinutes(expiry.getMinutes() + ttlMinutes)

      await this.db.put("cache", {
        key,
        data,
        expiry,
        lastAccessed: new Date(),
      })
    } catch (error) {
      console.error("Failed to set cached data:", error)
    }
  }

  private async cleanupExpiredCache(): Promise<void> {
    if (!this.db) return

    try {
      const now = new Date()
      const expiredItems = await this.db.getAllFromIndex("cache", "by-expiry", IDBKeyRange.upperBound(now))

      for (const item of expiredItems) {
        await this.db.delete("cache", item.key)
      }
    } catch (error) {
      console.error("Failed to cleanup expired cache:", error)
    }
  }

  // Batch operation utility (if needed)
  async batchOperation(
    operations: {
      operation: "add" | "update" | "delete"
      storeName: keyof ProductLedgerDB
      data: any
    }[],
  ): Promise<void> {
    if (!this.db) await this.initializeDB()
    if (!this.db) throw new Error("Database not initialized")

    const uniqueStoreNames = operations.map((op) => op.storeName).filter((name, index, arr) => arr.indexOf(name) === index)
    const tx = this.db.transaction(uniqueStoreNames as any, "readwrite")

    try {
      for (const op of operations) {
        const store = tx.objectStore(op.storeName as any)

        switch (op.operation) {
          case "add":
            await store.add(op.data)
            break
          case "update":
            await store.put(op.data)
            break
          case "delete":
            const item = await store.get(op.data._id)
            if (item) {
              await store.put({ ...item, isDeleted: true, updatedAt: new Date() })
            }
            break
        }

        // Add to sync queue
        if (this.isOnline) {
          await this.addToSyncQueue(
            op.operation === "add" ? "create" : op.operation === "update" ? "update" : "delete",
            op.storeName as string,
            op.data,
          )
        }
      }

      await tx.done
    } catch (error) {
      console.error("Batch operation failed:", error)
      throw error
    }
  }

  async getSyncStatus(): Promise<{ pending: number; syncing: number; completed: number; error: number }> {
    if (!this.db) await this.initializeDB()
    if (!this.db) return { pending: 0, syncing: 0, completed: 0, error: 0 }

    try {
      const [pending, syncing, completed, error] = await Promise.all([
        this.db.getAllFromIndex("sync_queue", "by-status", "pending"),
        this.db.getAllFromIndex("sync_queue", "by-status", "syncing"),
        this.db.getAllFromIndex("sync_queue", "by-status", "completed"),
        this.db.getAllFromIndex("sync_queue", "by-status", "error"),
      ])

      return {
        pending: pending.length,
        syncing: syncing.length,
        completed: completed.length,
        error: error.length,
      }
    } catch (error) {
      console.error("Failed to get sync status:", error)
      return { pending: 0, syncing: 0, completed: 0, error: 0 }
    }
  }

  async clearCompletedSyncItems(): Promise<void> {
    if (!this.db) return

    try {
      const completed = await this.db.getAllFromIndex("sync_queue", "by-status", "completed")

      for (const item of completed) {
        await this.db.delete("sync_queue", item.id)
      }
    } catch (error) {
      console.error("Failed to clear completed sync items:", error)
    }
  }

  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
      }
    }
    return { used: 0, quota: 0 }
  }

  // Force sync all data from server
  async forceSyncFromServer(companyId: string): Promise<void> {
    if (!this.isOnline) {
      throw new Error("Cannot sync from server while offline")
    }

    try {
      // Fetch all data from server
      const [ledgerData, customersData, productsData] = await Promise.all([
        fetch(`/api/ledger?companyId=${companyId}`).then((r) => r.json()),
        fetch(`/api/customers?companyId=${companyId}`).then((r) => r.json()),
        fetch(`/api/products?companyId=${companyId}`).then((r) => r.json()),
      ])

      // Clear local data and replace with server data
      if (this.db) {
        const tx = this.db.transaction(["ledger", "customers", "products"], "readwrite")

        // Clear existing data
        await Promise.all([
          tx.objectStore("ledger").clear(),
          tx.objectStore("customers").clear(),
          tx.objectStore("products").clear(),
        ])

        // Add server data
        for (const item of ledgerData) {
          await tx.objectStore("ledger").add({ ...item, lastSynced: new Date() })
        }
        for (const item of customersData) {
          await tx.objectStore("customers").add({ ...item, lastSynced: new Date() })
        }
        for (const item of productsData) {
          await tx.objectStore("products").add({ ...item, lastSynced: new Date() })
        }

        await tx.done
      }
    } catch (error) {
      console.error("Failed to force sync from server:", error)
      throw error
    }
  }
}

// Create singleton instance
const indexedDBManager = new IndexedDBManager()

// Export convenience functions
export const addItem = indexedDBManager.addItem.bind(indexedDBManager)
export const updateItem = indexedDBManager.updateItem.bind(indexedDBManager)
export const deleteItem = indexedDBManager.deleteItem.bind(indexedDBManager)
export const getItemById = indexedDBManager.getItemById.bind(indexedDBManager)
export const getAllItems = indexedDBManager.getAllItems.bind(indexedDBManager)
export const searchItems = indexedDBManager.searchItems.bind(indexedDBManager)
export const getCachedData = indexedDBManager.getCachedData.bind(indexedDBManager)
export const setCachedData = indexedDBManager.setCachedData.bind(indexedDBManager)
export const batchOperation = indexedDBManager.batchOperation.bind(indexedDBManager)
export const getSyncStatus = indexedDBManager.getSyncStatus.bind(indexedDBManager)
export const clearCompletedSyncItems = indexedDBManager.clearCompletedSyncItems.bind(indexedDBManager)
export const getStorageUsage = indexedDBManager.getStorageUsage.bind(indexedDBManager)
export const forceSyncFromServer = indexedDBManager.forceSyncFromServer.bind(indexedDBManager)

export default indexedDBManager
