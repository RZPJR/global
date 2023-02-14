import Vue from "vue";
import http from "./plugins/axios.js";
import "./set-public-path";
import "./global.css";
import "./assets/css/main.scss";

// Import all components in the component-library directory
const components = {};
const componentFiles = require.context("./component-library", true, /\.vue$/);
componentFiles.keys().forEach((fileName) => {
  const componentName = fileName.split("/").pop().replace(/\.\w+$/, "");
  components[componentName] = componentFiles(fileName).default;
});

// Register all components globally
Object.keys(components).forEach((componentName) => {
    console.log(componentName,'wwwwwwwwwwwwwwwwwwwwww')
  Vue.component(componentName, components[componentName]);
});

export { default as ImageLogo } from "../public/img/eden-logo.png";
export { default as ImageLogoStaging } from "../public/img/eden-logo-staging.png";
export { default as ImageLogoDev } from "../public/img/eden-logo-dev.png";
export { default as ImageLogoLogin } from "../public/img/logo_login.png";
export { default as ImageAvaUser } from "../public/img/ava_home_user.png";
export { default as BgNavbarNew } from "../public/img/bg_navbar_new.png";
export { default as Image401 } from "../public/img/401.svg";
export { default as Image403 } from "../public/img/403.svg";
export { default as Image404 } from "../public/img/404.svg";
export { default as Image500 } from "../public/img/500.svg";
export { default as Image503 } from "../public/img/main.png";
export { default as Menu } from "../public/icon/menu.png";
export { default as Polygon } from "../public/icon/polygon.png";
export { default as UserProfile } from "../public/img/user-profile.png";
export { default as IconClose } from "../public/icon/close-new.png";
export { default as ImgMobileView } from "../public/img/mobile-view.png";
export { default as ImgMobileFrame } from "../public/img/mobile_frame.png";
export { default as AddImage } from "../public/img/AddImage.png";
export { default as AddImageEnable } from "../public/img/AddImageEnable.png";
export { default as AddImageOrFile } from "../public/img/AddImageOrFile.png";
export { default as AddImageOrFileEnable } from "../public/img/AddImageOrFileEnable.png";
export { default as Worktime } from "../public/img/worktime_new.png";

Vue.use(http);
