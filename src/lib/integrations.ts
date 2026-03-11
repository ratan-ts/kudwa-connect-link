import type { Integration } from "@/types/integration";

export const INTEGRATIONS: Integration[] = [
  {
    id: "wafeq",
    name: "Wafeq",
    description: "Accounting and e-invoicing for the Middle East",
    category: "Accounting",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd8u8bwQuRHUj74sFItmkfqwV9pDSoFvvK1g&s",
  },
  {
    id: "quickbooks-sandbox",
    name: "Quickbooks Sandbox",
    description: "QuickBooks testing environment",
    category: "Accounting",
    logo: "https://1000logos.net/wp-content/uploads/2023/05/QuickBooks-Emblem.png",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "QuickBooks Online accounting",
    category: "Accounting",
    logo: "https://1000logos.net/wp-content/uploads/2023/05/QuickBooks-Emblem.png",
  },
];
