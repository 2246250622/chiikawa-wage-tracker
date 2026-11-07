# Chiikawa 即時工資增長器 🐹

Tampermonkey 腳本：開著瀏覽器就有會動的 Chiikawa 陪你計算工資進度。

輸股票沒動力？讓 Chiikawa 幫你即時顯示「這個月已經賺了多少」。

## 功能

- **按發薪日計算進度**：可自訂幾號發工資（不一定 30 號）
- **刷新不重置**：進度會一直保留，關閉瀏覽器再開也繼續
- **設定永久保存**：月薪、發薪日、貨幣都會記住
- **超多小數點**：顯示到小數點後 10 位，看起來很爽
- **高幀率更新**：用 `requestAnimationFrame`，數字連續平滑跳動
- **會動的 Chiikawa 公仔**：上下彈跳 + 左右搖晃
- **可拖曳、可縮小**成圓形只剩公仔
- **預設右下角**浮動視窗

## 安裝方法

1. 安裝 [Tampermonkey](https://www.tampermonkey.net/)（Chrome / Edge / Firefox / Safari 都有）
2. 點下面按鈕安裝腳本（或複製 `chiikawa-wage-tracker.user.js` 內容新增）
3. 開啟任意網頁，右下角就會出現 Chiikawa

[![Install](https://img.shields.io/badge/Install-Tampermonkey-pink)](https://raw.githubusercontent.com/2246250622/chiikawa-wage-tracker/main/chiikawa-wage-tracker.user.js)

或直接：
```
https://raw.githubusercontent.com/2246250622/chiikawa-wage-tracker/main/chiikawa-wage-tracker.user.js
```

## 使用

1. 點右上角 ⚙ 打開設定
2. 輸入**月薪**
3. 輸入**發薪日**（例如 25 號發薪就填 25）
4. 儲存後即時生效

之後不管什麼時候打開，都會按照「上一個發薪日到現在」的進度顯示已賺取金額。

例如月薪 20000、發薪日 25 號：
- 如果今天是 10 號，會顯示從上月 25 號到現在的進度
- 數字會一直以很高幀率往上跑

## 截圖概念

右下角會出現粉粉的小視窗，Chiikawa 在左邊跳跳，中間是超長小數的工資數字。

## 自訂

腳本開頭可以改 `CHIIKAWA_IMG` 換成自己喜歡的 Chiikawa 圖片網址。

## License

MIT（隨便用，給朋友裝也沒問題）

---

Made with Chiikawa power 💖
