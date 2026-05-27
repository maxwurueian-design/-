 // 1. 取得使用者的定位
function getUserLocation() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "📡 正在精確定位您的位置...";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                searchNearbyRestaurantsNew(userLocation);
            },
            (error) => {
                resultsContainer.innerHTML = "❌ 無法取得定位，請確認瀏覽器是否開啟位置權限。";
                console.error(error);
            }
        );
    } else {
        resultsContainer.innerHTML = "❌ 您的瀏覽器不支援 GPS 定位功能。";
    }
}

// 2. 使用新版 Places API (New) 搜尋餐廳
async function searchNearbyRestaurantsNew(location) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "🔍 正在使用新版 API 從 Google Maps 搜尋餐廳...";

    const cuisine = document.getElementById('cuisine').value.trim();
    const distance = parseFloat(document.getElementById('distance').value);
    const timeOption = document.getElementById('time').value;

    try {
        // 動態載入新版的 Places 函式庫
        const { Place } = await google.maps.importLibrary("places");

        // 設定新版 API 的搜尋請求
        const request = {
            // 新版改用圓形區域 (CircularRegion) 來定義範圍
            locationRestriction: {
                center: location,
                radius: distance // 單位：公尺
            },
            includedTypes: ['restaurant'], // 只搜尋餐廳
            language: 'zh-TW', // 指定中文語系
            maxResultCount: 20 // 限制回傳數量
        };

        // 如果使用者有輸入關鍵字，加入文字查詢
        if (cuisine !== "") {
            request.textQuery = cuisine;
        }

        // 新版核心優勢：指定需要的欄位（Field Mask），沒選的不計費，更省錢！
        const fields = ['id', 'displayName', 'rating', 'userRatingCount', 'shortAddress', 'isOpenNow'];

        // 執行新版搜尋
        const { places } = await Place.searchNearby(request);

        resultsContainer.innerHTML = ""; // 清空提示字

        // 【核心功能】判斷有沒有符合的餐廳
        if (!places || places.length === 0) {
            showNoResults();
            return;
        }

        // 處理時間篩選 (如果選「現在」，過濾掉目前沒營業的)
        let finalResults = places;
        if (timeOption === 'now') {
            finalResults = places.filter(place => place.isOpenNow === true);
        }

        if (finalResults.length === 0) {
            showNoResults();
            return;
        }

        // 依據 Google 評價高低排序
        finalResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        // 渲染畫面
        finalResults.forEach(place => {
            const card = document.createElement('div');
            card.className = 'restaurant-card';

            const name = place.displayName || "未知名餐廳";
            const rating = place.rating ? `⭐ ${place.rating} (${place.userRatingCount || 0} 則評價)` : "暫無評價";
            const address = place.shortAddress || "未提供地址";
            
            let statusTag = "";
            if (place.isOpenNow !== undefined) {
                statusTag = place.isOpenNow 
                    ? `<span class="info-tag" style="background-color:#e3fcef; color:#00875a;">🟢 營業中</span>` 
                    : `<span class="info-tag" style="background-color:#ffebe6; color:#de350b;">🔴 休息中</span>`;
            }

            card.innerHTML = `
                <div class="restaurant-name">${name}</div>
                <div class="rating">${rating}</div>
                <div>
                    ${statusTag}
                    <span class="info-tag">📍 ${distance}M 範圍內</span>
                </div>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #747d8c;">地址：${address}</p>
            `;
            resultsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Places API (New) 發生錯誤:", error);
        resultsContainer.innerHTML = "❌ 搜尋時發生錯誤，請檢查 Google Cloud 後台是否已啟用「Places API (New)」並綁定帳單。";
    }
}

// 顯示沒有符合結果的畫面
function showNoResults() {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <div class="no-result">
            ❌ 抱歉！目前附近沒有符合您所有條件的餐廳。<br>
            <span style="font-size:14px; font-weight:normal; color:#aaa;">建議您可以放大距離、確認當前營業狀態，或換個饮食類型試試看喔！</span>
        </div>
    `;
}

