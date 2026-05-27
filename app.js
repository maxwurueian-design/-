// 模擬的餐廳資料庫 (未來可以串接 Google API)
const restaurantDatabase = [
    { name: "隱市壽司", cuisine: "日式", distance: 300, time: ["lunch", "dinner"], rating: 4.7 },
    { name: "大碗公牛肉麵", cuisine: "台式", distance: 500, time: ["lunch", "dinner"], rating: 4.2 },
    { name: "好時光義大利麵", cuisine: "義式", distance: 1200, time: ["lunch", "dinner"], rating: 4.5 },
    { name: "深夜拉麵屋", cuisine: "日式", distance: 800, time: ["dinner", "supper"], rating: 4.6 },
    { name: "美式轟炸雞", cuisine: "美式", distance: 400, time: ["lunch", "dinner", "supper"], rating: 3.9 },
    { name: "巷口黑白切", cuisine: "台式", distance: 200, time: ["dinner", "supper"], rating: 4.0 }
];

document.getElementById('searchBtn').addEventListener('click', function() {
    // 1. 獲取使用者輸入的值
    const selectedCuisine = document.getElementById('cuisine').value;
    const maxDistance = parseInt(document.getElementById('distance').value) || 1000;
    const selectedTime = document.getElementById('mealTime').value;

    // 2. 進行條件篩選
    const filteredRestaurants = restaurantDatabase.filter(repo => {
        const matchCuisine = (selectedCuisine === 'all' || repo.cuisine === selectedCuisine);
        const matchDistance = (repo.distance <= maxDistance);
        const matchTime = repo.time.includes(selectedTime);
        
        return matchCuisine && matchDistance && matchTime;
    });

    // 3. 渲染結果到畫面上
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = ''; // 清空上一次的結果

    if (filteredRestaurants.length === 0) {
        resultContainer.innerHTML = '<p style="color:red; text-align:center;">找不到符合條件的餐廳，試著放寬標準吧！</p>';
        return;
    }

    // 隨機打亂結果，增加「幫我決定」的趣味性（或直接列出清單）
    filteredRestaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.innerHTML = `
            <h3>${restaurant.name}</h3>
            <p>類型：${restaurant.cuisine} | 距離：${restaurant.distance} 公尺</p>
            <p>評價：<span class="rating">⭐ ${restaurant.rating}</span></p>
        `;
        resultContainer.appendChild(card);
    });
});
