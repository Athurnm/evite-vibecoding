import http from 'http';

const checkUrl = (url) => {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            const { statusCode } = res;
            if (statusCode !== 200) {
                res.resume();
                reject(new Error(`Request Failed. Status Code: ${statusCode}`));
                return;
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                resolve(rawData);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });
    });
};

const run = async () => {
    try {
        console.log("Checking Homepage (http://localhost:5173/)...");
        const home = await checkUrl('http://localhost:5173/');

        // Simple content check
        if (home.includes('<title>')) {
            console.log("SUCCESS: Homepage loaded.");
        } else {
            console.warn("WARNING: Homepage loaded but title missing?");
        }

        console.log("Checking Guideline (http://localhost:5173/guideline/)...");
        const guide = await checkUrl('http://localhost:5173/guideline/');

        // Guideline page should have the script tag we added
        if (guide.includes('src="/src/guideline/main.jsx"') || guide.includes('root')) {
            console.log("SUCCESS: Guideline page structure found.");
        } else {
            console.warn("WARNING: Guideline page structure missing expected script/root.");
        }

    } catch (e) {
        console.error("Verification FAILED:", e.message);
        process.exit(1);
    }
};

run();
