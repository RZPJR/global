<template>
    <div>
        <div v-if="exist">
            <v-autocomplete
                ref="product"
                class="rounded-form-sm"
                v-model="products"
                :items="items"
                :loading="isLoading"
                :placeholder="placeholder"
                item-value="code"
                item-text="name"
                :name="name"
                :no-filter="true"
                :search-input.sync="search"
                @change="selected"
                :disabled="disabled"
                return-object
                outlined
                :error-messages="error"
                full-width
                dense
                style="margin-bottom: -24px; font-weight: 400"
                :item-disabled="checkIsItemDisabled"
            >
                <template slot="selection" slot-scope="data">
                    <div class="select-item">
                        {{ data.item.code }} - {{ data.item.name }}
                    </div>
                </template>
                <template slot="item" slot-scope="data">
                    {{ data.item.code }} - {{ data.item.name }}
                </template>
            </v-autocomplete>
        </div>
        <div v-else>
            <v-tooltip top>
                <template v-slot:activator="{ on: tooltip }">
                    <div v-on="{ ...tooltip }">
                        <v-text-field
                            :name="name"
                            outlined
                            disabled
                            class="mt-2 rounded-form-sm"
                            style="margin-bottom: -20px"
                            v-model="product_text"
                            :error-messages="error"
                            dense
                        />
                    </div>
                </template>
                <span>{{ product_text }}</span>
            </v-tooltip>
        </div>
    </div>
</template>
<script>
export default {
    name: "SelectProductTransfer",
    data() {
        return {
            items: [],
            isLoading: false,
            search: "",
            searchtyping: false,
            products: [
                {
                    code: "",
                    name: "",
                },
            ],
            exist: true,
            product_text: "",
            placeholder: "",
        };
    },
    props: [
        "disabled",
        "clear",
        "label",
        "error",
        "norequired",
        "warehouse",
        "refs",
        "pb",
        "prefixValue",
        "name",
        "update",
        "minSearch",
        "uom",
        "selectedProduct",
        "productGroup",
    ],
    methods: {
        checkIsItemDisabled(item) {
            return (
                this.selectedProduct.findIndex(
                    (product) => product.id === item.id
                ) !== -1
            );
        },
        checkExist() {
            if (this.products) {
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].id == this.products.id) {
                        this.exist = true;
                        break;
                    } else {
                        this.exist = false;
                    }
                }
            }
        },
        focusInput() {
            if (this.$refs.product) {
                this.$refs.product.focus();
            }
        },
        remoteSearch(search) {
            this.placeholder = "Loading items...";
            this.isLoading = true;
            let warehouse = "";
            if (this.warehouse) {
                warehouse = "|warehouse.id.e:" + this.warehouse;
            }
            let product_uom = "";
            if (this.uom) {
                product_uom = "|product.uom.id.e:" + this.uom;
            }
            let product_group = "";
            if (this.productGroup) {
                product_group =
                    "|product.product_group_id.e:" + this.productGroup;
            }
            this.$http
                .get("/warehouse/transfer_sku/filter/product_group", {
                    params: {
                        perpage: 10,
                        conditions:
                            "Or.product.name.icontains:" +
                            search +
                            "%2COr.product.code.icontains:" +
                            search +
                            "|status:1" +
                            warehouse +
                            product_uom +
                            product_group,
                    },
                })
                .then((response) => {
                    this.isLoading = false;
                    let label = "Product";
                    if (this.label) label = this.label;
                    this.placeholder = "Select " + label;
                    this.items = [];
                    let array = response.data.data;
                    if (array) {
                        for (let i = 0; i < array.length; i++) {
                            this.items.push(array[i].product);
                        }
                    }
                    if (!this.searchtyping) {
                        if (this.items.length == 0) {
                            this.exist = false;
                        } else {
                            this.exist = true;
                        }
                    }
                });
        },
        selected(event) {
            this.$emit("selected", event);
        },
    },
    mounted() {
        if (this.prefixValue) {
            this.products = this.prefixValue;
        }
        if (!this.update) {
            if (this.minSearch) {
                if (this.products.length > 1) {
                    this.remoteSearch("");
                } else {
                    this.items = [];
                }
            } else {
                this.remoteSearch("");
            }
        }
    },
    watch: {
        uom: {
            handler: function () {
                this.remoteSearch("");
            },
        },
        search: {
            handler: function (val) {
                if (val) {
                    if (this.minSearch) {
                        if (val.length > 1) {
                            this.remoteSearch(val);
                        } else {
                            this.items = [];
                        }
                    } else {
                        this.remoteSearch(val);
                    }
                }
                this.searchtyping = true;
            },
            deep: true,
        },
        clear: {
            handler: function (val) {
                this.products = [];
                if (val) this.remoteSearch("");
            },
            deep: true,
        },
        products: {
            handler: function (val) {
                if (val) {
                    this.product_text = val.code + " - " + val.name;
                }
                if (this.prefixValue) {
                    this.exist = true;
                } else if (!this.searchtyping) {
                    this.checkExist();
                }
            },
            deep: true,
        },
        items: {
            handler: function (val) {
                if (val) {
                    if (this.prefixValue) {
                        this.exist = true;
                    } else if (!this.searchtyping) {
                        this.checkExist();
                    }
                }
            },
            deep: true,
        },
        refs: {
            handler: function (val) {
                if (val) {
                    let idx = val.split("-")[0];
                    let length = val.split(",")[1];
                    if (idx == length) {
                        this.focusInput();
                    }
                }
            },
            deep: true,
        },
        productGroup: {
            handler: function () {
                this.remoteSearch("");
            },
        },
    },
};
</script>
