function scanMessage() {

    const messageInput = document.getElementById("messageInput");
    const resultBox = document.getElementById("resultBox");
    const resultTitle = document.getElementById("resultTitle");
    const riskScore = document.getElementById("riskScore");
    const riskLevel = document.getElementById("riskLevel");
    const riskBar = document.getElementById("riskBar");
    const reasonsList = document.getElementById("reasonsList");
    const recommendationText = document.getElementById("recommendationText");
    const scanButton = document.querySelector(".scan-btn");

    const message = messageInput.value.trim().toLowerCase();

    if (message === "") {
        alert("Please enter a message to scan.");
        return;
    }

    scanButton.disabled = true;
    scanButton.textContent = "🔍 Scanning...";

    resultBox.style.display = "none";

    setTimeout(function () {

        let score = 0;
        let reasons = [];

        // =========================
        // THREAT PATTERNS
        // =========================

        const patterns = [

            {
                words: ["otp", "one time password"],
                score: 30,
                reason: "The message asks for an OTP."
            },

            {
                words: ["password", "passcode"],
                score: 25,
                reason: "The message asks for sensitive login information."
            },

            {
                words: ["winner", "won", "congratulations", "prize", "reward"],
                score: 25,
                reason: "The message contains prize or reward language."
            },

            {
                words: ["click here", "click the link", "verify your account"],
                score: 25,
                reason: "The message contains a suspicious call-to-action."
            },

            {
                words: ["urgent", "immediately", "act now", "account blocked"],
                score: 20,
                reason: "The message creates urgency or pressure."
            },

            {
                words: ["bank", "credit card", "debit card", "upi"],
                score: 20,
                reason: "The message mentions financial information."
            },

            {
                words: ["send money", "transfer money", "pay now"],
                score: 30,
                reason: "The message requests a financial transaction."
            }

        ];


        // =========================
        // CHECK PATTERNS
        // =========================

        patterns.forEach(function (pattern) {

            pattern.words.forEach(function (word) {

                if (message.includes(word)) {

                    score += pattern.score;

                    if (!reasons.includes(pattern.reason)) {
                        reasons.push(pattern.reason);
                    }

                }

            });

        });


        // =========================
        // LINK DETECTION
        // =========================

        const urlPattern =
            /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

        const detectedLinks =
            message.match(urlPattern);

        if (detectedLinks) {

            score += 20;

            reasons.push(
                "The message contains a web link that should be checked carefully."
            );

            detectedLinks.forEach(function (link) {

                if (
                    link.includes("bit.ly") ||
                    link.includes("tinyurl") ||
                    link.includes("shorturl") ||
                    link.includes("t.co")
                ) {

                    score += 20;

                    reasons.push(
                        "The link uses a URL-shortening service."
                    );

                }

            });

        }


        // =========================
        // LIMIT SCORE
        // =========================

        if (score > 100) {
            score = 100;
        }

// =========================
// AI ANALYSIS
// =========================

const keywordStatus =
    document.getElementById("keywordStatus");

const linkStatus =
    document.getElementById("linkStatus");

const sensitiveStatus =
    document.getElementById("sensitiveStatus");

const patternStatus =
    document.getElementById("patternStatus");


// Keyword analysis
if (reasons.length > 0) {
    keywordStatus.textContent = "⚠️ Detected";
} else {
    keywordStatus.textContent = "✅ Clear";
}


// Link analysis
if (detectedLinks) {
    linkStatus.textContent = "⚠️ Found";
} else {
    linkStatus.textContent = "✅ No Links";
}


// Sensitive information
if (
    message.includes("otp") ||
    message.includes("password") ||
    message.includes("passcode") ||
    message.includes("bank") ||
    message.includes("credit card") ||
    message.includes("debit card") ||
    message.includes("upi")
) {
    sensitiveStatus.textContent = "⚠️ Detected";
} else {
    sensitiveStatus.textContent = "✅ Clear";
}


// Threat patterns
if (score >= 60) {
    patternStatus.textContent = "🚨 High Risk";
} else if (score >= 30) {
    patternStatus.textContent = "⚠️ Suspicious";
} else {
    patternStatus.textContent = "✅ No Threat";
}
        // =========================
        // SHOW RESULT
        // =========================

        resultBox.style.display = "block";

        resultBox.classList.remove(
            "safe",
            "warning",
            "danger"
        );

        reasonsList.innerHTML = "";


        // =========================
        // SAFE
        // =========================

        if (score < 30) {

            resultBox.classList.add("safe");

            resultTitle.textContent =
                "🛡️ Looks Safe";

            riskLevel.textContent =
                "🟢 LOW RISK";

            riskScore.textContent =
                "Risk Score: " + score + "/100";

            recommendationText.textContent =
                "This message appears safe. Still avoid sharing passwords, OTPs, or sensitive information.";

            riskBar.style.width = score + "%";

            reasonsList.innerHTML =
                "<li>No major suspicious patterns were detected.</li>";

        }


        // =========================
        // SUSPICIOUS
        // =========================

        else if (score < 60) {

            resultBox.classList.add("warning");

            resultTitle.textContent =
                "⚠️ Suspicious Message";

            riskLevel.textContent =
                "🟡 MEDIUM RISK";

            riskScore.textContent =
                "Risk Score: " + score + "/100";

            recommendationText.textContent =
                "Be careful with this message. Do not click unknown links or provide personal information.";

            riskBar.style.width = score + "%";

            reasons.forEach(function (reason) {

                const li =
                    document.createElement("li");

                li.textContent = reason;

                reasonsList.appendChild(li);

            });

        }


        // =========================
        // HIGH RISK
        // =========================

        else {

            resultBox.classList.add("danger");

            resultTitle.textContent =
                "🚨 Potential Threat Detected";

            riskLevel.textContent =
                "🔴 HIGH RISK";

            riskScore.textContent =
                "Risk Score: " + score + "/100";

            recommendationText.textContent =
                "Do not click suspicious links or share OTPs, passwords, banking details, or other sensitive information.";

            riskBar.style.width = score + "%";

            reasons.forEach(function (reason) {

                const li =
                    document.createElement("li");

                li.textContent = reason;

                reasonsList.appendChild(li);

            });

        }


        // =========================
        // ADD HISTORY
        // =========================

        addToHistory(
            messageInput.value,
            score
        );


        // =========================
        // UPDATE STATISTICS
        // =========================

        updateStatistics();


        // =========================
        // RESTORE BUTTON
        // =========================

        scanButton.disabled = false;

        scanButton.textContent =
            "🔍 Scan Message";

    }, 1000);

}


// ==================================
// ADD SCAN TO HISTORY
// ==================================

function addToHistory(message, score) {

    let history =
        JSON.parse(
            localStorage.getItem("cyberShieldHistory")
        ) || [];


    let result;

    if (score < 30) {
        result = "🛡️ Looks Safe";
    }
    else if (score < 60) {
        result = "⚠️ Suspicious Message";
    }
    else {
        result = "🚨 Potential Threat Detected";
    }


    const item = {
        message: message,
        result: result,
        score: score
    };


    history.unshift(item);

    history = history.slice(0, 10);


    localStorage.setItem(
        "cyberShieldHistory",
        JSON.stringify(history)
    );


    displayHistory();

}


// ==================================
// DISPLAY HISTORY
// ==================================

function displayHistory() {

    const historyList =
        document.getElementById("historyList");

    if (!historyList) {
        return;
    }


    let history =
        JSON.parse(
            localStorage.getItem("cyberShieldHistory")
        ) || [];


    if (history.length === 0) {

        historyList.innerHTML =
            '<p class="empty-history">No scans yet.</p>';

        return;
    }


    historyList.innerHTML = "";


    history.forEach(function (item) {

        const historyItem =
            document.createElement("div");

        historyItem.className =
            "history-item";


        historyItem.innerHTML = `
            <div class="history-message">
                ${item.message.substring(0, 100)}
                ${item.message.length > 100 ? "..." : ""}
            </div>

            <div class="history-result">
                ${item.result}
                — Risk Score: ${item.score}/100
            </div>
        `;


        historyList.appendChild(historyItem);

    });

}


// ==================================
// UPDATE STATISTICS
// ==================================

function updateStatistics() {

    const history =
        JSON.parse(
            localStorage.getItem("cyberShieldHistory")
        ) || [];


    let threats = 0;
    let safe = 0;
    let highRisk = 0;


    history.forEach(function (item) {

        if (item.score >= 60) {
            threats++;
            highRisk++;
        }

        if (item.score < 30) {
            safe++;
        }

    });


    const totalElement =
        document.getElementById("totalScans");

    const threatElement =
        document.getElementById("threatsDetected");

    const safeElement =
        document.getElementById("safeMessages");

    const highRiskElement =
        document.getElementById("highRisk");


    if (totalElement) {
        totalElement.textContent =
            history.length;
    }

    if (threatElement) {
        threatElement.textContent =
            threats;
    }

    if (safeElement) {
        safeElement.textContent =
            safe;
    }

    if (highRiskElement) {
        highRiskElement.textContent =
            highRisk;
    }

}


// ==================================
// CLEAR HISTORY
// ==================================

function clearHistory() {

    const confirmClear =
        confirm(
            "Are you sure you want to clear all scan history?"
        );


    if (!confirmClear) {
        return;
    }


    localStorage.removeItem(
        "cyberShieldHistory"
    );


    displayHistory();

    updateStatistics();

}


// ==================================
// LOAD DATA WHEN PAGE OPENS
// ==================================

displayHistory();

updateStatistics();