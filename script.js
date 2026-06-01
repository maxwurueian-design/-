document.getElementById('searchBtn').addEventListener('click', searchSports);

async function searchSports() {
  const sportKeyword = document.getElementById('sportInput').value.trim();
  const coords = document.getElementById('citySelect').value.split(',');
  const lat = parseFloat(coords[0]);
  const lon = parseFloat(coords[1]);
  
  const loading = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');
  
  if (!sportKeyword) {
    alert('請輸入運動類型！');
    return;
  }
  
  // 顯示 Loading，清空上一次的結果
  loading.classList.remove('hidden');
  resultsDiv.innerHTML = '';
  
  // 放大搜尋半徑（0.05 大約是方圓 5 公里），確保一定能抓到東西
  const delta = 0.05; 
  
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["sport"~"${sportKeyword}",i](${lat-delta},${lon-delta},{lat+delta},{lon+delta});
      way["sport"~"${sportKeyword}",i](${lat-delta},${lon-delta},{lat+delta},{lon+delta});
      node["name"~"${sportKeyword}",i](${lat-delta},${lon-delta},{lat+delta},{lon+delta});
      way["name"~"${sportKeyword}",i](${lat-delta},${lon-delta},{lat+delta},{lon+delta});
    );
    out center;
  `;
  
  // 改用隨時維護的 Overpass 官方穩定節點
  const url = 'https://overpass-api.de/api/interpreter';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(overpassQuery)
    });
    
    if (!response.ok) throw new Error('地圖伺服器回應錯誤');
    
    const data = await response.json();
    
    // 🛑 確保不論成功失敗，都要隱藏 Loading 訊息
    loading.classList.add('hidden');
    
    const elements = data.elements || [];
    if (elements.length === 0) {
      resultsDiv.innerHTML = `<p style="color:#e74c3c; text-align:center; font-weight:bold;">❌ 在該城市方圓 5 公里內找不到「${sportKeyword}」，請換個關鍵字（例如：健身、游泳、羽毛球）再試試！</p>`;
      return;
    }
    
    elements.forEach((elem, index) => {
      const tags = elem.tags || {};
      const name = tags.name || `運動場地 #${index + 1}`;
      
      const openingHours = tags.opening_hours || '未登錄（請查看下方 Google 地圖即時狀態）';
      const city = tags['addr:city'] || '';
      const district = tags['addr:district'] || '';
      const street = tags['addr:street'] || '';
      const housenumber = tags['addr:housenumber'] || '';
      let fullAddress = `${city}${district}${street}${housenumber}`;
      if (!fullAddress) fullAddress = '地圖未標記詳細地址（請參考下方地圖導航）';
      
      const selectedCityText = document.getElementById('citySelect').options[document.getElementById('citySelect').selectedIndex].text;
      
      // 🎯 修正核心：加上「台灣」以及強制使用「https」，防止被 GitHub Pages 阻擋
      const searchQuery = `台灣 ${selectedCityText} ${name}`;
      const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      const externalMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}`;
      
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>📍 ${name}</h3>
        <p><strong>🏠 詳細地址：</strong> ${fullAddress}</p>
        <p><strong>⏰ 營運時間：</strong> ${openingHours}</p>
        <p><strong>⭐️ 評價資訊：</strong> <a href="${externalMapUrl}" target="_blank" class="review-link">點我前往 Google Maps 查看詳細評論與星等</a></p>
        
        <div class="map-container">
          <iframe 
            width="100%" 
            height="250" 
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
    resultsDiv.innerHTML = `<p style="color:#e74c3c; text-align:center; font-weight:bold;">連線失敗！請檢查網路或稍後再試。原因: ${error.message}</p>`;
  }
}
