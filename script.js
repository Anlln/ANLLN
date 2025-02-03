document.addEventListener("DOMContentLoaded", function () {
    alert("歡迎來到牽引神智慧環保出行系統！");
});
document.getElementById("calculate").addEventListener("click", async function () {
    let resultBox = document.getElementById("result");

    // 讓結果區塊隱藏，準備執行動畫
    resultBox.style.opacity = "0";
    resultBox.style.transform = "translateY(10px)";

    // 等待 200ms，再顯示計算結果，並加動畫
    setTimeout(() => {
        resultBox.style.opacity = "1";
        resultBox.style.transform = "translateY(0)";
    }, 200);

    // 這裡保持你原本的計算邏輯
});

document.getElementById("calculate").addEventListener("click", async function () {
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    
    if (start === "" || end === "") {
        document.getElementById("result").innerText = "請輸入有效的出發地與目的地！";
        return;
    }

    try {
        let startCoords = await getCoordinates(start);
        let endCoords = await getCoordinates(end);

        if (!startCoords || !endCoords) {
            document.getElementById("result").innerText = "無法獲取地點資訊，請確認輸入正確的地址。";
            return;
        }

        let distance = await getDistance(startCoords, endCoords);

        let emissionFactor = {
            car: 0.2,
            ev: 0.05,
            bus: 0.1,
            bike: 0,
            train: 0.06,
            hsr: 0.04,
            walk: 0
        };

        function getEcoLevel(emission) {
            if (emission === 0) return "🌱 超級環保（0 排放）";
            if (emission < 1) return "✅ 低排放";
            if (emission < 5) return "⚠️ 中等排放";
            return "❌ 高排放";
        }

        function getEcoColor(ecoLevel) {
            if (ecoLevel.includes("超級環保")) return "green";
            if (ecoLevel.includes("低排放")) return "blue";
            if (ecoLevel.includes("中等排放")) return "orange";
            return "red";
        }

        let transportResults = Object.keys(emissionFactor).map(mode => {
            let emission = distance * emissionFactor[mode];
            return {
                mode,
                emission,
                ecoLevel: getEcoLevel(emission)
            };
        });

        transportResults.sort((a, b) => a.emission - b.emission);

        let tableHTML = `<table>
        <tr>
            <th>排名</th>
            <th>交通方式</th>
            <th>碳排放量 (kg CO₂)</th>
            <th>環保等級</th>
        </tr>`;

        transportResults.forEach((t, index) => {
            tableHTML += `<tr>
                <td>${index + 1}</td>
                <td>${getTransportName(t.mode)}</td>
                <td>${t.emission.toFixed(2)}</td>
                <td style="color: ${getEcoColor(t.ecoLevel)}; font-weight: bold;">${t.ecoLevel}</td>
            </tr>`;
        });

        tableHTML += `</table>`;
        document.getElementById("result").innerHTML = tableHTML;
    } catch (error) {
        document.getElementById("result").innerText = "計算時發生錯誤，請稍後再試。";
    }
});

function getTransportName(mode) {
    let names = {
        car: "汽車（燃油）",
        ev: "電動車",
        bus: "公車",
        bike: "單車",
        train: "火車",
        hsr: "高鐵",
        walk: "步行"
    };
    return names[mode] || mode;
}

async function getCoordinates(location) {
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    let response = await fetch(url);
    let data = await response.json();
    return data.length > 0 ? { lat: data[0].lat, lon: data[0].lon } : null;
}

async function getDistance(startCoords, endCoords) {
    let url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=false`;
    let response = await fetch(url);
    let data = await response.json();
    return data.routes.length > 0 ? data.routes[0].distance / 1000 : null;
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("toggleInfo").addEventListener("click", function(event) {
        event.preventDefault(); // 防止跳轉
        let info = document.getElementById("extraInfo");
        info.classList.toggle("hidden"); // 切換顯示/隱藏狀態

        // 切換按鈕文字
        this.innerText = info.classList.contains("hidden") ? "點擊這裡查看更多資訊" : "隱藏資訊";
    });
});


