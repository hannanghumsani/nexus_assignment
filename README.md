# 🚀 Bahrain Event Attendee Dashboard

A high-performance, secure, and aesthetically pleasing dashboard built with **Next.js** and **Node.js**. This application is designed to manage event registrations with a focus on speed, data security, and localized user experience.



## 🌟 Key Features


-   **🔐 Secure Data Transmission:** End-to-end encryption using **AES-256**. Data is encrypted on the Express backend and decrypted only when it reaches the client.
-   **📊 Real-time Analytics:**
    * **Gender Distribution:** Pie chart showing Male/Female counts and percentages.
    * **Registration Trends:** Line chart tracking daily sign-ups.
-   **📱 Fully Responsive:** Optimized for desktop, tablet, and mobile views.

---

## 🚀 Performance Optimizations (Lighthouse 90+)

To achieve industry-leading performance, the following techniques were used:

1.  **Code Splitting & Lazy Loading:** Heavy charting libraries (Chart.js) are loaded dynamically using `next/dynamic` to keep the initial JS bundle small.
2.  **Memoization:** Critical data filtering and chart calculations are wrapped in `useMemo` and `useCallback` to prevent unnecessary re-renders.
3.  **Payload Compression:** Implemented Gzip/Brotli compression at the server level.



---

## 🛠️ Installation & Setup

### 1. Backend (API & Encryption)
```bash
cd server
npm install
node index.js

### 2. Frontend

```bash
cd client
npm install
npm run dev