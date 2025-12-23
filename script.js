// --- 1. MQTT 連線設定 ---
const broker = 'wss://broker.emqx.io:8084/mqtt';
const topic = 'YUN/status'; // 與 ESP32 溝通的主題
const client = mqtt.connect(broker);

// --- 2. 取得 HTML 元件 ---
const statusText = document.getElementById('status-text');
const toggle = document.getElementById('toggle-trigger');
const statusDot = document.getElementById('status-dot');

// --- 3. MQTT 事件監聽 ---

// 當成功連接至 MQTT 伺服器時
client.on('connect', () => {
    console.log('已連接至 MQTT Broker');
    if (statusText) statusText.innerText = 'ESP32 狀態：已連線 (MQTT)';
    if (statusDot) statusDot.style.backgroundColor = '#10b981'; // 變綠色
    
    // 訂閱主題，這樣如果別的手機開燈，這個網頁也會跟著動
    client.subscribe(topic);
});

// 當收到訊息時 (讓網頁開關與實體燈同步)
client.on('message', (t, message) => {
    if (t === topic) {
        const msg = message.toString();
        if (msg === '1') {
            toggle.checked = true;
        } else if (msg === '0') {
            toggle.checked = false;
        }
    }
});

// 當連線發生錯誤時
client.on('error', (err) => {
    console.error('MQTT 連線錯誤: ', err);
    if (statusText) statusText.innerText = '狀態：連線失敗';
    if (statusDot) statusDot.style.backgroundColor = '#ef4444'; // 變紅色
});

// --- 4. 監聽開關動作 ---
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
