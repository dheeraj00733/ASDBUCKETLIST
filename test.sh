#!/bin/bash
# ===========================================================
# ASDBUCKETLIST — Manual API Test Script
# Run: chmod +x test.sh && ./test.sh
# Make sure the server is running: npm start
# ===========================================================

BASE_URL="http://localhost:3000"

echo "============================================"
echo "  ASDBUCKETLIST — API Test Suite"
echo "============================================"
echo ""

# ----------------------------------------------------------
# Test 1: GET /products (MISS)
# ----------------------------------------------------------
echo ">>> TEST 1: GET /products (expect X-Cache: MISS)"
curl -s -D /dev/stderr "$BASE_URL/products" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 2: GET /products (HIT)
# ----------------------------------------------------------
echo ">>> TEST 2: GET /products (expect X-Cache: HIT)"
curl -s -D /dev/stderr "$BASE_URL/products" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 3: GET /products/1 (MISS)
# ----------------------------------------------------------
echo ">>> TEST 3: GET /products/1 (expect X-Cache: MISS)"
curl -s -D /dev/stderr "$BASE_URL/products/1" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 4: GET /products/1 (HIT)
# ----------------------------------------------------------
echo ">>> TEST 4: GET /products/1 (expect X-Cache: HIT)"
curl -s -D /dev/stderr "$BASE_URL/products/1" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 5: GET /products/999 (404 — not found)
# ----------------------------------------------------------
echo ">>> TEST 5: GET /products/999 (expect 404)"
curl -s -i "$BASE_URL/products/999"
echo ""
echo ""

# ----------------------------------------------------------
# Test 6: GET /products/abc (400 — invalid ID)
# ----------------------------------------------------------
echo ">>> TEST 6: GET /products/abc (expect 400)"
curl -s -i "$BASE_URL/products/abc"
echo ""
echo ""

# ----------------------------------------------------------
# Test 7: POST /products (create — clears cache)
# ----------------------------------------------------------
echo ">>> TEST 7: POST /products (create product)"
curl -s -i -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tablet","price":499.99,"category":"Electronics"}'
echo ""
echo ""

# ----------------------------------------------------------
# Test 8: GET /products after POST (expect MISS — cache cleared)
# ----------------------------------------------------------
echo ">>> TEST 8: GET /products (expect X-Cache: MISS after POST)"
curl -s -D /dev/stderr "$BASE_URL/products" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 9: POST with invalid body (400 — should NOT clear cache)
# ----------------------------------------------------------
echo ">>> TEST 9: POST /products with invalid body (expect 400)"
curl -s -i -X POST "$BASE_URL/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bad"}'
echo ""
echo ""

# ----------------------------------------------------------
# Test 10: GET /products after failed POST (expect HIT — cache preserved)
# ----------------------------------------------------------
echo ">>> TEST 10: GET /products (expect X-Cache: HIT — cache not cleared by 400)"
curl -s -D /dev/stderr "$BASE_URL/products" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 11: PUT /products/1 (full replace — clears cache)
# ----------------------------------------------------------
echo ">>> TEST 11: PUT /products/1 (full replace)"
curl -s -i -X PUT "$BASE_URL/products/1" \
  -H "Content-Type: application/json" \
  -d '{"name":"Gaming Mouse","price":39.99,"category":"Electronics"}'
echo ""
echo ""

# ----------------------------------------------------------
# Test 12: GET /products after PUT (expect MISS)
# ----------------------------------------------------------
echo ">>> TEST 12: GET /products (expect X-Cache: MISS after PUT)"
curl -s -D /dev/stderr "$BASE_URL/products" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 13: PATCH /products/2 (partial update — clears cache)
# ----------------------------------------------------------
echo ">>> TEST 13: PATCH /products/2 (partial update)"
curl -s -i -X PATCH "$BASE_URL/products/2" \
  -H "Content-Type: application/json" \
  -d '{"price":89.99}'
echo ""
echo ""

# ----------------------------------------------------------
# Test 14: GET /products after PATCH (expect MISS)
# ----------------------------------------------------------
echo ">>> TEST 14: GET /products (expect X-Cache: MISS after PATCH)"
curl -s -D /dev/stderr "$BASE_URL/products" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 15: DELETE /products/5
# ----------------------------------------------------------
echo ">>> TEST 15: DELETE /products/5"
curl -s -i -X DELETE "$BASE_URL/products/5"
echo ""
echo ""

# ----------------------------------------------------------
# Test 16: GET /products after DELETE (expect MISS)
# ----------------------------------------------------------
echo ">>> TEST 16: GET /products (expect X-Cache: MISS after DELETE)"
curl -s -D /dev/stderr "$BASE_URL/products" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 17: DELETE /products/999 (404 — should NOT clear cache)
# ----------------------------------------------------------
echo ">>> TEST 17: DELETE /products/999 (expect 404 — cache preserved)"
curl -s -i -X DELETE "$BASE_URL/products/999"
echo ""
echo ""

# ----------------------------------------------------------
# Test 18: GET /products after failed DELETE (expect HIT)
# ----------------------------------------------------------
echo ">>> TEST 18: GET /products (expect X-Cache: HIT — cache not cleared by 404)"
curl -s -D /dev/stderr "$BASE_URL/products" 2>&1 | head -15
echo ""
echo ""

# ----------------------------------------------------------
# Test 19: Unknown route (404 fallback)
# ----------------------------------------------------------
echo ">>> TEST 19: GET /unknown (expect 404)"
curl -s -i "$BASE_URL/unknown"
echo ""
echo ""

echo "============================================"
echo "  All tests complete!"
echo "============================================"
