document.getElementById('searchBtn').addEventListener('click', searchSports);

const sportsDatabase = {
  "基隆市": [
    { name: "基隆市國民運動中心", address: "基隆市仁愛區仁愛路19號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "信義國民小學體育館", address: "基隆市信義區仁二路135號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "基隆市立成功國民中學", address: "基隆市仁愛區壽山路2號", hours: "配合學校開放時間", type: "籃球/體育館/校園" }
  ],
  "台北市": [
    { name: "大安國民運動中心", address: "台北市大安區辛亥路三段55號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "信義國民運動中心", address: "台北市信義區松勤街100號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "金華國民中學籃球場", address: "台北市大安區新生南路二段84號", hours: "課後及假日開放", type: "籃球/體育館/校園" },
    { name: "新生高架橋下籃球場", address: "台北市中山區新生高架橋與長安東路口", hours: "24小時開放", type: "籃球/體育館/校園" },
    { name: "敦化國民小學活動中心", address: "台北市松山區敦化北路2號", hours: "配合學校開放時間", type: "羽毛球/網球" }
  ],
  "新北市": [
    { name: "板橋國民運動中心", address: "新北市板橋區智樂路6號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "海山國民中學體育館", address: "新北市板橋區漢生東路215號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "永和國民小學運動場", address: "新北市永和區秀朗路一段120號", hours: "課後與假日開放", type: "籃球/體育館/校園" },
    { name: "泰山體育館", address: "新北市泰山區同義里公園路54號", hours: "08:00–22:00", type: "籃球/體育館/校園" }
  ],
  "桃園市": [
    { name: "桃園國民運動中心", address: "桃園市桃園區中山東路233號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "桃園市立桃園國民中學", address: "桃園市桃園區中山路232號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "中埔國民小學運動場", address: "桃園市桃園區永安路1054號", hours: "依校方公告為準", type: "籃球/體育館/校園" }
  ],
  "新竹市": [
    { name: "新竹市新科國民運動中心", address: "新竹市東區光復路一段89巷163號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "培英國民中學體育館", address: "新竹市東區學府路4號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "東門國民小學操場", address: "新竹市東區民族路33號", hours: "課後與假日開放", type: "籃球/體育館/校園" }
  ],
  "新竹縣": [
    { name: "新竹縣竹北國民運動中心", address: "新竹縣竹北市莊敬南路18號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "竹北國民中學體育館", address: "新竹縣竹北市中正西路6號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "光明國民小學球場", address: "新竹縣竹北市光明六路516號", hours: "依學校開放公告", type: "籃球/體育館/校園" }
  ],
  "苗栗縣": [
    { name: "苗栗縣立體育館", address: "苗栗縣苗栗市中正路191號", hours: "08:00–21:00", type: "綜合/國民運動中心" },
    { name: "苗栗國民中學", address: "苗栗縣苗栗市府前路145號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "建功國民小學", address: "苗栗縣苗栗市中正路211號", hours: "假日開放", type: "籃球/體育館/校園" }
  ],
  "台中市": [
    { name: "朝馬國民運動中心", address: "台中市西屯區朝貴路199號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "居仁國民中學體育場", address: "台中市西區自由路一段99號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "惠文國民小學風雨球場", address: "台中市南屯區公益路二段300號", hours: "課後及假日開放", type: "籃球/體育館/校園" },
    { name: "中興大學風雨籃球場", address: "台中市南區興大路250號", hours: "06:00–22:00", type: "籃球/體育館/校園" }
  ],
  "彰化縣": [
    { name: "彰化彰北國民運動中心", address: "彰化縣彰化市建國東路2號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "彰化藝術國民中學", address: "彰化縣彰化市卦山路13號", hours: "配合校方時間開放", type: "籃球/體育館/校園" },
    { name: "彰化市中山國民小學", address: "彰化縣彰化市中山路二段848號", hours: "假日開放", type: "籃球/體育館/校園" },
    { name: "彰化縣立體育場籃球場", address: "彰化縣彰化市健興路1號", hours: "05:00–22:00", type: "籃球/體育館/校園" }
  ],
  "南投縣": [
    { name: "南投縣立體育場", address: "南投縣南投市南陽路1號", hours: "05:00–22:00", type: "綜合/國民運動中心" },
    { name: "南投國民中學", address: "南投縣南投市祖祠路361號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "南投國民小學", address: "南投縣南投市彰南路二段105號", hours: "假日特定時間開放", type: "籃球/體育館/校園" }
  ],
  "雲林縣": [
    { name: "雲林縣立體育館", address: "雲林縣斗六市大學路三段2號", hours: "08:00–18:00", type: "綜合/國民運動中心" },
    { name: "斗六國民中學", address: "雲林縣斗六市文化路58號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "鎮西國民小學", address: "雲林縣斗六市西平路3號", hours: "假日開放", type: "籃球/體育館/校園" }
  ],
  "嘉義市": [
    { name: "嘉義市國民運動中心", address: "嘉義市東區彌陀路327號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "北興國民中學體育館", address: "嘉義市東區博愛路二段89號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "嘉義大學新民校區籃球場", address: "嘉義市西區新民路580號", hours: "06:00–21:30", type: "籃球/體育館/校園" }
  ],
  "嘉義縣": [
    { name: "嘉義縣立體育館", address: "嘉義縣朴子市朴子七路1號", hours: "08:00–17:00", type: "綜合/國民運動中心" },
    { name: "朴子國民中學", address: "嘉義縣朴子市大同路4號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "大林國民小學運動場", address: "嘉義縣大林鎮中興路2號", hours: "課後與假日開放", type: "籃球/體育館/校園" }
  ],
  "台南市": [
    { name: "永華國民運動中心", address: "台南市中西區中華西路二段30號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "大成國民中學風雨球場", address: "台南市南區西門路一段306號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "勝利國民小學操場球場", address: "台南市東區勝利路10號", hours: "課後及假日開放", type: "籃球/體育館/校園" },
    { name: "台南市立後甲國民中學", address: "台南市東區東平路260號", hours: "依校方公告為準", type: "羽毛球/網球" }
  ],
  "高雄市": [
    { name: "鳳山運動園區國民運動中心", address: "高雄市鳳山區光華路68號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "苓雅運動中心 (技擊館)", address: "高雄市苓雅區中正一路96號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "五福國民中學體育場", address: "高雄市苓雅區五福一路12號", hours: "課後與假日特定時間開放", type: "籃球/體育館/校園" },
    { name: "信義國民小學風雨球場", address: "高雄市新興區中正三路172號", hours: "假日局部開放", type: "籃球/體育館/校園" }
  ],
  "屏東縣": [
    { name: "屏東國民運動中心", address: "屏東縣屏東市勝利東路50號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "屏東國民中學體育館", address: "屏東縣屏東市大連路70號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "仁愛國民小學運動場", address: "屏東縣屏東市仁愛路98號", hours: "課後及假日開放", type: "籃球/體育館/校園" }
  ],
  "宜蘭縣": [
    { name: "宜蘭國民運動中心", address: "宜蘭縣宜蘭市公園路53號", hours: "06:00–22:00", type: "綜合/國民運動中心" },
    { name: "宜蘭市立運動公園籃球場", address: "宜蘭縣宜蘭市中山路五段50號", hours: "24小時營業(夜間照明至22:00)", type: "籃球/體育館/校園" },
    { name: "宜蘭國民中學體育館", address: "宜蘭縣宜蘭市樹人路37號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "中山國民小學", address: "宜蘭縣宜蘭市崇聖街4號", hours: "假日開放", type: "籃球/體育館/校園" }
  ],
  "花蓮縣": [
    { name: "花蓮縣立體育館 (小巨蛋)", address: "花蓮縣花蓮市達固湖灣大路23號", hours: "08:00–22:00", type: "綜合/國民運動中心" },
    { name: "國風國民中學體育館", address: "花蓮縣花蓮市林政街169號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "明義國民小學活動中心", address: "花蓮縣花蓮市明義街107號", hours: "依學校開放公告", type: "籃球/體育館/校園" }
  ],
  "台東縣": [
    { name: "台東縣立體育館", address: "台東縣台東市桂林北路201號", hours: "08:00–17:30", type: "綜合/國民運動中心" },
    { name: "新生國民中學體育館", address: "台東縣台東市新生路641號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "新生國民小學操場", address: "台東縣台東市更生路474s巷45號", hours: "課後與假日開放", type: "籃球/體育館/校園" }
  ],
  "澎湖縣": [
    { name: "澎湖縣綜合體育館", address: "澎湖縣馬公市文化路31號", hours: "08:00–21:30", type: "綜合/國民運動中心" },
    { name: "馬公國民中學體育館", address: "澎湖縣馬公市陽明路115號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "馬公國民小學操場球場", address: "澎湖縣馬公市光明路62號", hours: "假日特定時間開放", type: "籃球/體育館/校園" }
  ],
  "金門縣": [
    { name: "金門縣立體育館", address: "金門縣金城鎮民族路261號", hours: "08:00–21:30", type: "綜合/國民運動中心" },
    { name: "金城國民中學體育館", address: "金門縣金城鎮民權路32號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "金門高中體育館與球場", address: "金門縣金城鎮光前路94號", hours: "配合校方規範開放", type: "籃球/體育館/校園" }
  ],
  "連江縣": [
    { name: "連江縣立南竿體育館", address: "連江縣南竿鄉介壽村254-2號", hours: "08:00–21:00", type: "綜合/國民運動中心" },
    { name: "介壽國民中小學體育場", address: "連江縣南竿鄉介壽村262號", hours: "配合學校開放時間", type: "籃球/體育館/校園" },
    { name: "福澳運動場籃球場", address: "連江縣南竿鄉福澳村", hours: "開放空間全天營業", type: "籃球/體育館/校園" }
  ]
};

function searchSports() {
  const selectedCity = document.getElementById('citySelect').value;
  const selectedSport = document.getElementById('sportSelect').value;
  
  const loading = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');
  
  loading.classList.remove('hidden');
  resultsDiv.innerHTML = '';
  
  setTimeout(() => {
    loading.classList.add('hidden');
    
    const allVenues = sportsDatabase[selectedCity] || [];
    
    // 根據選取的運動分類進行篩選 (Filter)
    const filteredVenues = allVenues.filter(venue => {
      if (selectedSport === "all") return true;
      return venue.type === selectedSport;
    });
    
    if (filteredVenues.length === 0) {
      resultsDiv.innerHTML = `<p style="color:#e74c3c; text-align:center; font-weight:bold; padding: 20px;">❌ 該縣市在此分類下暫無登記資料，請更換運動類型試試看！</p>`;
      return;
    }
    
    filteredVenues.forEach((venue) => {
      const searchQuery = `台灣 ${selectedCity} ${venue.name}`;
      
      // ✨ 修正亮點：完美的 ${} ES6 樣板語法，保證 Google Maps API 網址正確拼裝與渲染！
      const embedMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      const externalMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}`;
      
      // 動態判定要顯示的標籤顏色
      const tagClass = venue.name.includes("小學") || venue.name.includes("中學") || venue.name.includes("大學") ? "tag-school" : "tag-sport";
      
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>📍 ${venue.name} <span class="tag ${tagClass}">${venue.type}</span></h3>
        <p><strong>🏠 詳細地址：</strong> ${venue.address}</p>
        <p><strong>⏰ 開放時間：</strong> ${venue.hours}</p>
        <p><strong>⭐️ 導航與評論：</strong> <a href="${externalMapUrl}" target="_blank" class="review-link">點我前往 Google Maps 查看即時大眾星等與評論</a></p>
        
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
  }, 400);
}
