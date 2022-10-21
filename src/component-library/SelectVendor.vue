<template>
    <v-autocomplete
        v-model="vendors"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text='name'
        :dense="dense"
        :class="dense?'':'rounded-form'"
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
               <span v-if="!norequired">Vendor<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Vendor</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectVendor',
        data() {
            return {
                items: [],
                isLoading: false,
                placeholder: '',
                search: '',
                vendors: null
            };
        },
        props: ['vendor', 'disabled', 'clear', 'error', 'label', "norequired", "dense"],
        methods: {
            remoteSearch(search) {
                this.placeholder = "Loading items..."
                this.isLoading = true
                this.$http2.get("/logistic/vendor", {
                    params: {
                        perpage: 10,
                        conditions: 'status:1|name.icontains:' + search,
                        orderby: '-id',
                    }
                }).then(response => {
                    let arr = []
                    if (response.data.data != null) {
                        arr = response.data.data
                    }
                    for (let i = 0; i < arr.length; i++) {
                        this.items.push({
                            id: arr[i].id,
                            code: arr[i].code,
                            name: arr[i].name,
                        })
                    }
                    this.isLoading = false
                    let label = 'Vendor'
                    if (this.label)
                        label = this.label
                    this.placeholder = "Select " + label
                });
            },
            autoSelectByID(val) {
                if (val.id) {
                    this.$http2.get("/logistic/vendor", {
                        params: {
                            conditions: 'id.e:' + val.id,
                        }
                    }).then(response => {
                        this.items.push(response.data.data[0])
                        this.vendors = response.data.data[0]
                    });
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: {
                handler: function(val) {
                    if (val) {
                        this.remoteSearch(val)
                    } else if (!this.vendor) {
                        this.remoteSearch('')
                    }
                },
                deep: true
            },
            clear: {
                handler: function(val) { // ini untuk clear data
                    if (val == true) {
                        this.vendors = null
                    }
                },
                deep: true
            },
            vendor: {
                handler: function(val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if (val) {
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            },
        },
    };
</script>


