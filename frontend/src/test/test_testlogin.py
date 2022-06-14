import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains


class TestTestlogin():
    def setup_method(self):
        self.driver = webdriver.Chrome('../../chromedriver')
        self.vars = {}

    def teardown_method(self):
        self.driver.quit()

    def test_testlogin(self):
        self.driver.get("http://18.215.185.124/")
        self.driver.set_window_size(956, 1095)
        self.driver.find_element(By.ID, "username").click()
        element = self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).perform()
        self.driver.find_element(By.ID, "username").send_keys("test_user")

        time.sleep(7)
        assert self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root")

        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()
