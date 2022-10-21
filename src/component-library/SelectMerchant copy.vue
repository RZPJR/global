<template>
    <v-autocomplete
        v-model="merchants"
        :items="items"
        :loading="isLoading"
        item-text="name"
        item-value='code'
        :no-filter="true"
        :search-input.sync="search"
        :placeholder="placeholder"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :error-messages="error"
        clearable
        @click:clear="remoteSearch('')"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.name }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.name }}
        </template>
        <template v-slot:label>
            <div v-if="label">
                <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>{{ label }}</span>
            </div>
            <div v-else>
                <span v-if="!norequired">Merchant<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Merchant</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectMerchant',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                search: '',
                merchants: null
            };
        },
        props: ['merchant', 'disabled', 'clear', 'error', 'label', "norequired", "customerGroup", "business_type", "minSearch", "dense"],
        methods: {
            remoteSearch(search) {
                let customer_group = '';
                if (this.customerGroup) {
                    customer_group = '|customer_group:' + this.customerGroup
                }
                let business_types = '';
                if (this.business_type && this.business_type !== "65536") {
                    business_types = '|business_type_id.e:' + this.business_type
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/customer/merchant/filter", {
                    params: {
                        perpage: 10,
                        embeds: 'finance_area_id,invoiceterm',
                        conditions: 'status:1|name.icontains:' + search + '%2COr.code.icontains:'
                        + search + '%2COr.phonenumber.icontains:' + search + customer_group + business_types,
                        orderby: '-id',
                    }
                }).then(response => {
                    if (response) {
                        this.items = response.data.data
                    }
                    if (this.items === null) {
                        this.items = []
                    }
                    if (this.merchant) {
                        this.autoSelectByID(this.merchant)
                    }
                    this.isLoading = false
                    let label = 'Merchant'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if (val) {
                    // ini ke endpoint detail
                    this.$http.get("/customer/merchant/filter", {
                        params: {
                            embeds: 'finance_area_id',
                            conditions: 'id.e:' + val.id,
                        }
                    }).then(response => {
                        this.items.push(response.data.data[0])
                        this.merchants = response.data.data[0]
                    });
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if (val) {
                        if (this.minSearch) {
                            if (val.length > 1) {
                                this.remoteSearch(val)
                            } else {
                                this.items = []
                            }
                        } else {
                            this.remoteSearch(val)
                        }
                    } else {
                        this.remoteSearch("")
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.merchants = null
                },
                deep: true
            },
            merchant: {
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if (val) {
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            business_type: {
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if (val) {
                        this.remoteSearch("")
                    }
                },
                deep: true
            }
        },
    };
</script>
