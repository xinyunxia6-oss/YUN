// 連接免費公共 MQTT 伺服器 (使用 WebSocket 加密通訊)
const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

const checkbox = document.getElementById('toggle-trigger');
const statusText = document.getElementById('status-text');
const topic = "xinyun_iot/led_1"; // <--- 這裡請改成你自定義的主題名稱

client.on('connect', () => {
    statusText.innerText = "已連線至雲端伺服器";
});

checkbox.addEventListener('change', function() {
    let msg = this.checked ? "ON" : "OFF";
    
    // 發送訊號
    client.publish(topic, msg);
    
    if (this.checked) {
        statusText.innerText = "指令：開啟 (ON)";
        document.body.style.backgroundColor = "#d4edda";
    } else {
        statusText.innerText = "指令：關閉 (OFF)";
        document.body.style.backgroundColor = "#f8d7da";
    }
});
