import MainPage from "./MainPage";
import SettingPage from "./SetingsPage";
import LoginPage from "./LoginPage";
import CategoryPageComponent from "./CategoryPage";

export interface ISelectedCombination extends Array<number | null> {
    0: number; // First number
    1: number | null; // Second number
  }
export {
    MainPage,
    SettingPage,
    LoginPage,
    CategoryPageComponent
}