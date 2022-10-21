<template>
    <v-autocomplete
        v-model="supplier_comodities"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :dense="dense"
        :class="dense ? '' : 'rounded-form'"
        label="Supplier Comodity"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired"
                    >{{ label
                    }}<span :class="disabled ? '' : 'text-red'">*</span></span
                >
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired"
                    >Supplier Comodity<span :class="disabled ? '' : 'text-red'"
                        >*</span
                    ></span
                >
                <span v-else>Supplier Comodity</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
export default {
    name: "SelectSupplierComodity",
    data() {
        return {
            items: [],
            placeholder: "",
            isLoading: false,
            search: "",
            supplier_comodities: null,
            timeout: null,
        };
    },
    props: [
        "supplier_comodity",
        "disabled",
        "clear",
        "error",
        "label",
        "norequired",
        "dense",
        "is_all",
    ],
    methods: {
        //Get Data List Supplier Comodity
        remoteSearch(search) {
            this.placeholder = "Loading items...";
            this.isLoading = true;
            this.$http
                .get(
                    this.is_all
                        ? "/purchase/supplier/commodity"
                        : "/purchase/supplier/commodity/filter",
                    {
                        params: {
                            perpage: 10,
                            conditions: "status:1|name.icontains:" + search,
                        },
                    }
                )
                .then((response) => {
                    this.items = response.data.data;
                    if (this.items === null) {
                        this.items = [];
                    }
                    this.isLoading = false;
                    let label = "Supplier Comodity";
                    if (this.label) label = this.label;
                    this.placeholder = "Select " + label;
                });
        },
        //Auto Select Supplier Comodity
        autoSelectByID(val) {
            if (val) {
                this.$http
                    .get(
                        this.is_all
                            ? "/purchase/supplier/commodity"
                            : "/purchase/supplier/commodity/filter",
                        {
                            params: {
                                conditions: "id.e:" + val.id,
                            },
                        }
                    )
                    .then((response) => {
                        this.items.push(response.data.data[0]);
                        this.supplier_comodities = response.data.data[0];
                    });
            }
        },
        //Select Supplier Comodity
        selected(event) {
            this.$emit("selected", event);
        },
    },
    mounted() {
        this.remoteSearch("");
    },
    watch: {
        //For Search on field
        search: {
            handler: function (val) {
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    if (val) {
                        this.remoteSearch(val);
                    }
                }, 500);
            },
            deep: true,
        },
        // ini untuk clear data
        clear: {
            handler: function () {
                this.supplier_comodities = null;
            },
            deep: true,
        },
        // watch perubahan untuk auto select (biasa di pakai di page update)
        supplier_comodity: {
            handler: function (val) {
                if (val) {
                    this.autoSelectByID(val);
                }
            },
            deep: true,
        },
    },
};
</script>