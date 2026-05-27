 // 內建餐廳資料庫範本 (包含：飲食類型、距離(公尺)、營業時段、評價)
const restaurantDatabase = [
    { name: "一心拉麵屋", cuisine: "拉麵", distance: 300, time: ["lunch", "dinner"], rating: 4.7, reviews: 1280, address: "美食路 12 號" },
    { name: "大飽飽熱炒便當", cuisine: "便當", distance: 450, time: ["lunch", "dinner"], rating: 4.1, reviews: 340, address: "幸福街 5 號" },
    { name: "極致麻辣鴛鴦鍋", cuisine: "火鍋", distance: 1200, time: ["dinner", "midnight"], rating: 4.6, reviews: 2150, address: "開胃大道 88 號" },
    { name: "陽光薩利亞義式餐廳", cuisine: "義大利麵", distance: 800, time: ["lunch", "dinner"], rating: 4.3, reviews: 980, address: "站前廣場 B1" },
    { name: "深夜食堂炭烤", cuisine: "燒肉", distance: 600, time: ["midnight"], rating: 4.5, reviews: 520, address: "夜貓路 101 號" },
    { name: "曉明湯包", cuisine: "早餐", distance: 1500, time: ["lunch"], rating: 4.2, reviews: 600, address: "中清路二段" },
    { name: "一品香石頭火鍋", cuisine: "火鍋", distance: 400, time: ["lunch", "dinner"], rating: 4.4, reviews: 830, address: "惠來路三段" },
    { name: "老牌牛肉麵", cuisine: "牛肉麵", distance: 950, time: ["lunch", "dinner"], rating: 4.0, reviews: 410, address: "西屯路二段" },
    { name: "黑糖珍奶與輕食小舖", cuisine: "飲料", distance: 200, time: ["lunch", "dinner"], rating: 4.8, reviews: 150, address: "逢甲路甲號" }
];

function filterRestaurants() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "🔍 正在搜尋符合條件的美味餐廳...";

    // 獲取使用者輸入的條件
    const inputCuisine = document.getElementById('cuisine').value.trim();
    const selectedDistance = parseInt(document.getElementById('distance').value);
    const selectedTime = document.getElementById('time').value;

    // 開始進行三重條件篩選
    const filteredList = restaurantDatabase.filter(restaurant => {
        // 條件 1：飲食類型比對 (支援模糊搜尋，留白則不限制)
        const matchCuisine = inputCuisine === "" || restaurant.cuisine.includes(inputCuisine) || inputCuisine.includes(restaurant.cuisine);
        
        // 條件 2：距離比對 (餐廳距離必須小於或等於使用者選擇的最大距離)
        const matchDistance = restaurant.distance <= selectedDistance;
        
        // 條件 3：吃飯時間比對 (餐廳的營業時段必須包含使用者選擇的時間)
        const matchTime = restaurant.time.includes(selectedTime);

        return matchCuisine && matchDistance && matchTime;
    });

    // 延遲一小段時間（模擬讀取感），然後顯示結果
    setTimeout(() => {
        resultsContainer.innerHTML = ""; // 清空提示文字

        // 【核心功能】如果篩選後的陣列是空的，代表沒有符合的餐廳
        if (filteredList.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-result">
                    ❌ 抱歉！目前沒有符合您所有條件的餐廳。<br>
                    <span style="font-size:14px; font-weight:normal; color:#aaa;">建議您可以放大距離或換個飲食類型試試看喔！</span>
                </div>
            `;
            return;
        }

        // 如果有符合的餐廳，依據評價從高到低排序並顯示
        filteredList.sort((a, b) => b.rating - a.rating);

        filteredList.forEach(restaurant => {
            const card = document.createElement('div');
            card.className = 'restaurant-card';
            card.innerHTML = `
                <div class="restaurant-name">${restaurant.name}</div>
                <div class="rating">⭐ ${restaurant.rating} <span style="color:#aaa; font-size:13px; font-weight:normal;">(${restaurant.reviews} 則評價)</span></div>
                <div>
                    <span class="info-tag">🍱 ${restaurant.cuisine}</span>
                    <span class="info-tag">📍 離你 ${restaurant.distance} 公尺</span>
                </div>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #747d8c;">地址：${restaurant.address}</p>
            `;
            resultsContainer.appendChild(card);
        });
    }, 400); 
}

