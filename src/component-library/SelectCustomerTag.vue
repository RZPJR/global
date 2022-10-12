<template>
    <v-autocomplete
        :loading="isLoading"
        v-model="customerTags"
        :items="items"
        :placeholder="placeholder"
        item-text="name"
        :counter="maxSelected"
        :menu-props="menuProps"
        :search-input.sync="search"
        @input="adjustOptions"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        chips
        multiple
        deletable-chips
        :dense="dense"
        :class="dense?'multi':'rounded-form multi'"
        :error-messages="error"
    >
        <template v-slot:label>
            <div class="select-item">
                <div v-if="label">
                    <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>{{ label }}</span>
                </div>
                <div v-else>
                    <span v-if="!norequired">Customer Tag<span :class="disabled?'':'text-red'">*</span></span>
                    <span v-else>Customer Tag</span>
                </div>
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.name }}
        </template>
    </v-autocomplete>
</template>
<script> 
    export default {
        name: 'SelectCustomerTag',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder : '',
                customerTags: [],
                maxSelected: 1,
                menuProps: {
                    disabled: false
                },
                search: '',
            };
        },
        props: ['watchCustomerTag', 'disabled', 'clear', 'label', 'error', 'norequired', 'attribute', "dense"],
        methods: {
            setMaxSelected() {
                let attributeValue = this.attribute
                if (!attributeValue) {
                    attributeValue = 'cust_max_tag'
                }
                if (attributeValue == 'max_attr') {
                    this.maxSelected = false
                }
                else {
                    this.$http.get("/config/app", {
                        params: {
                            conditions: 'attribute:' + attributeValue,
                            orderby: '-id',
                        }
                    }).then(response => {
                        this.maxSelected = response.data.data[0].value
                    });
                }
            },
            async remoteSearch(search) {
                // ini ke endpoint get all
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/customer/tag/filter", {
                    params: {
                        perpage: 20,
                        conditions: 'status:1|name.icontains:' + search,
                    }
                }).then(response => {
                    if (response.data.data) {
                        response.data.data.forEach((value, index) => {
                            this.items.push(response.data.data[index])
                        });
                    }
                    if (this.items === null) {
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Customer Tag'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
                if (this.customerTags.length >= this.maxSelected && this.attribute != 'max_attr') {
                    this.menuProps.disabled = true
                }
            },
            autoSelectByID(val) {
                if (val) {
                    this.customerTags = []
                    for (let i = 0; i < val.length; i++) {
                        this.customerTags.push(val[i])
                    }
                    if (this.customerTags.length >= this.maxSelected && this.attribute != 'max_attr') {
                        this.menuProps.disabled = true
                    }
                }

            },
            selected(event) {
                this.$emit('selected', event);
            },
            adjustOptions() {
                if (this.computedCounterValue >= this.maxSelected && this.attribute != 'max_attr') {
                    this.menuProps.disabled = true
                } else {
                    this.menuProps.disabled = false
                }
            },
        },
        computed: {
            computedCounterValue() {
                let totalCount = 0
                if (this.customerTags && this.customerTags.length > 0) {
                    const selectedItems = this.customerTags.map((name) => {
                        return this.items.find((element) => element.name == name.name)
                    })
                    totalCount = selectedItems.reduce(function (prev, cur) {
                        return prev + ((cur.count) ? cur.count : 1);
                    }, 0);
                }
                return totalCount
            },
        },
        mounted() {
            this.setMaxSelected();
            this.remoteSearch('');
            if (this.watchCustomerTag) {
                this.autoSelectByID(this.watchCustomerTag)
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    if (val) {
                        this.remoteSearch(val)
                    }
                },
                deep: true
            },
            clear: {
                handler: function (val) {
                    this.customerTags = [];
                    this.remoteSearch('')
                },
                deep: true
            },
            watchCustomerTag: {
                handler: function (val) {
                    if (val) {
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
            customerTags: {
                handler: function (val) {
                    this.search = ''
                },
                deep: true
            },
        },
    };
</script>