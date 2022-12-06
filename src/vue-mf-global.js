import "./set-public-path";
import "./global.css";
import "./assets/css/main.scss";
import Vue from "vue";
import http from "./plugins/axios.js";

Vue.use(http);

// You can export Vue components from this file and import them into your microfrontends
//SELECT COMPONENTS
export { default as SelectArea } from "./component-library/SelectArea.vue";
export { default as SelectMerchant } from "./component-library/SelectMerchant.vue";
export { default as SelectBranch } from "./component-library/SelectBranch.vue";
export { default as SelectPaymentGroup } from "./component-library/SelectPaymentGroup.vue";
export { default as SelectWrt } from "./component-library/SelectWrt.vue";
export { default as SelectWarehouse } from "./component-library/SelectWarehouse.vue";
export { default as SelectOrderType } from "./component-library/SelectOrderType.vue";
export { default as SelectCity } from "./component-library/SelectCity.vue";
export { default as SelectBusinessType } from "./component-library/SelectBusinessType.vue";
export { default as SelectSalesPerson } from "./component-library/SelectSalesPerson.vue";
export { default as SelectWarehouseCoverage } from "./component-library/SelectWarehouseCoverage.vue";
export { default as SelectSalesTerm } from "./component-library/SelectSalesTerm.vue";
export { default as SelectPaymentGroupComb } from "./component-library/SelectPaymentGroupComb.vue";
export { default as SelectProductTable } from "./component-library/SelectProductTable.vue";
export { default as SelectDistrict } from "./component-library/SelectDistrict.vue";
export { default as SelectCourier } from "./component-library/SelectCourier.vue";
export { default as SelectCategory } from "./component-library/SelectCategory.vue";
export { default as SelectPaymentChannel } from "./component-library/SelectPaymentChannel.vue";
export { default as SelectProduct } from "./component-library/SelectProduct.vue";
export { default as SelectPicker } from "./component-library/SelectPicker.vue";
export { default as SelectProvince } from "./component-library/SelectProvince.vue";
export { default as SelectRole } from "./component-library/SelectRole.vue";
export { default as SelectUser } from "./component-library/SelectUser.vue";
export { default as SelectStatus } from "./component-library/SelectStatus.vue";
export { default as SelectPacker } from "./component-library/SelectPacker.vue";
export { default as SelectMainOutlet } from "./component-library/SelectMainOutlet.vue";
export { default as SelectGlossary } from "./component-library/SelectGlossary.vue";
export { default as SelectFilterBusinessType } from "./component-library/SelectFilterBusinessType.vue";
export { default as SelectGoodsReceipt } from "./component-library/SelectGoodsReceipt.vue";
export { default as SelectSubDistrict } from "./component-library/SelectSubDistrict.vue";
export { default as SelectUom } from "./component-library/SelectUom.vue";
export { default as SelectSupplier } from "./component-library/SelectSupplier.vue";
export { default as MultiSelectArcheType } from "./component-library/MultiSelectArcheType.vue";
export { default as MultiSelectArea } from "./component-library/MultiSelectArea.vue";
export { default as MultiSelectBusinessType } from "./component-library/MultiSelectBusinessType.vue";
export { default as MultiSelectDistrict } from "./component-library/MultiSelectDistrict.vue";
export { default as MultiSelectGlossary } from "./component-library/MultiSelectGlossary.vue";
export { default as MultiSelectPacker } from "./component-library/MultiSelectPacker.vue";
export { default as MultiSelectProductTag } from "./component-library/MultiSelectProductTag.vue";
export { default as MultiSelectSubDistrictAll } from "./component-library/MultiSelectSubDistrictAll.vue";
export { default as MultiSelectWrt } from "./component-library/MultiSelectWrt.vue";
export { default as SelectArchetype } from "./component-library/SelectArchetype.vue";
export { default as SelectDivision } from "./component-library/SelectDivision.vue";
export { default as SelectSalesGroup } from "./component-library/SelectSalesGroup.vue";
export { default as MultiSelectRole } from "./component-library/MultiSelectRole.vue";

//MODAL COMPONENTS
export { default as ConfirmationDialogNew } from "./component-library/com-new/ConfirmationDialogNew.vue";
export { default as ShippingAddressNew } from "./component-library/com-new/ShippingAddressNew.vue";
export { default as DetailRowNew } from "./component-library/com-new/DetailRowNew.vue";
export { default as PermissionUpdate } from "./component-library/com-new/PermissionUpdate.vue";
export { default as PermissionCreate } from "./component-library/com-new/PermissionCreate.vue";

//loading bar
export { default as LoadingBar } from "./component-library/com-new/LoadingBar.vue";

// Image Source
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

// Image Source

// CSS Style
// export { default as CustomCss } from "../src/assets/custom/main.css";
// CSS Style
