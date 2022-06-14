import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
import os


class TestUpload():
    def setup_method(self):
        self.driver = webdriver.Chrome('frontend/chromedriver')
        self.vars = {}

    def teardown_method(self):
        self.driver.quit()

    def test_o(self):
        self.driver.get("http://18.215.185.124/")
        self.driver.set_window_size(1848, 1053)
        self.driver.find_element(By.ID, "username").click()
        self.driver.find_element(By.ID, "username").send_keys("test_user")
        self.driver.find_element(By.CSS_SELECTOR, ".MuiButton-root").click()

        element = self.driver.find_element(By.ID, "filename_input")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).click_and_hold().perform()
        element = self.driver.find_element(By.ID, "filename_input-label")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).release().perform()
        self.driver.find_element(By.CSS_SELECTOR, ".MuiFormControl-root").click()
        self.driver.find_element(By.ID, "filename_input").send_keys("test_up_xlsx")

        path = "/frontend/src/test/testing_docs/excel/input_standardExcel-Template.xlsx"
        self.driver.find_element(By.CSS_SELECTOR, ".container > div > input").send_keys(os.getcwd() + path)
        element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItemButton-root:nth-child(2) > .MuiListItemText-root")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).perform()

        # MOVE TO OTHER TAB
        tabs = self.driver.find_elements(By.CLASS_NAME, "css-1tsvksn")
        tabs[1].click()

        # SEARCH
        element = self.driver.find_element(By.CLASS_NAME, "css-jgzo53")
        actions = ActionChains(self.driver)
        actions.move_to_element(element).perform()
        self.driver.find_element(By.CSS_SELECTOR, ".MuiInput-input").send_keys("test_up_xlsx")

        time.sleep(2)

        assert self.driver.find_element_by_xpath("//*[contains(text(), 'test_up_xlsx.xlsx')]").text == "test_up_xlsx.xlsx"

        # DOWNLOAD
        self.driver.find_element(By.CLASS_NAME, "css-1h0bc1a").click()

        # LOGOUT
        self.driver.find_element(By.CLASS_NAME, "css-clz2bc").click()
