<template>
    <div>
        <div v-if="exist">
            <v-autocomplete
                ref="financeWarehouse"
                class="rounded-form-sm"
                v-model="financeWarehouses"
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
                dense
                style="margin-bottom: -24px"
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
    name: "SelectFinanceWarehouseTable",
    data() {
        return {
            items: [],
            isLoading: false,
            search: "",
            placeholder: "",
            searchtyping: false,
            financeWarehouses: {
                code: "",
                name: "",
            },
            exist: true,
            product_text: "",
        };
    },
    props: [
        "product",
        "disabled",
        "clear",
        "label",
        "error",
        "norequired",
        "refs",
        "name",
        "update",
    ],
    methods: {
        focusInput() {
            if (this.$refs.product) {
                this.$refs.product.focus();
            }
        },
        remoteSearch(search) {
            // ini ke endpoint get all
            this.placeholder = "Loading items...";
            this.isLoading = true;
            this.$http
                .get("/user/staff", {
                    params: {
                        perpage: 10,
                        conditions:
                            "Or.name.icontains:" +
                            search +
                            "%2COr.code.icontains:" +
                            search +
                            "|role.name:Finance Warehouse",
                        embeds: "role",
                        orderby: "-id",
                    },
                })
                .then((response) => {
                    this.items = [];
                    let array = response.data.data;
                    if (array != null) {
                        for (let i = 0; i < array.length; i++) {
                            this.items.push(array[i]);
                        }
                    }
                    if (this.product) {
                        this.autoSelectByID(this.product);
                    }
                    if (!this.searchtyping) {
                        if (this.items.length == 0) {
                            this.exist = false;
                        } else {
                            this.exist = true;
                        }
                    }
                    this.isLoading = false;
                    let label = "Finance Warehouse";
                    if (this.label) label = this.label;
                    this.placeholder = "Select " + label;
                });
        },
        autoSelectByID(val) {
            if (val) {
                this.$http
                    .get("/user/staff", {
                        params: {
                            conditions: "id.e:" + val.id,
                            embeds: "role",
                        },
                    })
                    .then((response) => {
                        this.financeWarehouses = response.data.data[0];
                        this.items.push(response.data.data[0]);
                        this.product_text =
                            response.data.data[0].code +
                            " - " +
                            response.data.data[0].name;
                    });
            } else {
                this.customers = null;
            }
        },
        selected(event) {
            this.$emit("selected", event);
        },
    },
    mounted() {
        if (!this.update) {
            this.remoteSearch("");
        }
    },
    watch: {
        search: {
            handler: function (val) {
                if (val) {
                    this.remoteSearch(val);
                } else {
                    this.remoteSearch("");
                }
                this.searchtyping = true;
            },
            deep: true,
        },
        clear: {
            handler: function (val) {
                this.financeWarehouses = null;
                if (val) this.remoteSearch("");
            },
            deep: true,
        },
        product: {
            handler: function (val) {
                if (val) {
                    // ini untuk auto select
                    this.autoSelectByID(val);
                } else {
                    this.financeWarehouses = null;
                }
            },
            deep: true,
        },
        financeWarehouses: {
            handler: function (val) {
                if (val.code && val.name) {
                    this.product_text = val.code + " - " + val.name;
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
    },
};
</script>
