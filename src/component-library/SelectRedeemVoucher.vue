<template>
    <v-autocomplete
        v-model="redeem_code"
        :items="items"
        :placeholder="placeholder"
        :loading="isLoading"
        item-text="redeem_code"
        item-value='code'
        :no-filter="true"
        :search-input.sync="search"
        @change="selected"
        :dense="dense"
        :class="dense?'':'rounded-form'"
        :disabled="disabled"
        return-object
        outlined
        :error-messages="error"
        clearable
        @click:clear="remoteSearch('')"
    >
        <template slot="selection" slot-scope="data">
            <div class="select-item">
                {{ data.item.code }} - {{ data.item.redeem_code }}
            </div>
        </template>
        <template slot="item" slot-scope="data">
            {{ data.item.code }} - {{ data.item.redeem_code }}
        </template>
        <template v-slot:label>
            <div v-if="label">
               <span v-if="!norequired">{{ label }}<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>{{ label }}</span>
            </div>
            <div v-else>
               <span v-if="!norequired">Redeem Code<span :class="disabled?'':'text-red'">*</span></span>
               <span v-else>Redeem Code</span>
            </div>
        </template>
    </v-autocomplete>
</template>
<script>
    export default {
        name: 'SelectRedeemVoucher',
        data() {
            return {
                items: [],
                isLoading: false,
                search:'',
                placeholder : '',
                redeem_code:null,
            };
        },
        props: ['redeemCode','disabled','clear','error', 'label', "norequired", "customerGroup", "dense"],
        methods: {
            remoteSearch(search) {
                let customer_group = ''
                if(this.customerGroup){
                    customer_group = '|customer_group:'+this.customerGroup
                }
                this.placeholder="Loading items..."
                this.isLoading = true
                this.$http.get("/promotion/voucher/filter",{params:{
                    perpage:10,
                    embeds:'area_id,archetype_id',
                    conditions:'redeem_code.icontains:'+search,
                    orderby:'-id',
                }}).then(response => {
                    if(response){
                        this.items = response.data.data
                    }
                    if(this.items === null){
                        this.items = []
                    }
                    this.isLoading = false
                    let label = 'Redeem Code'
                    if (this.label) 
                    label = this.label
                    this.placeholder = "Select "+ label
                });
            },
            autoSelectByID(val) {
                if(val){
                    // ini ke endpoint detail
                    this.$http.get("/promotion/voucher/filter",{params:{
                        embeds:'area_id,archetype_id',
                        conditions:'id.e:'+val.id,
                    }}).then(response => {
                        this.items.push(response.data.data[0])
                        this.redeem_code = response.data.data[0]
                    });
                }

            },
            selected(event) {
                this.$emit('selected', event);
            }
        },
        mounted() {
            this.remoteSearch('');
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val){
                        this.remoteSearch(val)
                    } 
                },
                deep: true
            },
            clear: {
                handler: function (val) { // ini untuk clear data
                    this.redeem_code = null
                },
                deep: true
            },
            redeemCode:{
                handler: function (val) { // watch perubahan untuk auto select (biasa di pakai di page update)
                    if(val){
                        this.autoSelectByID(val)
                    }
                },
                deep: true
            }
        },
    };
</script>