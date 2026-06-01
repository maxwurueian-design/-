 document.getElementById('searchBtn').addEventListener('click', searchSports);

// 🎯 真實資料庫：完美對齊 center (運動中心)、school (國中小校園)、court (羽網球場/公園)
const sportsDatabase = {
  "基隆市": [
    { name: "基隆市國民運動中心", address: "基隆市仁愛區仁愛路19號", hours: "06:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "信義國民小學體育館", address: "基隆市信義區仁二路135號", hours: "配合學校開放時間", type: "school", typeText: "籃球/體育館/校園" },
    { name: "基隆市立成功國民中學", address: "基隆市仁愛區壽山路2號", hours: "配合學校開放時間", type: "school", typeText: "籃球/體育館/校園" }
  ],
  "台北市": [
    { name: "大安國民運動中心", address: "台北市大安區辛亥路三段55號", hours: "06:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "信義國民運動中心", address: "台北市信義區松勤街100號", hours: "06:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "金華國民中學藍球場", address: "台北市大安區新生南路二段84號", hours: "課後及假日開放", type: "school", typeText: "籃球/體育館/校園" },
    { name: "新生高架橋下籃球場", address: "台北市中山區新生高架橋與長安東路口", hours: "24小時開放", type: "school", typeText: "籃球/體育館/校園" },
    { name: "敦化國民小學活動中心", address: "台北市松山區敦化北路2號", hours: "配合學校開放時間", type: "court", typeText: "羽毛球/網球場" }
  ],
  "新北市": [
    { name: "板橋國民運動中心", address: "新北市板橋區智樂路6號", hours: "06:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "海山國民中學體育館", address: "新北市板橋區漢生東路215號", hours: "配合學校開放時間", type: "school", typeText: "籃球/體育館/校園" },
    { name: "永和國民小學運動場", address: "新北市永和區秀朗路一段120號", hours: "課後與假日開放", type: "school", typeText: "籃球/體育館/校園" },
    { name: "泰山體育館", address: "新北市泰山區同義里公園路54號", hours: "08:00–22:00", type: "school", typeText: "籃球/體育館/校園" }
  ],
  "桃園市": [
    { name: "桃園國民運動中心", address: "桃園市桃園區中山東路233號", hours: "06:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "桃園市立桃園國民中學", address: "桃園市桃園區中山路232號", hours: "配合學校開放時間", type: "school", typeText: "籃球/體育館/校園" },
    { name: "中埔國民小學運動場", address: "桃園市桃園區永安路1054號", hours: "依校方公告為準", type: "school", typeText: "籃球/體育館/校園" }
  ],
  "新竹市": [
    { name: "新竹市新科國民運動中心", address: "新竹市東區光復路一段89巷163號", hours: "06:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "培英國民中學體育館", address: "新竹市東區學府路4號", hours: "配合學校開放時間", type: "school", typeText: "籃球/體育館/校園" },
    { name: "東門國民小學操場", address: "新竹市東區民族路33號", hours: "課後與假日開放", type: "school", typeText: "籃球/體育館/校園" }
  ],
  "新竹縣": [
    { name: "新竹縣竹北國民運動中心", address: "新竹縣竹北市莊敬南路18號", hours: "06:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "竹北國民中學體育館", address: "新竹縣竹北市中正西路6號", hours: "配合學校開放時間", type: "school", typeText: "籃球/體育館/校園" },
    { name: "光明國民小學球場", address: "新竹縣竹北市光明六路516號", hours: "依學校開放公告", type: "school", typeText: "籃球/體育館/校園" }
  ],
  "苗栗縣": [
    { name: "苗栗縣立體育館", address: "苗栗縣苗栗市中正路191號", hours: "08:00–21:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "苗栗國民中學", address: "苗栗縣苗栗市府前路145號", hours: "配合學校開放時間", type: "school", typeText: "籃球/體育館/校園" },
    { name: "建功國民小學", address: "苗栗縣苗栗市中正路211號", hours: "假日開放", type: "school", typeText: "籃球/體育館/校園" }
  ],
  "台中市": [
    { name: "朝馬國民運動中心", address: "台中市西屯區朝貴路199號", hours: "06:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "居仁國民中學體育場", address: "台中市西區自由路一段99號", hours: "配合學校開放時間", type: "school", typeText: "籃球/體育館/校園" },
    { name: "惠文國民小學風雨球場", address: "台中市南屯區公益路二段300號", hours: "課後及假日開放", type: "school", typeText: "籃球/體育館/校園" }
  ],
  "彰化縣": [
    { name: "彰化彰北國民運動中心", address: "彰化縣彰化市建國東路2號", hours: "06:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "彰化藝術國民中學", address: "彰化縣彰化市卦山路13號", hours: "配合校方時間開放", type: "school", typeText: "籃球/體育館/校園" },
    { name: "彰化市中山國民小學", address: "彰化縣彰化市中山路二段848號", hours: "假日開放", type: "school", typeText: "籃球/體育館/校園" }
  ],
  "南投縣": [
    { name: "南投縣立體育場", address: "南投縣南投市南陽路1號", hours: "05:00–22:00", type: "center", typeText: "綜合/國民運動中心" },
    { name: "南投國民中學", address: "南投縣南投市祖祠路361號", hours: "配合學校開放時間", type: "school", typeText: "籃球/體育館/校園" },
    { name: "南投國民小學", address: "南投縣南投市彰南路二段105號", hours: "假日特定時間開放", type: "school", typeText
