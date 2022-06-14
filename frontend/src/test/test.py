from test_upload import TestUpload
from test_testlogin import TestTestlogin
from test_testfill import TestTestfill


def main():
    try:
        t1 = TestTestlogin()
        t1.setup_method()
        t1.test_testlogin()
        t1.teardown_method
    except Exception:
        print("Upload Test Failed")

    try:
        t2 = TestUpload()
        t2.setup_method()
        t2.test_o()
        t2.teardown_method()
    except Exception:
        print("Upload Test Failed")

    try:
        t3 = TestTestfill()
        t3.setup_method()
        t3.test_testfill()
        t3.teardown_method()
    except Exception:
        print("Fill Test Failed")


main()
