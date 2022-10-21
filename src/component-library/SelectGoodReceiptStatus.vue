<template>
    <v-autocomplete
        v-model="good_receipts"
        :items="items"
        :loading="isLoading"
        item-text="name"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        outlined
        :dense="dense"
        :class="dense?'':'rounded-form'"
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
               <span v-if="!norequired">Goods Receipt<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Goods Receipt</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectGoodReceiptStatus',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                good_receipts:null
            };
        },
        props: ['good_receipt','disabled','clear','error', 'label', "norequired", "notreceived", "dense"],
        methods: {
            remoteSearch() {
                this.items =[
                    {
                        name : "All",
                        value : "0",
                    },
                    {
                        name : "Received",
                        value : "1",
                    },
                    {
                        name : "Not Received",
                        value : "2",
                    }
                ]
                if (this.notreceived == true) {
                    this.items.splice(2,1)
                }
            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        watch: {
            search: {
                handler: function (val) {
                    this.remoteSearch()
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.good_receipts = null
                },
                deep: true
            },
            good_receipt:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.good_receipts = val
                    }
                },
                deep: true
            }
        },
    };
</script>