<template>
    <div>
        <div v-if="exist">
            <v-autocomplete
                ref="payment-method"
                v-model="payment_methods"
                :items="items"
                :loading="isLoading"
                :placeholder="placeholder"
                item-text="name"
                :name="name"
                :no-filter="true"
                :search-input.sync="search"
                @change="selected"
                :disabled="disabled"
                return-object
                outlined
                full-width
                :error-messages="error"
                dense
                class="rounded-form-sm"
                :index="index"
                style="margin-bottom: -24px"
            >
                <template slot="selection" slot-scope="data">
                    {{ data.item.name }}
                </template>
                <template slot="item" slot-scope="data">
                    {{ data.item.name }}
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
                            v-model="payment_text"
                            :error-messages="error"
                            dense
                        />
                    </div>
                </template>
                <span>{{ payment_text }}</span>
            </v-tooltip>
        </div>
    </div>
</template>
<script>
export default {
    name: "SelectPaymentMethodTable",
    data() {
        return {
            items: [],
            placeholder: "",
            isLoading: false,
            search: "",
            searchtyping: false,
            payment_methods: null,
            exist: true,
            payment_text: "",
        };
    },
    props: [
        "payment_method",
        "disabled",
        "clear",
        "label",
        "error",
        "norequired",
        "warehouse",
        "refs",
        "prefixValue",
        "name",
        "minSearch",
        "index",
    ],
    methods: {
        checkExist() {
            if (this.payment_methods) {
                for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].id == this.payment_methods.id) {
                        this.exist = true;
                        break;
                    } else {
                        this.exist = false;
                    }
                }
            }
        },
        focusInput() {
            if (this.$refs.payment_method) {
                this.$refs.payment_method.focus();
            }
        },
        remoteSearch(search) {
            this.placeholder = "Loading items...";
            this.isLoading = true;
            // ini ke endpoint get all
            this.$http
                .get("/finance/payment/method/filter", {
                    params: {
                        perpage: 10,
                        conditions: "status:1|name.icontains:" + search,
                    },
                })
                .then((response) => {
                    this.isLoading = false;
                    let label = "Payment Method";
                    if (this.label) label = this.label;
                    this.placeholder = "Select " + label;
                    this.items = response.data.data;
                    if (this.items === null) {
                        this.items = [];
                    }
                    if (this.payment_method) {
                        this.autoSelectByID(this.payment_method);
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
        autoSelectByID(val) {
            if (val) {
                this.$http
                    .get("/finance/payment/method/filter", {
                        params: {
                            conditions: "id.e:" + val.id,
                        },
                    })
                    .then((response) => {
                        this.payment_methods = response.data.data[0];
                        this.items.push(response.data.data[0]);
                        this.payment_text = response.data.data[0].name;
                    });
            } else {
                this.payment_methods = [];
            }
        },
        selected(event) {
            this.$emit("selected", event, this.index);
        },
    },
    mounted() {
        if (this.prefixValue) {
            this.payment_methods = this.prefixValue;
        }

        if (!this.update) {
            if (this.minSearch) {
                if (this.payment_methods.length > 1) {
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
                this.payment_methods = [];
                if (val) this.remoteSearch("");
            },
            deep: true,
        },
        payment_method: {
            immediate: true,
            handler: function (val) {
                if (val) {
                    // ini untuk auto select
                    this.autoSelectByID(val);
                } else {
                    this.payment_methods = [];
                }
            },
            deep: true,
        },
        payment_methods: {
            handler: function (val) {
                if (val) {
                    this.payment_text = val.name;
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
    },
};
</script>
