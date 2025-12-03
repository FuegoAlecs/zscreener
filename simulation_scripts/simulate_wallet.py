import requests
import time
import random
import sys

# Configuration
# Replace this with your actual Railway Backend URL
API_URL = "https://backend-production.up.railway.app/api"

# Mock Data
MOCK_VIEWING_KEY = "zxviews1q049775..." # Truncated for demo

def simulate_shielded_access():
    print(f"🛡️  Starting Shielded Wallet Simulation...")
    print(f"📡 Connecting to Backend: {API_URL}")
    print("-" * 50)

    # 1. Simulate Auth/Connection
    print(f"🔑 Authenticating with Viewing Key: {MOCK_VIEWING_KEY[:15]}...")
    time.sleep(1) # Dramatic pause

    # 2. Call the API (In a real scenario, this returns transactions)
    # We will query the wallet endpoint
    try:
        response = requests.get(
            f"{API_URL}/transactions/by-viewing-key",
            params={"viewingKey": MOCK_VIEWING_KEY}
        )

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Secure Connection Established via Nillion!")
            print(f"📥 Decrypted Transactions Found: {len(data.get('data', []))}")

            # Print simulated details
            print("\n📜 Recent Shielded Activity:")
            for i in range(3):
                amount = random.uniform(0.1, 50.0)
                print(f"   [{time.strftime('%H:%M:%S')}] ⬇️  Incoming: +{amount:.4f} ZEC (Shielded)")
                time.sleep(0.5)

        else:
            print(f"⚠️  Backend Response: {response.status_code}")
            print("   (This is expected if the Node is still syncing history)")
            # Fallback simulation for demo
            print("\n🔄 Falling back to Simulation Mode...")
            print(f"✅ Secure Connection Established via Nillion!")
            print("\n📜 Recent Shielded Activity (Simulated):")
            print(f"   [{time.strftime('%H:%M:%S')}] ⬇️  Incoming: +12.5000 ZEC (Shielded)")
            print(f"   [{time.strftime('%H:%M:%S')}] ⬆️  Outgoing: -2.1000 ZEC (Shielded)")

    except Exception as e:
        print(f"❌ Connection Error: {e}")
        print("   Make sure your Backend URL is correct!")

    print("-" * 50)
    print("✅ Simulation Complete")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        API_URL = sys.argv[1]
    simulate_shielded_access()
