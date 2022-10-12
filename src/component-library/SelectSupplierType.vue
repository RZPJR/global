<template>
    <v-autocomplete
        v-model="supplier_types"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="name"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        label="Supplier Type"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled || isLoading"
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
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Supplier Type<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Supplier Type</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
export default {
    name: 'SelectSupplierType',
    data() {
        return {
            items: [],
            placeholder : '',
            isLoading: false,
            search:'',
            supplier_types: null,
            timeout: null,
        };
    },
    props: [
        'supplier_type',
        'disabled',
        'clear',
        'error',
        'label',
        'norequired',
        'dense',
        'selected_badge',
        'selected_commodity',
    ],
    methods: {
        remoteSearch(search, badgeId, commodityId) {
            this.placeholder = "Loading items...";
            this.isLoading = true;
            this.$http
                .get("/purchase/supplier_type/filter", {
                    params: {
                        perpage: 10,
                        conditions: "status:1|name.icontains:" + search,
                        supplier_badge_id: Number(badgeId),
                        supplier_commodity_id: Number(commodityId)
                    },
                })
                .then((response) => {
                    this.items = response.data.data;
                    if (this.items === null) {
                        this.items = [];
                    }
                    this.isLoading = false;
                    let label = "Supplier Type";
                    if (this.label) label = this.label;
                    this.placeholder = "Select " + label;
                });
        },
        autoSelectByID(val) {
            if(val){
                this.$http.get("/purchase/supplier_type/filter",{params:{
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                    this.items.push(response.data.data[0])
                    this.supplier_types = response.data.data[0]
                });
            }
        },
        selected(event) {
            this.$emit('selected', event);
        }
    },
    mounted() {
        this.remoteSearch("", "", "");
    },
    watch: {
        search: {
            handler: function (val) {
                if (this.timeout) clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    if (val) {
                        this.remoteSearch(val, this.selected_badge || 0, this.selected_commodity || 0);
                    }
                }, 500);
            },
            deep: true,
        },
        clear: {
            handler: function () { // ini untuk clear data
                this.supplier_types = null
                },
            deep: true
        },
        supplier_type:{
            handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                if(val){
                    this.autoSelectByID(val)
                }
            },
            deep: true
        },
        // filter type list berdasarkan badge yang dipilih
        selected_badge: {
            handler: function (val) {
                if (val) {
                    this.remoteSearch("", val, this.selected_commodity);
                    this.supplier_types = null;
                }
            },
            deep: true,
        },
    },
};
</script>