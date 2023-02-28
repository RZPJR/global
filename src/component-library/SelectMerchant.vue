<template>
    <v-autocomplete
        v-model="customers"
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
                <span v-if="!norequired">Customer<span :class="disabled?'':'text-red'">*</span></span>
                <span v-else>Customer</span>
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
                customers: null
            };
        },
        props: ['customer', 'disabled', 'clear', 'error', 'label', "norequired", "customerGroup", "business_type", "minSearch", "dense"],
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
                this.$http.get("/bridge/v1/customer", {
                    params: {
                        perpage: 10,
                        status:1,
                    }
                }).then(response => {
                    this.items = []
                    if (response.data.data && response.data.data !== null && response.data.data !== []) {
                        this.items = response.data.data
                    }
                    if (this.customer) {
                        this.autoSelectByID(this.customer)
                    }
                    this.isLoading = false
                    let label = 'Customer'
                    if (this.label) label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if (val) {
                    // ini ke endpoint detail
                    this.$http.get("/customer/customer/filter", {
                        params: {
                            embeds: 'finance_area_id',
                            conditions: 'id.e:' + val.id,
                        }
                    }).then(response => {
                        this.items.push(response.data.data[0])
                        this.customers = response.data.data[0]
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
                    this.customers = null
                },
                deep: true
            },
            customer: {
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
