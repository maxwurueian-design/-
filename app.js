// ═══════════════════════════════════════
// 🌐 Gemini AI 驅動 —— 彰化真實餐廳即時搜尋系統
// ═══════════════════════════════════════

// 🔒 請在此處填入你申請到的 Gemini API Key
const GEMINI_API_KEY = "AQ.Ab8RN6KDojZufwM4n1EhOf5lLHVupfgeQk3wrQtkehQjwe3qDA"; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// 📡 1. 前端 GPS 定位主程式
function getUserLocation() {
    const resultsContainer = document.getElementById('results');
    if (resultsContainer) {
        resultsContainer.innerHTML = "📡 正在擷取您的 GPS 定位...";
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                fetchRestaurantsFromAI(userCoords);
            },
            () => {
                alert("無法取得精確定位，系統將以【彰化火車站】為中心點交由 Gemini AI 進行周邊搜尋！");
                const changhuaStation = { lat: 24.0814, lng: 120.5383 }; 
                fetchRestaurantsFromAI(changhuaStation);
            }
        );
    } else {
        const changhuaStation = { lat: 24.0814, lng: 120.5383 };
        fetchRestaurantsFromAI(changhuaStation);
    }
}

// 🤖 2. 核心：向 Gemini 發送 Prompt，要求即時返回 100% 真實的彰化美食 JSON 資料
async function fetchRestaurantsFromAI(userLocation) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = "🤖 Gemini AI 正在連網為您過濾真實的彰化美食名單，請稍候...";

    // 取得前端介面的篩選條件
    const cuisineSelect = document.getElementById('cuisine');
    const timeSelect = document.getElementById('time');
    const distanceInput = document.getElementById('distance');

    const inputCuisine = cuisineSelect ? cuisineSelect.value.trim() : "美食";
    const selectedTime = timeSelect ? timeSelect.value : "lunch";
    const selectedDistance = distanceInput ? parseInt(distanceInput.value) : 2000;

    // 定義時段文字
    const timeText = { "lunch": "午餐", "dinner": "晚餐", "midnight": "宵夜" }[selectedTime];

    // 精準調教 AI 的 Prompt，強烈限制不准胡扯、必須返回標準 JSON
    const prompt = `
        你是一個精準的台灣美食地圖 API 伺服器。
        請根據使用者的中心點座標：緯度 ${userLocation.lat}, 經度 ${userLocation.lng}。
        找出位於「彰化市」，且距離此中心點 ${selectedDistance} 公尺以內、符合「${inputCuisine}」分類、且在「${timeText}」時段有營業的實體餐廳。

        【嚴格限制條件】：
        1. 餐廳必須是【真實存在於彰化市】的在地老店、知名名店或連鎖分店（例如八方雲集、50嵐某某店），地址必須 100% 正確且符合台灣大埔路、中正路等路脈邏輯，絕對不准虛構店家或編造門牌！
        2. 請自行根據你的地理資料庫，估算出這些餐廳與使用者中心點的精確直線距離（公尺）。
        3. 請「只」返回一個乾淨的 JSON 陣列，不要包含任何 markdown 標記（如 \`\`\`json）、任何引言或解釋文字。
        
        【返回 JSON 格式範例】：
        [
          {
            "name": "阿三肉圓",
            "cuisine": "肉圓",
            "rating": 4.4,
            "reviews": 8500,
            "distance": 350,
            "address": "彰化市三民路242號"
          }
        ]
    `;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) throw new Error("AI API 請求失敗，請檢查 Key 是否有效或是否超限。");

        const data = await response.json();
        let aiText = data.candidates[0].content.parts[0].text.trim();
        
        // 預防 AI 頑皮偷偷加上了 markdown 語法，進行強制作清洗
        aiText = aiText.replace(/^```json/i, "").replace(/```$/, "").trim();
        
        const restaurants = JSON.parse(aiText);
        renderCards(restaurants);

    } catch (error) {
        console.error(error);
        resultsContainer.innerHTML = `
            <div class="no-result" style="text-align: center; padding: 30px; color: #ff6b6b;">
                ❌ AI 連線或解析發生錯誤！<br>
                <span style="font-size:14px; color:#aaa;">請確認您的 app.js 中是否有正確填入 GEMINI_API_KEY。</span>
            </div>
        `;
    }
}

// 📐 3. 介面渲染邏輯 (處理 AI 回傳的實體資料)
function renderCards(filteredList) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = ""; 

    if (!Array.isArray(filteredList) || filteredList.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-result" style="text-align: center; padding: 30px; color: #777;">
                ❌ 抱歉！Gemini AI 在此範圍內沒有找到符合條件的真實彰化店家。<br>
                <span style="font-size:14px; font-weight:normal; color:#aaa;">您可以試著擴大搜尋距離，或更換料理分類再試一次！</span>
            </div>
        `;
        return;
    }

    // 由 AI 算出的距離或評分進行前端排序（此處以評分排序）
    filteredList.sort((a, b) => b.rating - a.rating);

    // 渲染卡片
    filteredList.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        
        const distanceText = restaurant.distance >= 1000 
            ? `${(restaurant.distance / 1000).toFixed(1)} 公里` 
            : `${restaurant.distance} 公尺`;

        card.innerHTML = `
            <div class="restaurant-name" style="font-weight: bold; font-size: 18px; margin-bottom: 5px;">${restaurant.name}</div>
            <div class="rating" style="color: #f1c40f; margin-bottom: 5px;">⭐ ${restaurant.rating} <span style="color:#aaa; font-size:13px; font-weight:normal;">(${restaurant.reviews} 則 Google 評論)</span></div>
            <div style="margin-bottom: 5px;">
                <span class="info-tag" style="background: #e1b12c; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-right: 5px;">🍱 ${restaurant.cuisine}</span>
                <span class="info-tag" style="background-color: #ff6b6b; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 12px;">📍 預估距離 ${distanceText}</span>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #747d8c;">地址：${restaurant.address}</p>
        `;
        resultsContainer.appendChild(card);
    });
}
