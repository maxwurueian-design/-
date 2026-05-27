 let map;
let service;

// 初始化（取得使用者當前位置）
function filterRestaurants() { // 配合 HTML 的按鈕名稱，這裡改為 filterRestaurants
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "🔍 正在定位您的位置並搜尋真實餐廳...";

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

    const dummyElement = document.createElement('div');
    service = new google.maps.places.PlacesService(dummyElement);

    const request = {
        location: location,
        radius: distance,
        type: ['restaurant'],
        keyword: cuisine,
        openNow: true // 串接真實 API 時，通常直接篩選目前有營業的店
    };

    service.nearbySearch(request, (results, status) => {
        const resultsContainer = document.getElementById('results');
        
        // 【核心功能】如果找不到符合的，或是 API 回傳沒有結果
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-result">
                    ❌ 抱歉！目前附近沒有符合您所有條件的餐廳。<br>
                    <span style="font-size:14px; font-weight:normal; color:#aaa;">建議您可以放大距離或換個飲食類型試試看喔！</span>
                </div>
            `;
            return;
        }

        // 有結果則依據評價由高到低排序並顯示
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        displayResults(results);
    });
}

// 將真實結果渲染到網頁上
function displayResults(places) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ""; 

    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';

        const name = place.name;
        const rating = place.rating ? `⭐ ${place.rating} (${place.user_ratings_total || 0} 則評價)` : "暫無評價";
        const address = place.vicinity || "未提供地址";

        card.innerHTML = `
            <div class="restaurant-name">${name}</div>
            <div class="rating">${rating}</div>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #747d8c;">📍 ${address}</p>
        `;
        resultsContainer.appendChild(card);
    });
}


