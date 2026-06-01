document.getElementById('searchBtn').addEventListener('click', searchSports);

// 關鍵字智能映射：防止使用者輸入純中文導致開源地圖判斷不準
const sportMap = {
  "羽毛球": "badminton", "羽球": "badminton",
  "游泳": "swimming", "游泳池": "swimming",
  "健身": "fitness", "健身房": "gym",
  "籃球": "basketball", "籃球場": "basketball",
  "網球": "tennis", "網球場": "tennis"
};

async function searchSports() {
  const sportInput = document.getElementById('sportInput').value.trim();
  const coords = document.getElementById('citySelect').value.split(',');
  const lat = parseFloat(coords[0]);
  const lon = parseFloat(coords[1]);
  
  const loading = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');
  
  if (!sportInput) {
    alert('請輸入運動類型！');
    return;
  }
  
  // 顯示 Loading，清空畫面
  loading.classList.remove('hidden');
  resultsDiv.innerHTML = '';
  
  // 英文對應轉換，如果找不到就維持原輸入文字進行模糊配對
  const englishSport = sportMap[sportInput] || sportInput;
  
  // 放大搜尋區間（delta 0.045 大約是方圓 4.5 公里）
  const delta = 0.045; 
  
  // 優化後的 Overpass API 查詢：同時對應標籤 (sport) 與名稱 (name)
  const overpassQuery = `
    [out:json][timeout:30];
    (
      node["sport"~"${englishSport}|${sportInput}",i](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
      way["sport"~"${englishSport}|${sportInput}",i](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
      node["name"~"${sportInput}",i](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
      way["name"~"${sportInput}",i](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
    );
    out center;
  `;
  
  // 使用最穩定的開源地圖主要伺服器
  const url = 'https://overpass-api.de/api/interpreter';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(overpassQuery)
    });
    
    if (!response.ok) throw new Error('地圖伺防器連線異常');
    
    const data = await response.json();
    loading.classList.add('hidden'); // 隱藏 Loading
    
    const elements = data.elements || [];
    if (elements.length === 0) {
      resultsDiv.innerHTML = `<p style="color:#e74c3c; text-align:center; font-weight:bold; padding:20px;">❌ 在該縣市範圍內找不到與「${sportInput}」相關的地點。<br>建議改試試熱門關鍵字：羽毛球、健身房、游泳池。</p>`;
      return;
    }
    
    elements.forEach((elem, index) => {
      const tags = elem.tags || {};
      const name = tags.name || `${sportInput}場地 #${index + 1}`;
      
      // 處理營業時間與地址
      const openingHours = tags.opening_hours || '未登錄（請參考下方地圖看即時狀態）';
      const city = tags['addr:city'] || '';
      const district = tags['addr:district'] || '';
      const street = tags['addr:street'] || '';
      const housenumber = tags['addr:housenumber'] || '';
      let fullAddress = `${city}${district}${street}${housenumber}`;
      if (!fullAddress) fullAddress = '未標記詳細地址（請參考下方地圖位置）';
      
      const citySelectEl = document.getElementById('citySelect');
      const selectedCityText = citySelectEl.options[citySelectEl.selectedIndex].text;
      
      // 🎯 終極修復點：全部網址全面採用安全的 https 協定！
      const searchQuery = `台灣 ${selectedCityText} ${name}`;
      const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      const externalMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}`;
      
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>📍 ${name}</h3>
        <p><strong>🏠 詳細地址：</strong> ${fullAddress}</p>
        <p><strong>⏰ 營運時間：</strong> ${openingHours}</p>
        <p><strong>⭐️ 評價資訊：</strong> <a href="${externalMapUrl}" target="_blank" class="review-link">點我前往 Google Maps 查看網友評論與星等</a></p>
        
        <div class="map-container">
          <iframe 
            width="100%" 
            height="100%" 
            src="${embedMapUrl}" 
            frameborder="0" 
            scrolling="no" 
            marginheight="0" 
            marginwidth="0">
          </iframe>
        </div>
      `;
      resultsDiv.appendChild(card);
    });
    
  } catch (error) {
    loading.classList.add('hidden');
    resultsDiv.innerHTML = `<p style="color:#e74c3c; text-align:center; font-weight:bold; padding:20px;">連線失敗！原因: ${error.message}</p>`;
  }
}
