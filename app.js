export default async function handler(req, res) {
    // 允許跨網域存取 (CORS)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: '僅支援 POST 請求' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: '後端未設定 GEMINI_API_KEY' });
    }

    const { location, foodType, distance, mealTime } = req.body;

    const userPrompt = `目前位置：${location}，想吃類型：${foodType}，接受距離：${distance}，吃飯時間：${mealTime}。請幫我找真實存在於該地區附近的 3 家餐廳，並給出評價。`;
    
    const systemInstruction = `你是一個專業的美食推薦助手。請根據使用者的地理位置和需求，推薦真實存在的餐廳。
    你必須嚴格使用 JSON 陣列格式輸出，格式必須如下，不要包含任何 \`\`\`json 標籤或 markdown 文字：
    [
      {"name": "餐廳名稱", "type": "類型", "distance": "預估距離", "rating": "星等與簡評", "reason": "推薦理由"}
    ]`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const geminiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }],
                systemInstruction: { parts: [{ text: systemInstruction }] },
                generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.5
                }
            })
        });

        const data = await geminiResponse.json();
        const rawJsonText = data.candidates[0].content.parts[0].text;
        
        return res.status(200).json(JSON.parse(rawJsonText));
    } catch (error) {
        return res.status(500).json({ error: '後端與 Gemini 連線失敗', details: error.message });
    }
}
