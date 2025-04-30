// This file contains permissions that can be imported by both client and server components

export const availablePermissions = [
    { name: "ledger_view", description: "View ledger entries", module: "ledger", action: "view" },
    { name: "ledger_create", description: "Create ledger entries", module: "ledger", action: "create" },
    { name: "ledger_edit", description: "Edit ledger entries", module: "ledger", action: "edit" },
    { name: "ledger_delete", description: "Delete ledger entries", module: "ledger", action: "delete" },
  
    { name: "products_view", description: "View products", module: "products", action: "view" },
    { name: "products_create", description: "Create products", module: "products", action: "create" },
    { name: "products_edit", description: "Edit products", module: "products", action: "edit" },
    { name: "products_delete", description: "Delete products", module: "products", action: "delete" },
  
    { name: "customers_view", description: "View customers", module: "customers", action: "view" },
    { name: "customers_create", description: "Create customers", module: "customers", action: "create" },
    { name: "customers_edit", description: "Edit customers", module: "customers", action: "edit" },
    { name: "customers_delete", description: "Delete customers", module: "customers", action: "delete" },
  
    { name: "users_view", description: "View users", module: "users", action: "view" },
    { name: "users_create", description: "Create users", module: "users", action: "create" },
    { name: "users_edit", description: "Edit users", module: "users", action: "edit" },
    { name: "users_delete", description: "Delete users", module: "users", action: "delete" },
  
    { name: "reports_view", description: "View reports", module: "reports", action: "view" },
  
    { name: "settings_view", description: "View settings", module: "settings", action: "view" },
    { name: "settings_edit", description: "Edit settings", module: "settings", action: "edit" },
  ]  