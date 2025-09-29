#!/usr/bin/env python3
"""
Test script to verify error handling works correctly
"""

import requests
import time
import subprocess
import sys
import os
from threading import Thread

def start_server():
    """Start the server in background"""
    os.system("python simple_server.py")

def test_errors():
    """Test various error scenarios"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing SCARDUS TECH Server Error Handling")
    print("=" * 50)
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(3)
    
    try:
        # Test 1: Main page should work
        print("\n1️⃣ Testing main page...")
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("✅ Main page loads successfully")
        else:
            print(f"❌ Main page failed: {response.status_code}")
        
        # Test 2: 403 error for admin
        print("\n2️⃣ Testing 403 error (admin)...")
        response = requests.get(f"{base_url}/admin", timeout=5)
        if response.status_code == 403:
            print("✅ 403 error page works for /admin")
        else:
            print(f"❌ 403 test failed: {response.status_code}")
        
        # Test 3: 403 error for private
        print("\n3️⃣ Testing 403 error (private)...")
        response = requests.get(f"{base_url}/private", timeout=5)
        if response.status_code == 403:
            print("✅ 403 error page works for /private")
        else:
            print(f"❌ 403 test failed: {response.status_code}")
        
        # Test 4: 404 error for non-existent page
        print("\n4️⃣ Testing 404 error...")
        response = requests.get(f"{base_url}/nonexistent", timeout=5)
        if response.status_code == 404:
            print("✅ 404 error page works")
        else:
            print(f"❌ 404 test failed: {response.status_code}")
        
        # Test 5: CSS file should work
        print("\n5️⃣ Testing CSS file...")
        response = requests.get(f"{base_url}/styles.css", timeout=5)
        if response.status_code == 200:
            print("✅ CSS file loads successfully")
        else:
            print(f"❌ CSS test failed: {response.status_code}")
        
        print("\n🎉 All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running.")
    except Exception as e:
        print(f"❌ Test error: {e}")

if __name__ == "__main__":
    # Start server in background thread
    server_thread = Thread(target=start_server, daemon=True)
    server_thread.start()
    
    # Run tests
    test_errors()
    
    print("\n💡 To test manually:")
    print("   - Main page: http://localhost:8000/")
    print("   - 403 error: http://localhost:8000/admin")
    print("   - 404 error: http://localhost:8000/nonexistent")
