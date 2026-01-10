# DWCC 工程管理 App

跨平台手機 App (iOS/Android) 使用 Expo (React Native) + Expo Router 開發。

## 安裝依賴

```bash
npm install
```

## 啟動開發伺服器

```bash
npm start
```

或使用：

```bash
npx expo start
```

## 預覽方式

### iOS 模擬器
```bash
npm run ios
# 或
npx expo start --ios
```

### Android 模擬器
```bash
npm run android
# 或
npx expo start --android
```

### 實體裝置
1. 在 App Store (iOS) 或 Google Play (Android) 下載「Expo Go」App
2. 執行 `npm start` 後會顯示 QR Code
3. 使用 Expo Go 掃描 QR Code 即可預覽

### Web 瀏覽器
```bash
npm run web
# 或
npx expo start --web
```

## 專案結構

```
SiteLogApp/
├── app/
│   ├── _layout.tsx    # 根佈局
│   └── index.tsx      # 首頁
├── app.json           # Expo 配置
├── package.json       # 依賴套件
└── tsconfig.json      # TypeScript 配置
```
