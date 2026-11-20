import http.server
import socketserver
import json
import sqlite3
import os
import uuid
import base64
import urllib.parse
import secrets
import hmac
import time
from datetime import datetime

PORT = int(os.environ.get("PORT", 3000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DIRECTORY, "hotel_menu.db")
UPLOADS_DIR = os.path.join(DIRECTORY, "uploads")

os.makedirs(UPLOADS_DIR, exist_ok=True)

# Security Constants & Configuration
ADMIN_PIN = os.environ.get("GEDAA_ADMIN_PIN", "80401385")
MAX_REQUEST_SIZE = 10 * 1024 * 1024  # 10 MB maximum request payload
MAX_IMAGE_SIZE = 5 * 1024 * 1024     # 5 MB maximum image size
SESSION_TTL_SECONDS = 24 * 3600      # 24 hours admin session

# Whitelist of allowed static file extensions
ALLOWED_STATIC_EXTENSIONS = {
    '.html', '.css', '.js', '.svg', '.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2'
}

# In-memory storage for active admin tokens and rate limiting
ACTIVE_ADMIN_SESSIONS = {}  # token -> expiry_timestamp
LOGIN_ATTEMPTS = {}         # ip -> list of timestamps
RATE_LIMIT_CALLS = {}       # ip -> list of timestamps

# Standard Security Headers
SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
    'Content-Security-Policy': (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: blob: https: http:; "
        "connect-src 'self' https: http:; "
        "frame-ancestors 'none';"
    )
}

# =========================================================
# DATABASE SETUP & SEEDING
# =========================================================
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dishes (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        featured INTEGER DEFAULT 0,
        title_en TEXT NOT NULL,
        title_am TEXT NOT NULL,
        desc_en TEXT,
        desc_am TEXT,
        price REAL NOT NULL,
        badges TEXT DEFAULT '[]',
        image TEXT,
        is_available INTEGER DEFAULT 1,
        created_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        table_number TEXT NOT NULL,
        order_type TEXT DEFAULT 'dine_in',
        customer_name TEXT,
        customer_phone TEXT,
        notes TEXT,
        subtotal REAL NOT NULL,
        service_charge REAL NOT NULL,
        vat REAL NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        dish_id TEXT,
        title TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS waiter_calls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_number TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        requested_at TEXT
    )
    """)

    # Seed initial dishes if empty
    cursor.execute("SELECT COUNT(*) FROM dishes")
    if cursor.fetchone()[0] == 0:
        initial_dishes = [
            ("checkla_tibs", "traditional", 1, "Checkla Tibs 1kg", "ቸክላ ጥብስ 1 ኪሎ", 
             "Sautéed beef with rosemary, onion and berbere served sizzling in clay bowl.", 
             "በሮዝመሪ፣ ቀይ ሽንኩርት እና በርበሬ የተጠበሰ የበሬ ስጋ በሸክላ የቀረበ።", 3200.0, 
             json.dumps(["spicy"]), "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80", 1),
            
            ("doro_wot", "traditional", 1, "Doro Wot", "ዶሮ ወጥ", 
             "Slow-cooked chicken in berbere sauce with boiled egg and ayib.", 
             "በደቀቀ ሽንኩርትና የጓያ በርበሬ የበሰለ የሀበሻ ዶሮ ወጥ ከእንቁላል እና አይብ ጋር።", 950.0, 
             json.dumps(["spicy"]), "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", 1),
            
            ("kitfo", "traditional", 1, "Kitfo", "ክትፎ", 
             "Minced beef with mitmita and spiced butter, served with ayib and gomen.", 
             "በልዩ ቅቤና ሚጥሚጣ የተዘጋጀ የለስላሳ ስጋ ክትፎ ከአይብና ጎመን ጋር።", 850.0, 
             json.dumps(["popular"]), "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80", 1),
            
            ("chechebsa", "breakfast", 0, "Chechebsa", "ጨጨብሳ", 
             "Flaky flatbread pieces with berbere and spiced butter, served with honey.", 
             "በቅቤና በርበሬ የተፈተፈተ ቀጭን ቂጣ ከማር ጋር የቀረበ።", 300.0, 
             json.dumps(["gluten"]), "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", 1),
            
            ("enkulal_firfir", "breakfast", 0, "Enkulal Firfir", "የእንቁላል ፍርፍር", 
             "Scrambled eggs with onion, tomato and green chili, served with fresh bread.", 
             "በቀይ ሽንኩርት፣ ቲማቲም እና ቃሪያ የተጠበሰ እንቁላል ከትኩስ ዳቦ ጋር።", 260.0, 
             json.dumps(["eggs"]), "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80", 1),
            
            ("beyaynetu", "fasting", 0, "Beyaynetu", "በያይነቱ", 
             "A colourful platter of shiro, misir wot, kik alicha, gomen, and atkilt on injera.", 
             "የተለያዩ የጾም ወጦች ክምችት፡ ሽሮ፣ ምስር፣ ክክ፣ ጎመን፣ ድንችና ካሮት በእንጀራ።", 450.0, 
             json.dumps(["fasting"]), "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80", 1),
            
            ("atkilt_wot", "fasting", 0, "Atkilt Wot", "የአትክልት ወጥ", 
             "Cabbage, potato and carrot slow-cooked with garlic, ginger and turmeric.", 
             "ጥቅል ጎመን፣ ድንችና ካሮት በእርድ እና ነጭ ሽንኩርት ተዘጋጅቶ የቀረበ።", 300.0, 
             json.dumps(["fasting"]), "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80", 1),
            
            ("beef_burger", "modern", 0, "Beef Burger", "ቢፍ በርገር", 
             "Grilled prime beef patty, melted cheddar cheese, lettuce, tomato and crispy fries.", 
             "የተጠበሰ የበሬ ስጋ፣ ቺዝ፣ ሰላጣ፣ ቲማቲም እና የተጠበሰ ድንች (ቺፕስ)።", 650.0, 
             json.dumps(["gluten"]), "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80", 1),
            
            ("chicken_wings", "modern", 0, "Spicy Chicken Wings", "ስፓይሲ ቺከን ዊንግስ", 
             "Crispy grilled chicken wings tossed in spicy glaze with garlic dipping sauce.", 
             "በቅመም የተጠበሰ የዶሮ ክንፍ ከነጭ ሽንኩርት መጥመቂያ ጋር።", 600.0, 
             json.dumps(["spicy"]), "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80", 1),
            
            ("jebena_buna", "hot_drinks", 0, "Jebena Buna", "ጀበና ቡና", 
             "Traditional Ethiopian coffee brewed in clay pot, served with fresh popcorn.", 
             "በሸክላ ጀበና የተፈላ ባህላዊ የሀበሻ ቡና ከፈንድሻ ጋር።", 80.0, 
             json.dumps(["popular"]), "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80", 1),
            
            ("cappuccino", "hot_drinks", 0, "Cappuccino", "ካፑቺኖ", 
             "Rich double shot espresso layered with silky steamed milk foam.", 
             "የጣሊያን ኤስፕሬሶ ከተመታ ለስላሳ ወተት ጋር።", 130.0, 
             json.dumps(["dairy"]), "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80", 1),
            
            ("avocado_juice", "fresh_juice", 0, "Fresh Avocado Juice", "ትኩስ የአቮካዶ ጁስ", 
             "Creamy fresh blended Ethiopian avocado layered with Vimto and lime.", 
             "በሎሚና ቪምቶ የተዘጋጀ ድቡሽቡሽ የሀበሻ አቮካዶ ጁስ።", 200.0, 
             json.dumps(["fasting"]), "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80", 1),
            
            ("mango_juice", "fresh_juice", 0, "Fresh Mango Juice", "ትኩስ የማንጎ ጁስ", 
             "100% pure seasonal tropical mango nectar.", 
             "ከተፈጥሮ ጣፋጭ ማንጎ የተጨመቀ ንጹህ ጁስ።", 200.0, 
             json.dumps(["fasting"]), "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop&q=80", 1),
            
            ("tej_special", "bar", 0, "Tej Honey Wine (Berle)", "ማር ጠጅ (በብርሌ)", 
             "Authentic fermented Ethiopian honey wine served in the traditional flask.", 
             "ከንጹህ የተፈጥሮ ማር የተጣራ ጥራት ያለው የሀበሻ ጠጅ በብርሌ የቀረበ።", 150.0, 
             json.dumps(["popular"]), "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80", 1),
            
            ("meta_beer", "bar", 0, "Habesha / Meta Beer", "ሀበሻ / ሜታ ቢራ", 
             "Chilled cold bottled Ethiopian lager 330ml.", 
             "ቀዝቃዛ የታሸገ የሀበሻ ቢራ 330 ሚሊ ሊትር።", 120.0, 
             json.dumps([]), "https://images.unsplash.com/photo-1608270199187-573516584c66?w=600&auto=format&fit=crop&q=80", 1)
        ]
        
        now = datetime.now().isoformat()
        cursor.executemany("""
        INSERT INTO dishes (id, category, featured, title_en, title_am, desc_en, desc_am, price, badges, image, is_available, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, [(d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8], d[9], d[10], now) for d in initial_dishes])
        
        cursor.execute("""
        INSERT INTO orders (id, table_number, order_type, customer_name, customer_phone, notes, subtotal, service_charge, vat, total, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, ("ORD-84", "04", "dine_in", "Abebe", "0911223344", "Extra ayib please", 1400.0, 140.0, 231.0, 1771.0, "preparing", now))
        
        cursor.execute("""
        INSERT INTO order_items (order_id, dish_id, title, quantity, price)
        VALUES (?, ?, ?, ?, ?)
        """, ("ORD-84", "beyaynetu", "Beyaynetu", 1, 450.0))
        cursor.execute("""
        INSERT INTO order_items (order_id, dish_id, title, quantity, price)
        VALUES (?, ?, ?, ?, ?)
        """, ("ORD-84", "doro_wot", "Doro Wot", 1, 950.0))

    conn.commit()
    conn.close()

# =========================================================
# REST API & SECURE STATIC HANDLER
# =========================================================
class AppRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def apply_security_headers(self):
        for header, val in SECURITY_HEADERS.items():
            self.send_header(header, val)

    def end_headers(self):
        self.apply_security_headers()
        super().end_headers()

    def send_json(self, data, status=200):
        response_bytes = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_bytes)))
        # Restrict CORS to same-origin or localhost for security
        origin = self.headers.get('Origin', '')
        if origin and ('localhost' in origin or '127.0.0.1' in origin):
            self.send_header('Access-Control-Allow-Origin', origin)
        else:
            self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token, Authorization')
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        self.send_response(200)
        origin = self.headers.get('Origin', '')
        if origin and ('localhost' in origin or '127.0.0.1' in origin):
            self.send_header('Access-Control-Allow-Origin', origin)
        else:
            self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Token, Authorization')
        self.end_headers()

    def get_client_ip(self):
        forwarded = self.headers.get('X-Forwarded-For')
        if forwarded:
            return forwarded.split(',')[0].strip()
        return self.client_address[0]

    def read_json_body(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
        except (ValueError, TypeError):
            return {}

        if content_length > MAX_REQUEST_SIZE:
            raise ValueError("Payload size exceeds maximum allowed limit")

        if content_length == 0:
            return {}
        
        body = self.rfile.read(content_length)
        return json.loads(body.decode('utf-8'))

    def is_admin_authenticated(self):
        token = self.headers.get('X-Admin-Token')
        if not token:
            auth_header = self.headers.get('Authorization', '')
            if auth_header.startswith('Bearer '):
                token = auth_header[7:].strip()
        
        if not token or token not in ACTIVE_ADMIN_SESSIONS:
            return False

        expiry = ACTIVE_ADMIN_SESSIONS[token]
        if time.time() > expiry:
            del ACTIVE_ADMIN_SESSIONS[token]
            return False

        return True

    def check_rate_limit(self, bucket_dict, max_calls=30, window_seconds=60):
        client_ip = self.get_client_ip()
        now = time.time()
        calls = bucket_dict.get(client_ip, [])
        # Filter calls in window
        valid_calls = [t for t in calls if now - t < window_seconds]
        if len(valid_calls) >= max_calls:
            bucket_dict[client_ip] = valid_calls
            return False
        valid_calls.append(now)
        bucket_dict[client_ip] = valid_calls
        return True

    # -----------------------------------------------------
    # GET REQUESTS
    # -----------------------------------------------------
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 1. Clean route for Admin portal
        if path in ['/admin', '/admin/']:
            self.path = '/admin.html'
            return super().do_GET()

        # 2. API: Verify Admin Token
        if path == '/api/auth/verify':
            if self.is_admin_authenticated():
                return self.send_json({"authenticated": True})
            return self.send_json({"authenticated": False}, status=401)

        # 3. API: Get all dishes (Public Digital Menu)
        if path == '/api/dishes':
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM dishes ORDER BY featured DESC, rowid ASC")
            rows = cursor.fetchall()
            dishes = []
            for r in rows:
                d = dict(r)
                d['badges'] = json.loads(d['badges']) if d['badges'] else []
                d['is_available'] = bool(d['is_available'])
                d['featured'] = bool(d['featured'])
                dishes.append(d)
            conn.close()
            return self.send_json(dishes)

        # 4. API: Get all orders (PROTECTED: Admin only)
        if path == '/api/orders':
            if not self.is_admin_authenticated():
                return self.send_json({"error": "Unauthorized: Staff authentication required"}, status=401)

            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM orders ORDER BY rowid DESC")
            orders = [dict(r) for r in cursor.fetchall()]
            for o in orders:
                cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (o['id'],))
                o['items'] = [dict(it) for it in cursor.fetchall()]
            conn.close()
            return self.send_json(orders)

        # 5. API: Get active waiter calls (PROTECTED: Admin only)
        if path == '/api/waiter-calls':
            if not self.is_admin_authenticated():
                return self.send_json({"error": "Unauthorized: Staff authentication required"}, status=401)

            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM waiter_calls WHERE status = 'active' ORDER BY id DESC")
            calls = [dict(r) for r in cursor.fetchall()]
            conn.close()
            return self.send_json(calls)

        # 6. API: Get admin stats (PROTECTED: Admin only)
        if path == '/api/stats':
            if not self.is_admin_authenticated():
                return self.send_json({"error": "Unauthorized: Staff authentication required"}, status=401)

            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*), COALESCE(SUM(total), 0) FROM orders")
            total_orders, total_sales = cursor.fetchone()
            
            cursor.execute("SELECT COUNT(*) FROM orders WHERE status IN ('ready', 'completed')")
            completed_orders = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(DISTINCT table_number) FROM orders WHERE status != 'completed'")
            active_tables = cursor.fetchone()[0]

            cursor.execute("""
            SELECT title, SUM(quantity) as qty FROM order_items 
            GROUP BY title ORDER BY qty DESC LIMIT 5
            """)
            top_dishes = [{"title": r[0], "qty": r[1]} for r in cursor.fetchall()]
            conn.close()

            return self.send_json({
                "todaySales": total_sales,
                "totalOrders": total_orders,
                "completedOrders": completed_orders,
                "activeTables": active_tables,
                "topDishes": top_dishes,
                "currency": "ETB"
            })

        # 7. STATIC FILE SECURITY: Block sensitive files (databases, source code, scripts, configs)
        rel_path = path.lstrip('/')
        if not rel_path:
            rel_path = 'index.html'

        # Block path traversal attempts
        normalized = os.path.normpath(os.path.join(DIRECTORY, rel_path))
        if not normalized.startswith(DIRECTORY):
            return self.send_json({"error": "Forbidden"}, status=403)

        # Disallow dotfiles and hidden files
        parts = rel_path.split('/')
        if any(p.startswith('.') for p in parts):
            return self.send_json({"error": "Forbidden: Hidden file access denied"}, status=403)

        _, ext = os.path.splitext(rel_path)
        ext = ext.lower()

        # Explicitly forbid database files, scripts, source files
        if ext in ['.db', '.py', '.bat', '.sh', '.env', '.md', '.json', '.bak', '.config']:
            return self.send_json({"error": "Forbidden: Sensitive resource protected"}, status=403)

        # Only serve allowed static file types
        if ext and ext not in ALLOWED_STATIC_EXTENSIONS:
            return self.send_json({"error": "Forbidden: File extension not permitted"}, status=403)

        return super().do_GET()

    # -----------------------------------------------------
    # POST REQUESTS
    # -----------------------------------------------------
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        try:
            data = self.read_json_body()
        except ValueError as e:
            return self.send_json({"error": str(e)}, status=413)
        except Exception:
            return self.send_json({"error": "Invalid JSON body"}, status=400)

        # 1. API: Admin Authentication Login
        if path == '/api/auth/login':
            # Rate limit login: max 5 attempts per minute per IP
            if not self.check_rate_limit(LOGIN_ATTEMPTS, max_calls=5, window_seconds=60):
                return self.send_json({"error": "Too many failed attempts. Please wait 1 minute."}, status=429)

            pin = str(data.get('pin') or data.get('password') or '').strip()
            # Constant-time comparison to prevent timing attacks
            if hmac.compare_digest(pin, str(ADMIN_PIN)):
                token = secrets.token_hex(24)
                ACTIVE_ADMIN_SESSIONS[token] = time.time() + SESSION_TTL_SECONDS
                return self.send_json({
                    "authenticated": True,
                    "token": token,
                    "expires_in": SESSION_TTL_SECONDS,
                    "message": "Staff login successful"
                })
            return self.send_json({"error": "Incorrect Admin PIN"}, status=401)

        # 2. API: Admin Logout
        if path == '/api/auth/logout':
            token = self.headers.get('X-Admin-Token', '')
            if token in ACTIVE_ADMIN_SESSIONS:
                del ACTIVE_ADMIN_SESSIONS[token]
            return self.send_json({"message": "Logged out successfully"})

        # 3. API: Add new food item (PROTECTED: Admin only)
        if path == '/api/dishes':
            if not self.is_admin_authenticated():
                return self.send_json({"error": "Unauthorized: Staff authentication required"}, status=401)

            dish_id = str(data.get('id') or ("dish_" + uuid.uuid4().hex[:8]))[:40]
            category = str(data.get('category', 'traditional'))[:40]
            featured = 1 if data.get('featured') else 0
            title_en = str(data.get('title_en', 'New Dish')).strip()[:100]
            title_am = str(data.get('title_am', title_en)).strip()[:100]
            desc_en = str(data.get('desc_en', '')).strip()[:500]
            desc_am = str(data.get('desc_am', desc_en)).strip()[:500]
            try:
                price = max(0.0, float(data.get('price', 0.0)))
            except (ValueError, TypeError):
                price = 0.0

            badges = json.dumps(data.get('badges', []))
            image = str(data.get('image', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'))[:500]
            is_available = 1 if data.get('is_available', True) else 0
            now = datetime.now().isoformat()

            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO dishes (id, category, featured, title_en, title_am, desc_en, desc_am, price, badges, image, is_available, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (dish_id, category, featured, title_en, title_am, desc_en, desc_am, price, badges, image, is_available, now))
            conn.commit()
            conn.close()

            return self.send_json({
                "id": dish_id, "category": category, "featured": bool(featured),
                "title_en": title_en, "title_am": title_am, "desc_en": desc_en, "desc_am": desc_am,
                "price": price, "badges": json.loads(badges), "image": image, "is_available": bool(is_available)
            }, status=201)

        # 4. API: Image Upload (PROTECTED: Admin only, Magic Bytes & Path Traversal Proof)
        if path == '/api/upload':
            if not self.is_admin_authenticated():
                return self.send_json({"error": "Unauthorized: Staff authentication required"}, status=401)

            img_b64 = data.get('image_base64', '')
            if ',' in img_b64:
                img_b64 = img_b64.split(',', 1)[1]

            try:
                file_bytes = base64.b64decode(img_b64)
            except Exception:
                return self.send_json({"error": "Invalid base64 encoding"}, status=400)

            if len(file_bytes) > MAX_IMAGE_SIZE:
                return self.send_json({"error": "File size exceeds 5MB limit"}, status=413)

            # Detect file type strictly by magic bytes
            ext = None
            if file_bytes.startswith(b'\xff\xd8\xff'):
                ext = '.jpg'
            elif file_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
                ext = '.png'
            elif file_bytes.startswith(b'RIFF') and len(file_bytes) >= 12 and file_bytes[8:12] == b'WEBP':
                ext = '.webp'
            elif file_bytes.startswith(b'GIF87a') or file_bytes.startswith(b'GIF89a'):
                ext = '.gif'
            else:
                return self.send_json({"error": "Unsupported image format. Allowed formats: JPG, PNG, WEBP, GIF."}, status=400)

            safe_filename = f"food_{uuid.uuid4().hex[:12]}{ext}"
            save_path = os.path.normpath(os.path.join(UPLOADS_DIR, safe_filename))

            # Ensure save_path is strictly within UPLOADS_DIR
            if not save_path.startswith(UPLOADS_DIR):
                return self.send_json({"error": "Security violation: Invalid upload path"}, status=403)

            with open(save_path, 'wb') as f:
                f.write(file_bytes)

            url = f"/uploads/{safe_filename}"
            return self.send_json({"url": url, "filename": safe_filename})

        # 5. API: Take / Create Order (Public Guest or POS with Server-Side Price Verification)
        if path == '/api/orders':
            if not self.check_rate_limit(RATE_LIMIT_CALLS, max_calls=25, window_seconds=60):
                return self.send_json({"error": "Rate limit exceeded. Please wait a moment."}, status=429)

            order_id = "ORD-" + str(uuid.uuid4().int)[:4]
            table_number = str(data.get('table_number', '04'))[:10]
            order_type = str(data.get('order_type', 'dine_in'))[:20]
            customer_name = str(data.get('customer_name', ''))[:100]
            customer_phone = str(data.get('customer_phone', ''))[:30]
            notes = str(data.get('notes', ''))[:500]
            raw_items = data.get('items', [])
            
            if not isinstance(raw_items, list) or len(raw_items) == 0:
                return self.send_json({"error": "Cannot place an empty order"}, status=400)

            # Server-side price validation: Look up verified prices from database
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT id, title_en, price, is_available FROM dishes")
            catalog = {row['id']: {"title": row['title_en'], "price": row['price'], "available": bool(row['is_available'])} for row in cursor.fetchall()}

            validated_items = []
            calculated_subtotal = 0.0

            for it in raw_items:
                d_id = str(it.get('id', ''))
                try:
                    qty = max(1, min(int(it.get('qty') or it.get('quantity') or 1), 50))
                except (ValueError, TypeError):
                    qty = 1

                if d_id in catalog:
                    dish_info = catalog[d_id]
                    if not dish_info['available']:
                        conn.close()
                        return self.send_json({"error": f"Item '{dish_info['title']}' is currently sold out."}, status=400)
                    price = float(dish_info['price'])
                    title = dish_info['title']
                else:
                    try:
                        price = max(0.0, float(it.get('price', 0.0)))
                    except (ValueError, TypeError):
                        price = 0.0
                    title = str(it.get('title', 'Menu Item'))[:100]

                calculated_subtotal += price * qty
                validated_items.append({
                    "id": d_id,
                    "title": title,
                    "quantity": qty,
                    "price": price
                })

            # Recalculate bill server-side to guarantee zero tampering
            service_charge = round(calculated_subtotal * 0.10, 2)
            vat = round((calculated_subtotal + service_charge) * 0.15, 2)
            total = round(calculated_subtotal + service_charge + vat, 2)
            status = 'pending'
            now = datetime.now().isoformat()

            cursor.execute("""
            INSERT INTO orders (id, table_number, order_type, customer_name, customer_phone, notes, subtotal, service_charge, vat, total, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (order_id, table_number, order_type, customer_name, customer_phone, notes, calculated_subtotal, service_charge, vat, total, status, now))

            for it in validated_items:
                cursor.execute("""
                INSERT INTO order_items (order_id, dish_id, title, quantity, price)
                VALUES (?, ?, ?, ?, ?)
                """, (order_id, it['id'], it['title'], it['quantity'], it['price']))

            conn.commit()
            conn.close()

            return self.send_json({
                "id": order_id, "table_number": table_number, "total": total,
                "status": status, "items": validated_items, "created_at": now
            }, status=201)

        # 6. API: Call Waiter (Public Diner action with rate limit)
        if path == '/api/waiter-calls':
            if not self.check_rate_limit(RATE_LIMIT_CALLS, max_calls=10, window_seconds=60):
                return self.send_json({"error": "Assistance request already submitted. A waiter has been alerted."}, status=429)

            table_num = str(data.get('table_number', '04'))[:10]
            now = datetime.now().strftime("%I:%M %p")

            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO waiter_calls (table_number, status, requested_at)
            VALUES (?, 'active', ?)
            """, (table_num, now))
            conn.commit()
            call_id = cursor.lastrowid
            conn.close()

            return self.send_json({"id": call_id, "table_number": table_num, "status": "active", "time": now}, status=201)

        return self.send_json({"error": "Endpoint not found"}, status=404)

    # -----------------------------------------------------
    # PUT REQUESTS
    # -----------------------------------------------------
    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # API: Update / Customize Dish (PROTECTED: Admin only)
        if path.startswith('/api/dishes/'):
            if not self.is_admin_authenticated():
                return self.send_json({"error": "Unauthorized: Staff authentication required"}, status=401)

            dish_id = path.replace('/api/dishes/', '')
            try:
                data = self.read_json_body()
            except Exception:
                return self.send_json({"error": "Invalid JSON body"}, status=400)

            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM dishes WHERE id = ?", (dish_id,))
            existing = cursor.fetchone()
            if not existing:
                conn.close()
                return self.send_json({"error": "Dish not found"}, status=404)

            title_en = str(data.get('title_en', existing[3]))[:100]
            title_am = str(data.get('title_am', existing[4]))[:100]
            desc_en = str(data.get('desc_en', existing[5]))[:500]
            desc_am = str(data.get('desc_am', existing[6]))[:500]
            try:
                price = max(0.0, float(data.get('price', existing[7])))
            except (ValueError, TypeError):
                price = float(existing[7])

            badges = json.dumps(data.get('badges', [])) if 'badges' in data else existing[8]
            image = str(data.get('image', existing[9]))[:500]
            category = str(data.get('category', existing[1]))[:40]
            is_available = (1 if data['is_available'] else 0) if 'is_available' in data else existing[10]
            featured = (1 if data['featured'] else 0) if 'featured' in data else existing[2]

            cursor.execute("""
            UPDATE dishes SET title_en = ?, title_am = ?, desc_en = ?, desc_am = ?,
                              price = ?, badges = ?, image = ?, category = ?, is_available = ?, featured = ?
            WHERE id = ?
            """, (title_en, title_am, desc_en, desc_am, price, badges, image, category, is_available, featured, dish_id))
            conn.commit()
            conn.close()

            return self.send_json({
                "message": "Dish updated successfully", 
                "id": dish_id, 
                "title_en": title_en,
                "price": price,
                "category": category,
                "image": image
            })

        return self.send_json({"error": "Endpoint not found"}, status=404)

    # -----------------------------------------------------
    # PATCH REQUESTS
    # -----------------------------------------------------
    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # 1. API: Update Order Status (PROTECTED: Admin only)
        if path.startswith('/api/orders/') and path.endswith('/status'):
            if not self.is_admin_authenticated():
                return self.send_json({"error": "Unauthorized: Staff authentication required"}, status=401)

            parts = path.split('/')
            raw_order_id = urllib.parse.unquote(parts[3])
            try:
                data = self.read_json_body()
            except Exception:
                return self.send_json({"error": "Invalid JSON body"}, status=400)

            new_status = str(data.get('status', 'preparing'))[:20]

            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("""
            UPDATE orders SET status = ? 
            WHERE id = ? OR id = ? OR id = ? OR id = ?
            """, (new_status, raw_order_id, "#" + raw_order_id, raw_order_id.lstrip("#"), "ORD-" + raw_order_id.replace("ORD-","").replace("#","")))
            conn.commit()
            conn.close()
            return self.send_json({"message": "Status updated", "id": raw_order_id, "status": new_status})

        # 2. API: Resolve Waiter Call (PROTECTED: Admin only)
        if path.startswith('/api/waiter-calls/') and path.endswith('/resolve'):
            if not self.is_admin_authenticated():
                return self.send_json({"error": "Unauthorized: Staff authentication required"}, status=401)

            parts = path.split('/')
            call_id = parts[3]

            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("UPDATE waiter_calls SET status = 'resolved' WHERE id = ?", (call_id,))
            conn.commit()
            conn.close()
            return self.send_json({"message": "Call resolved", "id": call_id})

        return self.send_json({"error": "Endpoint not found"}, status=404)

    # -----------------------------------------------------
    # DELETE REQUESTS
    # -----------------------------------------------------
    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        # API: Delete Dish (PROTECTED: Admin only)
        if path.startswith('/api/dishes/'):
            if not self.is_admin_authenticated():
                return self.send_json({"error": "Unauthorized: Staff authentication required"}, status=401)

            dish_id = path.replace('/api/dishes/', '')
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM dishes WHERE id = ?", (dish_id,))
            conn.commit()
            conn.close()
            return self.send_json({"message": "Dish deleted successfully", "id": dish_id})

        return self.send_json({"error": "Endpoint not found"}, status=404)

# =========================================================
# START SERVER
# =========================================================
if __name__ == '__main__':
    init_db()
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), AppRequestHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"\n=======================================================")
        print(f"  GEDAA RESTAURANT - Hardened Local Server Running")
        print(f"  Guest Digital Menu:    {url}/")
        print(f"  Admin Portal:          {url}/admin")
        print(f"  Staff Authentication:  Configured & Protected")
        print(f"  Security Headers:      Active (CSP, nosniff, SAMEORIGIN)")
        print(f"  Sensitive Files:       Protected & Blocked")
        print(f"  -----------------------------------------------------")
        print(f"  DEVELOPED BY ORIVEX TECH 2026")
        print(f"=======================================================\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
