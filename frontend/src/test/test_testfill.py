import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains


class TestTestfill():
    def setup_method(self):
        self.driver = webdriver.Chrome('frontend/chromedriver')
        self.vars = {}


    def teardown_method(self):
        self.driver.quit()


    def test_testfill(self):
        self.driver.get("http://18.215.185.124/")
        self.driver.set_window_size(1848, 1053)
        self.driver.find_element(By.ID, "username").click()
        self.driver.find_element(By.ID, "username").send_keys("test_user")
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()

        # MOVE TO OTHER TAB
        tabs = self.driver.find_elements(By.CLASS_NAME, "css-1tsvksn")
        tabs[1].click()

        time.sleep(1)

        # SEARCH
        element = self.driver.find_element(By.CLASS_NAME, "css-jgzo53")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).perform()
        self.driver.find_element(By.CSS_SELECTOR, ".MuiInput-input").send_keys("test_up_xlsx")
        time.sleep(1)

        # FILL
        self.driver.find_element(By.CLASS_NAME, "css-3ui2fi").click()
        element = self.driver.find_element(By.CSS_SELECTOR, "body")
        actions = ActionChains(self.driver)   
        self.driver.find_element(By.ID, "name").send_keys("test_fill")
        self.driver.find_element(By.CSS_SELECTOR, "div > .MuiButton-outlined").click()
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root > input").send_keys(os.getcwd()+"/frontend/src/test/testing_docs/excel/input_standardExcel-Data.json")
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-containedPrimary").click()

        # MOVE TO OTHER TAB
        tabs = self.driver.find_elements(By.CLASS_NAME, "css-1tsvksn")
        tabs[0].click()

        # GO BACK
        tabs = self.driver.find_elements(By.CLASS_NAME, "css-1tsvksn")
        tabs[1].click()

        # SEARCH
        element = self.driver.find_element(By.CLASS_NAME, "css-jgzo53")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).perform()
        self.driver.find_element(By.CSS_SELECTOR, ".MuiInput-input").send_keys("test_fill.xlsx")
        time.sleep(2)
        
        # DOWNLOAD
        self.driver.find_element(By.CLASS_NAME, "css-1h0bc1a").click()

        assert self.driver.find_element_by_xpath("//*[contains(text(), 'test_fill.xlsx')]").text == "test_fill.xlsx"

        # LOGOUT
        self.driver.find_element(By.CLASS_NAME, "css-clz2bc").click()