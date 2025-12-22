// --- 1. MQTT 連線設定 ---
// 使用公開的 EMQX Broker，這是網頁常用的加密 WebSocket 協定
const broker = 'wss://broker.emqx.io:8084/mqtt'; 
// 主題必須與 ESP32 程式碼中的 client.subscribe("YUN/status") 完全一致
const topic = 'YUN/status'; 
const client = mqtt.connect(broker);

// --- 2. 取得 HTML 元件 ---
const statusText = document.getElementById('status-text');
const toggle = document.getElementById('toggle-trigger');

// --- 3. MQTT 事件監聽 ---
// 當成功連接到 MQTT 伺服器時
client.on('connect', () => {
    console.log('已連接至 MQTT Broker');
    if (statusText) {
        statusText.innerText = 'ESP32 狀態：已連線 (MQTT)';
    }
});

// 當連線發生錯誤時
client.on('error', (err) => {
    console.error('MQTT 連線錯誤: ', err);
    if (statusText) {
        statusText.innerText = '狀態：連線失敗';
    }
});

// --- 4. 監聽開關動作 ---
// 當你點擊網頁上的 Slider 開關時
if (toggle) {
    toggle.addEventListener('change', function() {
        if (this.checked) {
            // 發送字串 '1' 給 ESP32 開燈
            client.publish(topic, '1');
            console.log('發送指令：1 (開啟)');
        } else {
            // 發送字串 '0' 給 ESP32 關燈
            client.publish(topic, '0');
            console.log('發送指令：0 (關閉)');
        }
    });
}
