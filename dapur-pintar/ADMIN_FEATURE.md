# Dokumentasi Fitur Admin - DapurPintar

Tanggal: 5 Mei 2026

## Ringkasan

Fitur Halaman Admin telah ditambahkan ke aplikasi DapurPintar. Admin dapat melihat statistik lengkap seperti jumlah User, Recipes Generated, Saved Recipes, dan data lainnya.

---

## Langkah-langkah Implementasi

### 1. Update Database Schema

**File: `prisma/schema.prisma`**
- Menambahkan field `isAdmin Boolean @default(false)` pada model User
- Menjalankan migrasi: `npx prisma migrate dev --name add_is_admin`

### 2. Update Auth Library

**File: `lib/auth.ts`**
- Menambahkan function `generateAdminToken(userId: string)` yang menyertakan `{ userId, isAdmin: true }` dalam JWT payload

### 3. Admin API Routes

#### a. POST `/api/admin/login`
**File: `src/app/api/admin/login/route.ts`**
- Menerima email dan password
- Memverifikasi user dan mengecek `isAdmin: true`
- Mengembalikan token admin (dengan payload `isAdmin: true`)

#### b. GET `/api/admin/stats`
**File: `src/app/api/admin/stats/route.ts`**
- Terproteksi: mengecek token dan payload `isAdmin: true`
- Mengembalikan statistik:
  - `totalUsers`: COUNT semua user
  - `totalRecipes`: COUNT semua recipe
  - `totalSavedRecipes`: COUNT semua saved recipe
  - `recipesThisWeek`: COUNT recipe where createdAt >= 7 hari lalu
  - `usersThisWeek`: COUNT user where createdAt >= 7 hari lalu
  - `recipesByMood`: GROUP BY mood, COUNT
  - `recipesByMealType`: GROUP BY mealType, COUNT
  - `recipesByLanguage`: GROUP BY language, COUNT
  - `userGrowth`: COUNT user per bulan (6 bulan terakhir)
  - `recentUsers`: 5 user terbaru (id, name, email, createdAt)
  - `recentRecipes`: 5 recipe terbaru (id, userId, mood, mealType, createdAt)

### 4. Admin Components

**File: `src/components/admin/StatsCard.tsx`**
- Komponen card statistik reusable (icon, title, value, description)
- Mendukung dark mode

### 5. Admin Pages

#### a. Admin Layout
**File: `src/app/admin/layout.tsx`**
- Proteksi: mengecek `adminToken` di localStorage
- Navbar dengan tombol logout
- Redirect ke `/admin/login` jika tidak terautentikasi

#### b. Admin Login Page
**File: `src/app/admin/login/page.tsx`**
- Form login (email & password)
- POST ke `/api/admin/login`
- Menyimpan token di localStorage sebagai `adminToken`
- Redirect ke `/admin/dashboard` jika sukses
- Mendukung dark mode

#### c. Admin Dashboard Page
**File: `src/app/admin/dashboard/page.tsx`**
- Proteksi: mengecek `adminToken` di localStorage
- Fetch data dari `/api/admin/stats`
- Menampilkan statistik dalam cards:
  - Total Users
  - Total Recipes Generated
  - Total Saved Recipes
  - New Users This Week
  - New Recipes This Week
- Charts:
  - Recipes by Mood (progress bars)
  - Recipes by Meal Type (progress bars)
  - User Growth (6 months) - bar chart
- Tabel Recent Users
- Tabel Recent Recipes
- Mendukung dark mode

### 6. Update Auth/Me Route

**File: `src/app/api/auth/me/route.ts`**
- Menambahkan `isAdmin` dalam response

---

## Struktur File Admin

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout dengan proteksi
│   │   ├── login/
│   │   │   └── page.tsx        # Halaman login admin
│   │   └── dashboard/
│   │       └── page.tsx        # Halaman dashboard admin
│   └── api/
│       └── admin/
│           ├── login/
│           │   └── route.ts     # Admin login API
│           └── stats/
│               └── route.ts     # Admin statistik API
├── components/
│   └── admin/
│       └── StatsCard.tsx        # Card statistik
└── lib/
    ├── auth.ts                 # (update) generateAdminToken
    └── prisma.ts               # Prisma client
```

---

## Cara Menggunakan Admin Dashboard

### 1. Membuat User Admin

Buka Prisma Studio:
```bash
cd "C:\Users\Raditya\Documents\GitHub\DapurPintar\dapur-pintar"
npx prisma studio
```

Di Prisma Studio:
1. Buka tabel `User`
2. Pilih user yang ingin dijadikan admin
3. Edit field `isAdmin` menjadi `true`
4. Save perubahan

Atau melalui terminal:
```bash
npx tsx -e "
import { prisma } from './src/lib/prisma';
prisma.user.update({
  where: { email: 'email_anda@example.com' },
  data: { isAdmin: true }
}).then(() => console.log('Done')).finally(() => prisma.\$disconnect());
"
```

### 2. Login ke Admin Dashboard

1. Buka browser: `http://localhost:3000/admin/login`
2. Masukkan email dan password admin
3. Klik "Masuk"
4. Akan redirect ke `/admin/dashboard`

### 3. Melihat Statistik

Di dashboard admin, Anda dapat melihat:
- **Total Users**: Jumlah seluruh user terdaftar
- **Total Recipes**: Jumlah seluruh recipe yang dihasilkan
- **Total Saved Recipes**: Jumlah recipe yang disimpan user
- **New This Week**: User dan recipe baru dalam 7 hari terakhir
- **Recipes by Mood**: Distribusi recipe berdasarkan mood
- **Recipes by Meal Type**: Distribusi recipe berdasarkan jenis makanan
- **User Growth**: Pertumbuhan user dalam 6 bulan terakhir
- **Recent Users**: 5 user yang paling baru mendaftar
- **Recent Recipes**: 5 recipe yang paling baru dihasilkan

---

## Daftar File yang Diubah/Dibuat

| No | File | Status | Perubahan |
|----|------|--------|-------------|
| 1 | `prisma/schema.prisma` | Diubah | Tambah `isAdmin Boolean @default(false)` |
| 2 | `lib/auth.ts` | Diubah | Tambah `generateAdminToken()` |
| 3 | `src/app/api/auth/me/route.ts` | Diubah | Include `isAdmin` in response |
| 4 | `src/app/api/admin/login/route.ts` | **BARU** | Admin login API |
| 5 | `src/app/api/admin/stats/route.ts` | **BARU** | Admin statistik API |
| 6 | `src/components/admin/StatsCard.tsx` | **BARU** | Card statistik komponen |
| 7 | `src/app/admin/layout.tsx` | **BARU** | Admin layout dengan proteksi |
| 8 | `src/app/admin/login/page.tsx` | **BARU** | Halaman login admin |
| 9 | `src/app/admin/dashboard/page.tsx` | **BARU** | Halaman dashboard admin |

---

## Build Verification

```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (19/19)
# Build sukses tanpa error
```

Routes yang dihasilkan:
- `GET /admin/dashboard` (static)
- `GET /admin/login` (static)
- `POST /api/admin/login` (dynamic)
- `GET /api/admin/stats` (dynamic)

---

## Catatan Keamanan

1. **Admin Token**: Menggunakan JWT dengan payload `{ userId, isAdmin: true }`
2. **Proteksi Route**: Semua API `/api/admin/*` mengecek token dan flag `isAdmin`
3. **LocalStorage**: Token admin disimpan di localStorage sebagai `adminToken`
4. **Rekomendasi**: Untuk produksi, gunakan HttpOnly cookies instead of localStorage untuk keamanan lebih baik

---

## Fitur Masa Depan (Optional)

- [ ] Manage Users (delete user, reset password)
- [ ] Manage Recipes (delete recipe, view full recipe)
- [ ] Export data ke CSV/Excel
- [ ] Real-time notifications untuk recipe baru
- [ ] Advanced charts menggunakan library (recharts, chart.js)
- [ ] Admin roles (super admin, moderator)

Cara Menggunakan:

  1. Set User Menjadi Admin (via Prisma Studio):
  cd "C:\Users\Raditya\Documents\GitHub\DapurPintar\dapur-pintar"
  npx prisma studio
  # Edit field isAdmin menjadi true di tabel User

  2. Akses Halaman Admin:
    - Buka: http://localhost:3000/admin/login
    - Login dengan email & password admin
    - Akan redirect ke dashboard
  3. Logout: Klik tombol logout di navbar admin