const puppeteer = require('puppeteer');

async function autoLogin() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    });

    try {
        const page = await browser.newPage();
        
        // User-Agent設定
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        
        console.log('ログインページにアクセス中...');
        // ここにログインページのURLを設定
        await page.goto('https://secure.shisaku-pad.co.jp', { waitUntil: 'networkidle2' });
        
        // メールアドレス入力
        console.log('メールアドレスを入力中...');
        await page.waitForSelector('input[placeholder="example@fukuri-app.jp"]');
        await page.type('input[placeholder="example@shisaku-pad.co.jp"]', process.env.LOGIN_EMAIL);
        
        // パスワード入力
        console.log('パスワードを入力中...');
        await page.waitForSelector('input[placeholder="********"]');
        await page.type('input[placeholder="********"]', process.env.LOGIN_PASSWORD);
        
        // ログインボタンクリック
        console.log('ログインボタンをクリック中...');
        await page.waitForSelector('p:contains("ログイン")');
        await page.click('p:contains("ログイン")');
        
        // 遷移待機
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        
        // 遷移後の画面情報取得
        console.log('遷移後の画面情報を取得中...');
        const pageTitle = await page.title();
        const currentUrl = page.url();
        const pageContent = await page.content();
        
        console.log('=== 実行結果 ===');
        console.log('ページタイトル:', pageTitle);
        console.log('現在のURL:', currentUrl);
        console.log('ページ内容の文字数:', pageContent.length);
        
        // スクリーンショット保存
        await page.screenshot({ path: 'result.png', fullPage: true });
        console.log('スクリーンショットを保存しました');
        
        return {
            success: true,
            title: pageTitle,
            url: currentUrl,
            contentLength: pageContent.length
        };
        
    } catch (error) {
        console.error('エラーが発生しました:', error);
        return {
            success: false,
            error: error.message
        };
    } finally {
        await browser.close();
    }
}

// 実行
autoLogin().then(result => {
    console.log('最終結果:', result);
    process.exit(result.success ? 0 : 1);
});
