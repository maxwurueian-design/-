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
  
  loading.classList.remove('hidden');
  resultsDiv.innerHTML = '';
  
  const delta = 0.035; 
  
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["sport"~"${sportKeyword}",i](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
      way["sport"~"${sportKeyword}",i](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
      node["name"~"${sportKeyword}",i](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
      way["name"~"${sportKeyword}",i](${lat-delta},${lon-delta},${lat+delta},${lon+delta});
    );
    out center;
  `;
  
  const url = 'https://overpass-api.de/api/interpreter';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(overpassQuery)
    });
    
    if (!response.ok) throw new Error('網絡回應錯誤');
    
    const data = await response.json();
    loading.classList.add('hidden');
    
    const elements = data.elements || [];
    if (elements.length === 0) {
      resultsDiv.innerHTML = `<p style="color:#e74c3c; text-align:center; font-weight:bold;">❌ 找不到相關運動場館，請換個關鍵字再試試！</p>`;
      return;
    }
    
    elements.forEach((elem, index) => {
      const tags = elem.tags || {};
      const name = tags.name || `運動場所 #${index + 1}`;
      
      const openingHours = tags.opening_hours || '未登錄（可查看下方地圖標記之即時狀態）';
      const city = tags['addr:city'] || '';
      const district = tags['addr:district'] || '';
      const street = tags['addr:street'] || '';
      const housenumber = tags['addr:housenumber'] || '';
      let fullAddress = `${city}${district}${street}${housenumber}`;
      if (!fullAddress) fullAddress = '地圖未標記詳細地址（請參考下方地圖導航）';
      
      const selectedCityText = document.getElementById('citySelect').options[document.getElementById('citySelect').selectedIndex].text;
      const searchQuery = `${selectedCityText} ${name}`;
      
      // ✅ 修正點：獨立成行，完美閉合字串樣板，動態組裝內嵌與外連網址
      const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      const externalMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}`;
      
      const card = document.createElement('div');
      card.className = 'card';
      
      // ✅ 修正點：利用正確的反單引號 ` 開頭與結尾，完整塞入內嵌 iframe
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
    resultsDiv.innerHTML = `<p style="color:#e74c3c; text-align:center; font-weight:bold;">連線失敗！錯誤原因: ${error.message}</p>`;
  }
}
