<template>
    <div>
        <v-dialog
            v-model="dataprops.model"
            persistent
            scrollable
            max-width="951px"
        >
            <v-card v-if="list" class="dialog">
                <v-row>
                    <v-col class="text-title-modal" cols="12" md="11">
                        Change Shipping Address
                    </v-col>
                    <v-col class="flex-align-end" cols="12" md="1">
                        <v-btn
                            icon
                            @click="dataprops.model = false"
                        >
                            <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                        </v-btn>
                    </v-col>
                </v-row>
                <div class="mt12">
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field
                                dense 
                                v-model="search"
                                outlined
                                filled
                                label="Search by Address Name"
                                prepend-inner-icon="search"
                            ></v-text-field>
                        </v-col>
                        <v-col class="flex-align-end" cols="12" md="8">
                            <v-btn
                                @click="renderData(), list = false"
                                depressed
                                outlined
                                color="#EBEBEB"
                                class="only-btn"
                            >
                                <span class="text-secondary">Create New Address</span>
                            </v-btn>
                        </v-col>
                    </v-row>
                </div>
                <v-row class="hr-title"/>
                <v-card-text class="h400 mt12">
                    <div v-for="(item, idx) in items" :key="idx">
                        <v-checkbox
                            v-model="modelcheckbox"
                            :value="item.id"
                            color="#50ABA3"
                            @click="chooseCheckbox(item)"
                        >
                            <template v-slot:label>
                                <div :class="modelcheckbox==item.id ? 'checkbox-label-def':'checkbox-label'">
                                    <div class="fs16" style="color:black">
                                        {{item.address_name}}
                                        <v-chip
                                            v-if="item.main_branch == 1"
                                            class="ma-2"
                                            color="#50ABA3"
                                            label
                                            small
                                            text-color="white"
                                        >Default</v-chip>
                                        <v-chip
                                            v-else
                                            class="ma-2"
                                            :color="modelcheckbox==item.id ?'#EDF7F6':'white'"
                                            label
                                            small
                                        ></v-chip>
                                    </div>
                                    <div>
                                        {{item.shipping_address}}
                                    </div>
                                    <div>
                                        {{item.sub_district.concat_address}}  {{ item.sub_district.postal_code }}
                                    </div>
                                    <div>
                                        {{item.pic_name}} - {{item.phone_number}}
                                    </div>
                                    <div>
                                        {{item.alt_phone_number}}
                                    </div>
                                </div>
                            </template>
                        </v-checkbox>
                    </div>
                </v-card-text>
                <div class="box-footer-modal flex-align-end pr4 pb4 pt24">
                    <v-btn
                        @click="saveShippingAddress()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Ok</v-btn>
                </div>
            </v-card>
            <v-card v-else class="dialog">
                <v-row>
                    <v-col class="text-title-modal" cols="12" md="11">
                        Create Shipping Address
                    </v-col>
                    <v-col class="flex-align-end" cols="12" md="1">
                        <v-btn
                            icon
                            @click="dataprops.model = false"
                        >
                            <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row class="hr-title"/>
                <v-card-text class="h520 mt12">
                    <v-row class="mt-10 -mx24">
                        <v-col cols="12" md="6" class="-mt24">
                            <v-text-field
                                name="recipient_name"
                                v-model="form.recipient_name"
                                maxlength="20"
                                dense
                                required
                                outlined
                                :error-messages="error.recipient_name"
                            >
                                <template v-slot:label>
                                    Recipient Name<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <v-text-field
                                name="recipient_phone"
                                v-model="form.recipient_phone_number"
                                required
                                dense
                                outlined
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                                maxlength="15"
                                :error-messages="error.recipient_phone_number"
                            >
                                <template v-slot:label>
                                    Recipient Phone Number<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <v-text-field
                                name="recipient_alt_phone_number"
                                v-model="form.recipient_alt_phone_number"
                                label="Recipient Alternative Phone Number"
                                outlined
                                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                                maxlength="15"
                                dense
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <v-text-field
                                name="area"
                                v-model="areaValue"
                                required
                                outlined
                                disabled
                                dense
                                :error-messages="error.area_id"
                            >
                                <template v-slot:label>
                                    Area<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <SelectProvince
                                name="province"
                                v-model="province"
                                @selected="provinceSelected"
                                :clear="clearProvince"
                                required
                                :dense="true"
                                :error-messages="error.province_id"
                            ></SelectProvince>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <SelectCity
                                name="city"
                                v-model="city"
                                @selected="citySelected"
                                :clear="clearCity"
                                :province_id="form.province_id"
                                required
                                :dense="true"
                                :disabled="disabled_city"
                                :error-messages="error.city_id"
                            ></SelectCity>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <SelectDistrict
                                name="district"
                                v-model="district"
                                @selected="districtSelected"
                                :province_id="form.province_id"
                                :city_id="form.city_id"
                                :clear="clearDistrict"
                                required
                                :dense="true"
                                :disabled="disabled_district"
                                :error-messages="error.district_id"
                            ></SelectDistrict>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <SelectSubDistrict
                                name="sub_district"
                                v-model="sub_district"
                                @selected="subdistrictSelected"
                                :province_id="form.province_id"
                                :city_id="form.city_id"
                                :district_id="form.district_id"
                                :clear="clearSub_district"
                                required
                                :dense="true"
                                :disabled="disabled_sub_district"
                                :error="error.sub_district_id"
                            ></SelectSubDistrict>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <v-text-field
                                name="postal_code"
                                v-model="postal_code"
                                required
                                outlined
                                disabled
                                dense
                                :error-messages="error.postal_code"
                            >
                                <template v-slot:label>
                                    Postal Code<span style="color:red">*</span>
                                </template>
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="-mx24">
                        <v-col cols="12" md="6" class="-mt24">
                            <v-textarea
                                name="shipping_address"
                                v-model="form.shipping_address"
                                :counter="350"
                                maxlength="350"
                                outlined
                                rows="3"
                                required
                                :error-messages="error.shipping_address"
                            >
                                <template v-slot:label>
                                    Shipping Address<span style="color:red">*</span>
                                </template>
                            </v-textarea>
                        </v-col>
                        <v-col cols="12" md="6" class="-mt24">
                            <v-textarea
                                name="branch_note"
                                v-model="form.shipping_note"
                                rows="3"
                                :counter="100"
                                label="Note"
                                maxlength="100"
                                outlined
                                :error-messages="error.shipping_note"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-card-text>
                <div class="box-footer-modal flex-align-end pr4 pb4 pt24">
                    <div>
                        <v-btn
                            @click="list=true"
                            depressed
                            outlined
                            color="#EBEBEB"
                            class="main-btn"
                        >
                            <span class="text-black80">Cancel</span>
                        </v-btn>
                        <v-btn
                            @click="createShippingAddress()"
                            class="main-btn white--text ml8"
                            depressed
                            color="#50ABA3"
                        >Save</v-btn>
                    </div>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import Vue from 'vue'
export default {
    name : 'ShippingAddressNew',
     data() {
            return {
                list : true,
                items: [],
                modelcheckbox : '',
                search:'',
                data : {
                    area : {
                        id : '',
                        code : '',
                        name : '',
                    }
                },

                area:{},
                areaValue:'',
                postal_code:'',

                province:null,
                clearProvince:false,
                disabled_province:true,

                city:null,
                clearCity:false,
                disabled_city:true,

                district:null,
                clearDistrict:false,
                disabled_district:true,

                sub_district:null,
                clearSub_district:false,
                disabled_sub_district:true,

                postal_code:'',

                warehouse:null,
                clearWarehouse:false,
                disabled_warehouse:true,
                form:{
                    address_name:"",
                    recipient_name:"",
                    recipient_phone_number:"",
                    recipient_alt_phone_number:"",
                    shipping_address:"",
                    shipping_note:"",
                    merchant_id:"",
                    archetype_id:"",
                    salesperson_id:"",
                    area_id:"",
                    sub_district_id:"",
                },
                error:{},
            };
        },
        props: ["dataprops"],
        methods: {
            createShippingAddress() {
                this.$http.post('/customer/agent/shipping/address',this.form)
                .then(response => {
                    this.modelcheckbox = response.data.data.id
                    this.remoteSearch('')
                    this.list = true
                    Vue.$toast.open({
                        position: 'top-right',
                        message: 'Data has been saved successfully',
                        type: 'success',
                    });
                })
                .catch(e => {
                    this.error = e.errors
                });
            },
            saveShippingAddress() {
                this.$root.$emit('event_shipping', this.data)
            },
            chooseCheckbox(item) {
                this.data = {
                    model : false,
                    agent_id : this.dataprops.agent_id,
                    shipping_id : this.modelcheckbox,
                    area : item.area,
                    priceset_id : item.price_set.id,
                    warehouse : item.warehouse,
                    subdistrict_id : item.sub_district.id,
                    shipping_address : item.shipping_address +', '+ item.sub_district.concat_address +', '+ item.sub_district.postal_code
                }
            },
            remoteSearch(search) {
                let agent_id = ''
                if (this.dataprops.agent_id) {
                    agent_id ='|merchant.id.e:'+ this.dataprops.agent_id
                }
                if (this.dataprops.shipping_id) {
                    this.modelcheckbox =this.dataprops.shipping_id
                }
                this.items = []
                this.$http.get("/customer/agent",{params:{
                        perpage:25,
                        embeds:'merchant_id,area_id,archetype_id,price_set_id,warehouse_id,salesperson_id,sub_district_id,merchant.business_type_id,merchant.payment_group_sls_id',
                        conditions:'address_name.icontains:'+search+agent_id+'|status:1',
                        orderby:'main_branch',
                    }}).then(response => {
                    this.items = response.data.data
                    if (!this.dataprops.shipping_id) {
                        for (let i = 0; i < this.items.length; i++) {
                            if (this.items[i].main_branch===1) {
                                this.modelcheckbox = this.items[i].id
                                this.data = {
                                    model : false,
                                    agent_id : this.dataprops.agent_id,
                                    shipping_id : this.items[i].id,
                                    area : this.items[i].area,
                                    warehouse : this.items[i].warehouse,
                                    priceset_id : this.items[i].price_set.id,
                                    subdistrict_id : this.items[i].sub_district.id,
                                    shipping_address : this.items[i].shipping_address+', '+ this.items[i].sub_district.concat_address +', '+ this.items[i].sub_district.postal_code
                                }
                            }
                        }
                    }
                    if(this.items === null){
                        this.items = []
                    }
                });
            },
            renderData(){
                this.form={
                    address_name:"",
                    recipient_name:"",
                    recipient_phone_number:"",
                    recipient_alt_phone_number:"",
                    shipping_address:"",
                    shipping_note:"",
                    merchant_id:"",
                    archetype_id:"",
                    salesperson_id:"",
                    area_id:"",
                    sub_district_id:"",
                },
                this.provinceSelected("")
                this.$http.get("/customer/agent/"+this.dataprops.agent_id).then(response => {
                    this.form.merchant_id = this.dataprops.agent_id
                    this.form.archetype_id = response.data.data[0].archetype.id
                    this.form.salesperson_id = response.data.data[0].salesperson.id
                });
            },
            provinceSelected(d) {
                this.areaValue = '';
                this.form.area_id = ''
                this.postal_code = null
                this.province = null;
                this.form.province_id = '';

                this.city = null;
                this.form.city_id = '';

                this.clearCity = true;
                this.clearDistrict = true;
                this.clearSub_district =true;

                this.disabled_city = true;
                this.disabled_district = true;
                this.disabled_sub_district = true;
                if (d) {
                    this.province = d;
                    this.form.province_id = d.province_id

                    this.disabled_city = false
                    this.clearCity = false
                }
            },
            citySelected(d) {
                this.areaValue = '';
                this.form.area_id = ''
                this.postal_code = null
                this.city = null;
                this.form.city_id = '';

                this.district = null;
                this.form.district_id = '';

                this.clearDistrict = true
                this.clearSub_district =true;

                this.disabled_district = true;
                this.disabled_sub_district = true;
                if (d) {
                    this.city = d;
                    this.form.city_id = d.city_id

                    this.disabled_district = false
                    this.clearDistrict = false
                }
            },
            districtSelected(d) {
                this.areaValue = '';
                this.form.area_id = ''
                this.postal_code = null
                this.district = null;
                this.form.district_id = '';

                this.sub_district = null;
                this.form.sub_district_id = '';

                this.clearSub_district =true;
                this.disabled_sub_district = true;
                if (d) {
                    this.district = d;
                    this.form.district_id = d.district_id

                    this.disabled_sub_district = false
                    this.clearSub_district = false;
                }
            },
            subdistrictSelected(d) {
                this.areaValue = '';
                this.form.area_id = ''
                this.sub_district = null;
                this.form.sub_district_id = '';
                this.postal_code = null

                this.sub_district = null;
                this.form.sub_district_id = '';

                if (d) {
                    this.form.area_id = d.area_id
                    this.areaValue = d.area_name;
                    this.sub_district = d;
                    this.form.sub_district_id = d.sub_district_id
                    this.postal_code = d.postal_code
                }
            },
        },
        watch: {
            search: {
                handler: function (val) {
                    if(val && val.length > 1){
                        this.remoteSearch(val)
                    } else {
                        this.remoteSearch('')
                    }

                },
                deep: true
            },

            dataprops:{
                handler: function (val) {
                    this.shipping_id = val.shipping_id
                    this.remoteSearch('')
                },
                deep: true
            }
        }

}
</script>