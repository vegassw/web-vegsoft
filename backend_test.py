#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, date, timedelta

class VegsoftAPITester:
    def __init__(self, base_url="https://vegsoft-deploy.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details="", endpoint=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "name": name,
            "success": success,
            "details": details,
            "endpoint": endpoint,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                success = "Vegsoft Solutions API" in data.get("message", "")
                self.log_test(
                    "API Root Endpoint",
                    success,
                    f"Status: {response.status_code}, Response: {data}",
                    "/api/"
                )
                return success
            else:
                self.log_test(
                    "API Root Endpoint",
                    False,
                    f"Status: {response.status_code}",
                    "/api/"
                )
                return False
        except Exception as e:
            self.log_test(
                "API Root Endpoint",
                False,
                f"Error: {str(e)}",
                "/api/"
            )
            return False

    def test_contact_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+56 9 1234 5678",
            "company": "Test Company",
            "service": "web",
            "message": "This is a test contact submission"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/contact",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                success = (
                    data.get("status") == "success" and
                    "id" in data and
                    "message" in data
                )
                self.log_test(
                    "Contact Form Submission",
                    success,
                    f"Status: {response.status_code}, Response: {data}",
                    "/api/contact"
                )
                return success, data.get("id")
            else:
                self.log_test(
                    "Contact Form Submission",
                    False,
                    f"Status: {response.status_code}, Response: {response.text}",
                    "/api/contact"
                )
                return False, None
                
        except Exception as e:
            self.log_test(
                "Contact Form Submission",
                False,
                f"Error: {str(e)}",
                "/api/contact"
            )
            return False, None

    def test_appointment_creation(self):
        """Test appointment creation"""
        future_date = (date.today() + timedelta(days=3)).strftime('%Y-%m-%d')
        
        test_data = {
            "name": "Test Appointment",
            "email": "appointment@example.com",
            "phone": "+56 9 8765 4321",
            "company": "Appointment Test Co",
            "date": future_date,
            "time": "10:00",
            "service": "consulting",
            "notes": "This is a test appointment"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/appointments",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                success = (
                    "id" in data and
                    data.get("name") == test_data["name"] and
                    data.get("date") == test_data["date"] and
                    data.get("time") == test_data["time"]
                )
                self.log_test(
                    "Appointment Creation",
                    success,
                    f"Status: {response.status_code}, Appointment ID: {data.get('id')}",
                    "/api/appointments"
                )
                return success, data.get("id"), data.get("date")
            else:
                self.log_test(
                    "Appointment Creation",
                    False,
                    f"Status: {response.status_code}, Response: {response.text}",
                    "/api/appointments"
                )
                return False, None, None
                
        except Exception as e:
            self.log_test(
                "Appointment Creation",
                False,
                f"Error: {str(e)}",
                "/api/appointments"
            )
            return False, None, None

    def test_available_times(self, test_date=None):
        """Test available times endpoint"""
        if not test_date:
            test_date = (date.today() + timedelta(days=1)).strftime('%Y-%m-%d')
        
        try:
            response = requests.get(
                f"{self.api_url}/appointments/available-times",
                params={"date": test_date},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                success = (
                    "date" in data and
                    "available_times" in data and
                    isinstance(data["available_times"], list)
                )
                times_count = len(data.get("available_times", []))
                self.log_test(
                    "Available Times Query",
                    success,
                    f"Status: {response.status_code}, Date: {test_date}, Available slots: {times_count}",
                    "/api/appointments/available-times"
                )
                return success
            else:
                self.log_test(
                    "Available Times Query",
                    False,
                    f"Status: {response.status_code}, Response: {response.text}",
                    "/api/appointments/available-times"
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Available Times Query",
                False,
                f"Error: {str(e)}",
                "/api/appointments/available-times"
            )
            return False

    def test_contact_validation(self):
        """Test contact form validation with invalid data"""
        invalid_data = {
            "name": "",  # Missing name
            "email": "invalid-email",  # Invalid email
            "message": ""  # Missing message
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/contact",
                json=invalid_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            # Should return 422 for validation error
            success = response.status_code == 422
            self.log_test(
                "Contact Form Validation",
                success,
                f"Status: {response.status_code} (expected 422 for invalid data)",
                "/api/contact"
            )
            return success
                
        except Exception as e:
            self.log_test(
                "Contact Form Validation",
                False,
                f"Error: {str(e)}",
                "/api/contact"
            )
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Vegsoft Solutions API Tests\n")
        print("=" * 50)
        
        # Test API connectivity
        if not self.test_api_root():
            print("❌ API root test failed - stopping further tests")
            return False
        
        # Test contact form
        self.test_contact_submission()
        
        # Test appointment system
        success, apt_id, apt_date = self.test_appointment_creation()
        if success and apt_date:
            # Test available times with the same date to verify booking affects availability
            self.test_available_times(apt_date)
        else:
            # Test with a different date
            self.test_available_times()
        
        # Test validation
        self.test_contact_validation()
        
        # Print summary
        print("=" * 50)
        print(f"📊 TEST SUMMARY")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = VegsoftAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'tests_run': tester.tests_run,
                'tests_passed': tester.tests_passed,
                'success_rate': tester.tests_passed/tester.tests_run*100 if tester.tests_run > 0 else 0
            },
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())