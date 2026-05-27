 let map;
let service;

// 初始化（取得使用者當前位置）
function getRestaurants() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "正在定位您的位置並搜尋餐廳...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                searchNearbyPlaces(userLocation);
            },
            () => {
                resultsContainer.innerHTML = "❌ 無法取得您的定位，請開啟瀏覽器定位權限。";
            }
        );
    } else {
        resultsContainer.innerHTML = "❌ 您的瀏覽器不支援定位功能。";
    }
}

// 呼叫 Google Places API 搜尋周邊餐廳
function searchNearbyPlaces(location) {
    const cuisine = document.getElementById('cuisine').value;
    const distance = document.getElementById('distance').value;
    const timeOpen = document.getElementById('time').value;

    // 建立一個隱藏的 div 供 PlacesService 使用
    const dummyElement = document.createElement('div');
    service = new google.maps.places.PlacesService(dummyElement);

    const request = {
        location: location,
        radius: distance,
        type: ['restaurant'],
        keyword: cuisine, // 使用者輸入的關鍵字
        openNow: timeOpen === 'now' // 是否只顯示當前營業中
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
            displayResults(results);
        } else {
            document.getElementById('results').innerHTML = "找不到符合條件的餐廳，換個關鍵字試試看吧！";
        }
    });
}

// 將結果渲染到網頁上
function displayResults(places) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ""; // 清空上一次的搜尋

    // 依據評價由高到低排序
    places.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';

        const name = place.name;
        const rating = place.rating ? `⭐ ${place.rating} (${place.user_ratings_total} 則評價)` : "暫無評價";
        const address = place.vicinity || "未提供地址";

        card.innerHTML = `
            <strong>${name}</strong>
            <div class="rating">${rating}</div>
            <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">📍 ${address}</p>
        `;
        resultsContainer.appendChild(card);
    });
}

