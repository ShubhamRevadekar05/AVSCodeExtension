const axios = require("axios");
axios.post("https://papersowl.com/plagiarism-checker-send-data", {
        is_free: false,
        plagchecker_locale: "en",
        title: "",
        text: "Blockchain is the backbone Technology of Digital CryptoCurrency BitCoin. The blockchain is a distributed database of records of all transactions or digital event that have been executed and shared among participating parties. Each transaction verified by the majority of participants of the system. It contains every single record of each transaction. BitCoin is the most popular cryptocurrency an example of the blockchain. Blockchain Technology first came to light when a person or Group of individuals name ‘Satoshi Nakamoto’ published a white paper on “BitCoin: A peer to peer electronic cash system” in 2008. Blockchain Technology Records Transaction in Digital Ledger which is distributed over the Network thus making it incorruptible. Anything of value like Land Assets, Cars, etc. can be recorded on Blockchain as a Transaction.".replace(" ", "+")
    }, {
        "headers": {
            "accept": "*/*",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://papersowl.com/free-plagiarism-checker",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }
}).then(res => console.log(res.data));