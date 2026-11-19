
/**
 * getCodeSnippets(t)
 * Returns code snippet data for each testing framework tab in the CodeViewer.
 * Each snippet includes: title, description, icon, language, filename, code, and sample output.
 * The code comments are bilingual (EN/ID) so users can learn in both languages.
 * 
 * @param {object} t - Translation object from LanguageContext (either EN or ID)
 * @returns {object} - Object with keys: k6, cypress, playwright, selenium
 */
export const getCodeSnippets = (t) => ({
  k6: {
    title: t.projects.items.find(i => i.id === 'k6')?.title || 'K6 Performance',
    description: t.codeViewer?.descriptions?.k6 || 'K6 Script',
    language: 'javascript',
    filename: 'k6-load-test.js',
    // Detailed Report Data for the "Report" tab
    reportData: {
      type: 'k6',
      summary: {
        scenarios: '100% (1/1)',
        maxVUs: 100,
        duration: '2m 20s',
        totalReqs: 9042,
        failedReqs: 0,
        reqsPerSec: '64.58/s'
      },
      checks: [
        { name: 'status is 200', pass: 9042, fail: 0 },
        { name: 'has token', pass: 9042, fail: 0 }
      ],
      thresholds: [
        { name: 'http_req_duration', threshold: 'p(95)<500', value: '312ms', status: 'pass' },
        { name: 'errors', threshold: 'rate<0.1', value: '0.00%', status: 'pass' }
      ]
    },
    code: `/* ============================================================
 * K6 LOAD TESTING SCRIPT: Tutorial & Documentation
 * ============================================================
 * 
 * WHAT IS THIS?
 * APA INI?
 * This script tests how your API performs under heavy traffic.
 * Script ini menguji performa API-mu saat trafik tinggi.
 *
 * HOW IT WORKS:
 * CARA KERJA:
 *   1. Define metrics to track (error rate, response time)
 *   1. Tentukan metrik untuk dilacak (tingkat error, waktu respons)
 *   2. Set load stages (warm up → peak → cooldown)
 *   2. Atur tahapan beban (pemanasan → puncak → pendinginan)
 *   3. Simulate virtual users doing login + API calls
 *   3. Simulasikan user virtual melakukan login + panggilan API
 *   4. Check if results meet pass/fail thresholds
 *   4. Cek apakah hasil memenuhi ambang batas lulus/gagal
 *
 * TOOLS USED: K6 (grafana.com/oss/k6)
 * ALAT YANG DIGUNAKAN: K6 (grafana.com/oss/k6)
 * LANGUAGE: JavaScript
 * BAHASA: JavaScript
 * ============================================================ */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ─── STEP 1: DEFINE CUSTOM METRICS ─────────────────────────
// Purpose: Track specific performance indicators
// Tujuan: Melacak indikator performa spesifik
//
// - errorRate: Percentage of failed requests
// - errorRate: Persentase request gagal
// - loginDuration: How long login takes in ms
// - loginDuration: Berapa lama login dalam ms
const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');

// ─── STEP 2: CONFIGURE LOAD STAGES ─────────────────────────
// Purpose: Define how many virtual users (VUs) run at each phase
// Tujuan: Menentukan berapa user virtual di setiap tahap
//
// Think of it like a wave:
// Bayangkan seperti gelombang:
//   🌊 Start small → Build up → Peak stress → Cool down
//   🌊 Mulai kecil → Membangun → Tekanan puncak → Pendinginan
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Warm up: Gradually add 10 users
    // Pemanasan: Tambahkan 10 user secara bertahap
    { duration: '1m',  target: 50 },   // Normal load: Maintain 50 users  
    // Beban normal: Pertahankan 50 user
    { duration: '30s', target: 100 },  // Stress test: Push to 100 users
    // Stress test: Dorong hingga 100 user
    { duration: '20s', target: 0 },    // Cooldown: Gracefully reduce to 0
    // Pendinginan: Kurangi perlahan ke 0
  ],
  thresholds: {
    // Pass/Fail Criteria: the test FAILS if these are not met:
    // Kriteria Lulus/Gagal: tes GAGAL jika ini tidak terpenuhi:
    http_req_duration: ['p(95)<500'],   // 95% of requests must be under 500ms
    // 95% request harus di bawah 500ms
    errors: ['rate<0.1'],               // Error rate must be under 10%
    // Tingkat error harus di bawah 10%
  },
};

const BASE_URL = 'https://api.example.com';

// ─── STEP 3: MAIN TEST FUNCTION ────────────────────────────
// Purpose: This runs for EACH virtual user, simulating real behavior
// Tujuan: Ini dijalankan untuk SETIAP user virtual, mensimulasikan perilaku nyata
export default function () {
  group('User Authentication Flow', () => {
    
    // Step 3a: Send Login Request
    // Langkah 3a: Kirim Request Login
    const payload = JSON.stringify({
      email: 'testuser@example.com',
      password: 'securePass123!',
    });

    const loginRes = http.post(\`\${BASE_URL}/api/auth/login\`, payload, {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'login' },  // Tag for filtering in reports
    });

    // Step 3b: Record how long the login took
    // Langkah 3b: Catat berapa lama login berlangsung
    loginDuration.add(loginRes.timings.duration);

    // Step 3c: Validate the response
    // Langkah 3c: Validasi response-nya
    const success = check(loginRes, {
      'status is 200': (r) => r.status === 200,        // HTTP OK
      'has token': (r) => JSON.parse(r.body).token !== undefined, // JWT exists
    });

    // Record if this request was an error
    // Catat jika request ini error
    errorRate.add(!success);

    // Step 3d: If login succeeded, do authenticated actions
    // Langkah 3d: Jika login berhasil, lakukan aksi terautentikasi
    if (success) {
      const token = JSON.parse(loginRes.body).token;
      const headers = { headers: { Authorization: \`Bearer \${token}\` } };

      // Fetch user profile with auth token
      // Ambil profil user dengan token autentikasi
      http.get(\`\${BASE_URL}/api/user/profile\`, headers);
      
      // Pause to simulate real user thinking time (1 second)
      // Jeda untuk simulasi waktu berpikir user nyata (1 detik)
      sleep(1); 
    }
  });
}`,
    runOutput: `          /\\      |‾‾| /‾‾/   /‾‾/
     /\\  /  \\     |  |/  /   /  /
    /  \\/    \\    |     (   /   ‾‾\\
   /          \\   |  |\\  \\ |  (‾)  |
  / __________ \\  |__| \\__\\ \\_____/ .io

  execution: local
     script: k6-load-test.js
     output: -

  scenarios: (100.00%) 1 scenario, 100 max VUs, 2m20s max duration
             ramp-up: 30s → 10 VUs → 1m → 50 VUs → 30s → 100 VUs → 20s → 0 VUs

  running (2m20.0s), 000/100 VUs, 4521 complete iterations

     ✓ status is 200
     ✓ has token

     checks.........................: 100.00% ✓ 9042  ✗ 0
     data_received..................: 12 MB   86 kB/s
     data_sent......................: 2.1 MB  15 kB/s
     errors.........................: 0.00%   ✓ 0     ✗ 9042
   ✓ http_req_duration..............: avg=123.4ms  min=45ms  med=98ms  max=487ms  p(90)=256ms  p(95)=312ms
     http_req_failed................: 0.00%   ✓ 0     ✗ 4521
     http_reqs......................: 9042    64.58/s
     iteration_duration.............: avg=1.12s    min=1.04s med=1.09s max=1.52s  p(90)=1.28s
     login_duration.................: avg=123.4ms  min=45ms  med=98ms  max=487ms  p(90)=256ms
     vus............................: 0       min=0   max=100
     vus_max........................: 100     min=100 max=100

  ✅ All thresholds passed!
  ✅ No errors detected: API is stable under load.`
  },
  cypress: {
    title: t.projects.items.find(i => i.id === 'cypress')?.title || 'Cypress E2E',
    description: t.codeViewer?.descriptions?.cypress || 'Cypress Suite',
    language: 'javascript',
    filename: 'cypress-e2e.cy.js',
    reportData: {
      type: 'cypress',
      stats: {
        passes: 2,
        failures: 0,
        pending: 0,
        duration: '4.12s'
      },
      suites: [
        {
          title: 'should login with valid credentials',
          status: 'pass',
          duration: '1.81s',
          steps: [
            'POST /api/auth/login (200)',
            'Location change to /dashboard',
            'Found element <h1> containing "Welcome"'
          ]
        },
        {
          title: 'should add item to cart',
          status: 'pass',
          duration: '2.31s',
          steps: [
            'Login via API command',
            'Visit /products',
            'Click .product-card',
            'Click [data-testid="add-cart"]',
            'Assert .cart-badge contains "1"'
          ]
        }
      ]
    },
    code: `/// <reference types="cypress" />

/* ============================================================
 * CYPRESS END-TO-END (E2E) TEST SUITE: Tutorial & Documentation
 * ============================================================
 *
 * WHAT IS THIS?
 * APA INI?
 * This test simulates a REAL USER using an e-commerce website.
 * Test ini mensimulasikan PENGGUNA NYATA menggunakan website e-commerce.
 *
 * WHAT IT TESTS:
 * YANG DIUJI:
 *   1. Login with valid credentials
 *   1. Login dengan kredensial valid
 *   2. Add product to cart
 *   2. Tambah produk ke keranjang
 *
 * KEY CONCEPTS:
 * KONSEP KUNCI:
 *   - cy.intercept(): Catch network requests for validation
 *   - cy.intercept(): Menangkap request jaringan untuk validasi
 *   - data-testid: Reliable way to target HTML elements
 *   - data-testid: Cara terpercaya untuk menargetkan elemen HTML
 *   - Custom Commands: Reusable login logic
 *   - Custom Commands: Logika login yang bisa dipakai ulang
 *
 * TOOLS USED: Cypress (cypress.io)
 * ALAT YANG DIGUNAKAN: Cypress (cypress.io)
 * LANGUAGE: JavaScript
 * BAHASA: JavaScript
 * ============================================================ */

describe('E-Commerce E2E Tests', () => {
  const user = {
    email: 'testuser@example.com',
    password: 'securePass123!',
  };

  // ─── STEP 1: SETUP BEFORE EACH TEST ───────────────────────
  // Purpose: Reset state so each test starts fresh
  // Tujuan: Reset state agar setiap test mulai dari awal
  beforeEach(() => {
    // Clear cookies to prevent session carryover
    // Hapus cookie untuk mencegah sesi terbawa
    cy.clearCookies();
    
    // Intercept the login API call so we can validate it later
    // Cegat panggilan API login agar bisa divalidasi nanti
    cy.intercept('POST', '/api/auth/login').as('loginReq');
  });

  // ─── STEP 2: TEST LOGIN FLOW ──────────────────────────────
  // Purpose: Verify user can log in and reach the dashboard
  // Tujuan: Verifikasi user bisa login dan sampai ke dashboard
  it('should login with valid credentials', () => {
    // Navigate to the login page
    // Navigasi ke halaman login
    cy.visit('/login');

    // Fill in the form fields using data-testid selectors
    // Isi field form menggunakan selector data-testid
    cy.get('[data-testid="email"]').type(user.email);
    cy.get('[data-testid="password"]').type(user.password);
    cy.get('[data-testid="login-btn"]').click();

    // Wait for the API response and verify it returned 200 (OK)
    // Tunggu response API dan verifikasi mengembalikan 200 (OK)
    cy.wait('@loginReq').its('response.statusCode').should('eq', 200);
    
    // Check that URL changed to dashboard (login was successful)
    // Cek bahwa URL berubah ke dashboard (login berhasil)
    cy.url().should('include', '/dashboard');
    cy.get('h1').should('contain', 'Welcome');
  });

  // ─── STEP 3: TEST SHOPPING FLOW ──────────────────────────
  // Purpose: Verify user can add items to their cart
  // Tujuan: Verifikasi user bisa menambahkan item ke keranjang
  it('should add item to cart', () => {
    // Use custom command to login via API (faster than UI login)
    // Gunakan custom command untuk login via API (lebih cepat)
    cy.loginViaAPI(user.email, user.password);
    
    // Go to products page and click the first product
    // Pergi ke halaman produk dan klik produk pertama
    cy.visit('/products');
    cy.get('.product-card').first().click();
    
    // Click "Add to Cart" button
    // Klik tombol "Tambah ke Keranjang"
    cy.get('[data-testid="add-cart"]').click();
    
    // Verify the cart badge shows "1" item
    // Verifikasi badge keranjang menunjukkan "1" item
    cy.get('.cart-badge').should('contain', '1');
  });
});`,
    runOutput: `  ════════════════════════════════════════════════════
  Running:  cypress-e2e.cy.js                      (1 of 1)
  ════════════════════════════════════════════════════

  E-Commerce E2E Tests
    ✓ should login with valid credentials (1.8s)
      ↳ POST /api/auth/login → 200 OK (145ms)
      ↳ Redirected to /dashboard
      ↳ Welcome message verified
    ✓ should add item to cart (2.3s)
      ↳ Login via API → 200 OK (89ms)
      ↳ Navigated to /products
      ↳ Clicked first product card
      ↳ Added to cart → badge shows "1"

  2 passing (4.1s)
  0 failing

  ┌────────────────────────────────────┐
  │ Tests:        2                    │
  │ Passing:      2                    │
  │ Failing:      0                    │
  │ Pending:      0                    │
  │ Skipped:      0                    │
  │ Screenshots:  0                    │
  │ Video:        true                 │
  │ Duration:     4 seconds            │
  │ Spec Ran:     cypress-e2e.cy.js    │
  └────────────────────────────────────┘

  ✅ All specs passed!`
  },
  playwright: {
    title: t.projects.items.find(i => i.id === 'playwright')?.title || 'Playwright POM',
    description: t.codeViewer?.descriptions?.playwright || 'Playwright Script',
    language: 'javascript',
    filename: 'playwright.spec.js',
    reportData: {
      type: 'playwright',
      stats: {
        total: 2,
        passed: 2,
        failed: 0,
        duration: '2.1s'
      },
      browsers: ['chromium'],
      tests: [
        { name: 'Authentication › successful login', duration: '1.2s', status: 'passed' },
        { name: 'Authentication › visual regression', duration: '847ms', status: 'passed' }
      ]
    },
    code: `const { test, expect } = require('@playwright/test');

/* ============================================================
 * PLAYWRIGHT TEST WITH PAGE OBJECT MODEL (POM)
 * ============================================================
 *
 * WHAT IS THIS?
 * APA INI?
 * This demonstrates the POM pattern: a way to organize test code
 * so it's easy to maintain and reuse.
 * Ini mendemonstrasikan pola POM: cara mengorganisir kode test
 * agar mudah di-maintain dan digunakan ulang.
 *
 * WHY USE POM?
 * MENGAPA PAKAI POM?
 *   ❌ Without POM: Selectors repeated everywhere, hard to update
 *   ❌ Tanpa POM: Selector diulang dimana-mana, susah update
 *   ✅ With POM: Selectors in one place, change once = fixed everywhere
 *   ✅ Dengan POM: Selector di satu tempat, ubah sekali = beres
 *
 * STRUCTURE:
 * STRUKTUR:
 *   1. Page Object class (LoginPage): encapsulates all interactions
 *   1. Class Page Object (LoginPage): enkapsulasi semua interaksi
 *   2. Test suite: uses the Page Object for clean, readable tests
 *   2. Test suite: gunakan Page Object untuk test yang rapi & terbaca
 *
 * TOOLS USED: Playwright (playwright.dev)
 * ALAT YANG DIGUNAKAN: Playwright (playwright.dev)
 * LANGUAGE: JavaScript
 * BAHASA: JavaScript
 * ============================================================ */

// ─── STEP 1: CREATE PAGE OBJECT CLASS ──────────────────────
// Purpose: Encapsulate all login page interactions in one place
// Tujuan: Enkapsulasi semua interaksi halaman login di satu tempat
//
// Benefits:
// Keuntungan:
//   - If a selector changes, update it HERE only
//   - Jika selector berubah, update di SINI saja
//   - Methods like login() can be reused across many tests
//   - Method seperti login() bisa dipakai ulang di banyak test
class LoginPage {
  constructor(page) {
    this.page = page;
    // Define element locators: single source of truth
    // Definisikan locator elemen: satu sumber kebenaran
    this.email = page.locator('#email');
    this.pass = page.locator('#password');
    this.btn = page.locator('#login-btn');
  }

  // Reusable login method: call this from any test
  // Method login yang reusable: panggil dari test manapun
  async login(user, password) {
    await this.email.fill(user);     // Type email
    // Ketik email
    await this.pass.fill(password);  // Type password
    // Ketik password
    await this.btn.click();          // Click login
    // Klik login
  }
}

// ─── STEP 2: WRITE TEST SUITE ──────────────────────────────
// Purpose: Test authentication using our LoginPage object
// Tujuan: Test autentikasi menggunakan objek LoginPage
test.describe('Authentication', () => {

  // Test 2a: Verify successful login
  // Test 2a: Verifikasi login berhasil
  test('successful login', async ({ page }) => {
    // Create a new LoginPage instance
    // Buat instance LoginPage baru
    const loginPage = new LoginPage(page);
    await page.goto('/login');
    
    // Use the Page Object's login method (clean & readable!)
    // Gunakan method login dari Page Object (bersih & mudah dibaca!)
    await loginPage.login('user@test.com', 'pass123');

    // Assert: URL should contain "dashboard" after login
    // Validasi: URL harus mengandung "dashboard" setelah login
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('.welcome')).toBeVisible();
  });

  // Test 2b: Visual Regression Testing
  // Test 2b: Pengujian Regresi Visual
  // Purpose: Detect unexpected UI changes by comparing screenshots
  // Tujuan: Deteksi perubahan UI tak terduga dengan membandingkan screenshot
  test('visual regression', async ({ page }) => {
    await page.goto('/login');
    // This compares the current page with a saved baseline screenshot
    // Ini membandingkan halaman saat ini dengan screenshot baseline
    await expect(page).toHaveScreenshot('login-page.png');
  });
});`,
    runOutput: `  Running 2 tests using 1 worker

  ✓  1 [chromium]  › playwright.spec.js:30:3 › Authentication › successful login (1.2s)
     → Navigated to /login
     → Filled email: user@test.com
     → Filled password: ********
     → Clicked login button
     → Verified URL contains /dashboard
     → Welcome element is visible ✔

  ✓  2 [chromium]  › playwright.spec.js:38:3 › Authentication › visual regression (847ms)
     → Navigated to /login
     → Screenshot captured: login-page.png
     → Compared with baseline → Match ✔

  2 passed (2.1s)
  0 failed
  0 skipped

  ✅ All tests passed across 1 browser (Chromium).
  💡 Tip: Run with --project=firefox,webkit to test cross-browser.`
  },
  selenium: {
    title: t.projects.items.find(i => i.id === 'selenium')?.title || 'Selenium Python',
    description: t.codeViewer?.descriptions?.selenium || 'Selenium Script',
    language: 'python',
    filename: 'selenium_test.py',
    reportData: {
      type: 'selenium',
      stats: {
        tests: 1,
        passed: 1,
        duration: '3.42s'
      },
      logs: [
        { time: '0.00s', msg: 'Initializing ChromeDriver...' },
        { time: '0.12s', msg: 'Navigating to https://example.com/login' },
        { time: '0.98s', msg: 'Waiting for email field (explicit wait)...' },
        { time: '1.32s', msg: 'Email field found ✔' },
        { time: '1.35s', msg: 'Filling credentials...' },
        { time: '1.45s', msg: 'Clicking login button...' },
        { time: '2.10s', msg: 'Asserting page title...' },
        { time: '2.11s', msg: 'Assertion passed ✔' },
        { time: '3.42s', msg: 'Tearing down driver...' },
      ]
    },
    code: `"""
============================================================
SELENIUM WEBDRIVER TEST SUITE: Tutorial & Documentation
============================================================

WHAT IS THIS?
APA INI?
This script automates browser actions using Selenium with Python.
Script ini mengotomatiskan aksi browser menggunakan Selenium dengan Python.

KEY CONCEPT: EXPLICIT WAITS:
KONSEP KUNCI: EXPLICIT WAITS:
  Instead of using time.sleep() (bad practice!), we use WebDriverWait.
  Alih-alih menggunakan time.sleep() (praktik buruk!), kita pakai WebDriverWait.
  
  Why? Elements may load at different speeds. Explicit waits pause
  Kenapa? Elemen bisa dimuat dengan kecepatan berbeda. Explicit waits
  ONLY until the element appears, making tests faster & more reliable.
  menunggu HANYA sampai elemen muncul, membuat test lebih cepat & stabil.

TOOLS USED: Selenium WebDriver, Python, PyTest
ALAT YANG DIGUNAKAN: Selenium WebDriver, Python, PyTest
============================================================
"""
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# ─── STEP 1: CREATE PAGE OBJECT CLASS ──────────────────────
# Purpose: Encapsulate login page logic for reusability
# Tujuan: Enkapsulasi logika halaman login agar bisa dipakai ulang
class LoginPage:
    def __init__(self, driver):
        self.driver = driver
        # Set up Explicit Wait with 10 second timeout
        # Atur Explicit Wait dengan timeout 10 detik
        self.wait = WebDriverWait(driver, 10)
        
    def login(self, email, password):
        """
        Perform login action with explicit waits.
        Lakukan aksi login dengan explicit waits.
        """
        print("→ Waiting for email field (explicit wait, max 10s)...")
        
        # Wait until email field is visible (max 10s), then type
        # Tunggu sampai field email terlihat (maks 10 detik), lalu ketik
        email_field = self.wait.until(
            EC.visibility_of_element_located((By.ID, "email"))
        )
        print("→ Email field found in 0.34s ✔")
        
        pass_field = self.driver.find_element(By.ID, "password")
        btn = self.driver.find_element(By.ID, "login-btn")

        print("→ Filling credentials...")
        # Fill in credentials and submit
        # Isi kredensial dan submit
        email_field.send_keys(email)
        pass_field.send_keys(password)
        
        print("→ Clicking login button...")
        btn.click()


# ─── STEP 2: WRITE THE TEST FUNCTION ───────────────────────
# Purpose: Test the complete login flow
# Tujuan: Menguji alur login secara lengkap
def test_login_flow():
    print("→ Initializing ChromeDriver...")
    # Step 2a: Initialize Chrome browser
    # Langkah 2a: Inisialisasi browser Chrome
    driver = webdriver.Chrome()
    
    print("→ DevTools listening on ws://127.0.0.1:9222...")
    print("→ Navigating to https://example.com/login")
    driver.get("https://example.com/login")

    try:
        # Step 2b: Use Page Object to perform login
        # Langkah 2b: Gunakan Page Object untuk melakukan login
        page = LoginPage(driver)
        page.login("user@test.com", "pass123")

        print("→ Asserting page title contains 'Dashboard'...")
        # Step 2c: Assert: verify the page title contains "Dashboard"
        # Langkah 2c: Assert: verifikasi judul halaman mengandung "Dashboard"
        assert "Dashboard" in driver.title
        print("→ Assertion passed ✔")
        
    finally:
        print("→ Tearing down driver...")
        # Step 2d: Always close the browser (even if test fails!)
        # Langkah 2d: Selalu tutup browser (meskipun test gagal!)
        driver.quit()

# ─── STEP 3: RUN THE TEST ──────────────────────────────────
# Purpose: Entry point: runs when you execute this file directly
# Tujuan: Titik masuk: dijalankan saat file ini dieksekusi langsung
if __name__ == "__main__":
    test_login_flow()`,
    runOutput: `$ python -m pytest selenium_test.py -v

========================== test session starts ===========================
platform win32 -- Python 3.11.5, pytest-7.4.3, pluggy-1.3.0
collected 1 item

selenium_test.py::test_login_flow
  → Initializing ChromeDriver...
  → DevTools listening on ws://127.0.0.1:9222...
  → Navigating to https://example.com/login
  → Waiting for email field (explicit wait, max 10s)...
  → Email field found in 0.34s ✔
  → Filling credentials...
  → Clicking login button...
  → Asserting page title contains 'Dashboard'...
  → Assertion passed ✔
  → Tearing down driver...
  PASSED                                                        [100%]

========================== 1 passed in 3.42s ============================

✅ Login Test Passed: Browser automation successful.`
  }
});
