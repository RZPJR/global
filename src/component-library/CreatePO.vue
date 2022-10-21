<template>
    <v-row justify="center">
        <v-dialog
            v-model="data.modal"
            persistent
            max-width="100%"
        >
        <v-card>
            <v-card-title class="text-h5 second-color">
            <div class="mt-2">
                Create Purchase Order
            </div>
            </v-card-title>
            <v-card-text class="mt-4">
                <v-row>
                    <v-col cols="12" md="3">
                        <SelectWarehouse
                            name="warehouse"
                            :aux_data="2"
                            :warehouse="warehouse"
                            :disabled="true"
                            @selected="warehouseSelected"
                            :error="error.warehouse_id"
                        ></SelectWarehouse>
                    </v-col>
                    <v-col cols="12" md="3">
                        <SelectSupplier
                            name="supplier"
                            @selected="supplierSelected"
                            :error="error.supplier_id"
                        ></SelectSupplier>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-menu
                            ref="menu"
                            v-model="order_date_model"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on }">
                                <div v-on="on">
                                    <v-text-field
                                        name="order_date"
                                        prepend-inner-icon="mdi-calendar"
                                        outlined
                                        disabled
                                        v-model="form.order_date"
                                        :error-messages="error.order_date"
                                        clearable
                                        @click:clear="form.order_date = ''"
                                        class="rounded-form"
                                    >
                                        <template v-slot:label>Order Date</template>
                                    </v-text-field>
                                </div>
                            </template>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-text-field
                            name="note"
                            v-model="form.note"
                            :counter="250"
                            maxlength="250"
                            outlined
                            :error-messages="error.note"
                            required
                            class="rounded-form"
                        >
                            <template v-slot:label>
                                Note
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols="12" md="3" class="mtn24">
                        <v-menu
                            ref="menu"
                            v-model="eta_date_model"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on }">
                                <div v-on="on">
                                    <v-text-field
                                        name="eta_date"
                                        prepend-inner-icon="mdi-calendar"
                                        outlined
                                        :error-messages="error.eta_date"
                                        v-model="form.eta_date"
                                        class="rounded-form"
                                    >
                                        <template v-slot:label>Estimated Arrival Date</template>
                                    </v-text-field>
                                </div>
                            </template>
                            <v-date-picker
                                v-model="form.eta_date"
                                @input="eta_date_model = false"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" md="3" class="mtn24">
                        <v-menu
                            ref="menuTime"
                            v-model="eta_time_model"
                            :close-on-content-click="false"
                            :return-value.sync="form.eta_time"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    name="eta_time"
                                    prepend-inner-icon="mdi-clock-outline"
                                    outlined
                                    clearable
                                    maxlength="5"
                                    onkeypress="return event.charCode >= 48 && event.charCode <= 58"
                                    @click:clear="form.eta_time = ''"
                                    v-model="form.eta_time"
                                    :error-messages="error.eta_time"
                                    class="rounded-form"
                                    v-bind="attrs"
                                    v-on="on"
                                    @blur="$refs.menuTime.save(form.eta_time)"
                                >
                                    <template v-slot:label>
                                        Estimated Arrival Time<span style="color:red">*</span>
                                    </template>
                                </v-text-field>
                            </template>
                            <v-time-picker
                                format="24hr"
                                v-if="eta_time_model"
                                v-model="form.eta_time"
                                full-width
                                @click:minute="$refs.menuTime.save(form.eta_time)"
                            ></v-time-picker>
                        </v-menu>
                    </v-col>
                </v-row>
                <div>
                    <div class="title-table mb-2">
                        <label class="label-title">
                            Product
                        </label>
                    </div>
                    <v-data-table
                        id="nopadding"
                        :headers="table.fields"
                        :items="items"
                        height="450px"
                        fixed-header
                        :loading="loading"
                        :hide-default-footer="true"
                        :items-per-page="-1"
                        mobile-breakpoint="0"
                    >
                        <template v-slot:item="props">
                            <tr>
                                <td class="ctr">{{props.index+1}}</td>
                                <td>
                                    <span :style="errPro(props.index)?'color:red':''">{{ props.item.product.name }}</span> <br>
                                    <span class="fs12 second-color">{{ props.item.product.uom.name }}</span> 
                                    <div v-if="errPro(props.index)" style="color:red;font-size:10px">
                                        {{errPro(props.index)}}
                                    </div>
                                </td>
                                <td class="ctr">{{ props.item.sum_so_qty }}</td>
                                <td class="ctr">
                                    <vue-numeric
                                        :class="errQty(props.index) ? 'productNumeric' : 'productNumericErr'"
                                        separator="."
                                        placeholder="0,00"
                                        :precision="2"
                                        v-model="props.item.qty"
                                    ></vue-numeric>
                                </td>
                                <td class="ctr">{{ props.item.available_stock }}</td>
                                <td class="ctr">{{ props.item.expected_remaining_stock }}</td>
                                <td class="ctr">{{ props.item.spare_qty }}</td>
                                <td class="ctr">{{ props.item.week_1_demand }}</td>
                                <td class="ctr">{{ props.item.week_2_demand }}</td>
                                <td class="ctr">{{ props.item.week_avg_demand }}</td>
                            </tr>
                        </template>
                    </v-data-table>
                </div>
            </v-card-text>
            <v-card-actions class="pb-5">
                <v-spacer></v-spacer>
                <v-btn
                    rounded
                    elevation="0"
                    class="no-caps px-7"
                    @click="data.modal = false"
                    style="background: #E6E9ED; color:#768F9C;height:45px"
                >Cancel</v-btn>
                <v-btn
                    class="px-7 ml-2 no-caps white--text"
                    @click="createPO()"
                    elevation="0"
                    rounded
                    style="background: #768f9c; height:45px"
                    v-privilege="'po_crt'"
                >Save</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        <ConfirmationDialog :sendData="ConfirmData"/>
    </v-row>
</template>
<script>
export default {
    name : "CreatePO",
    data () {
        return {
            loading: false,
            warehouse : '',
            error : {},
            ConfirmData : {},
            order_date_model : '',
            eta_date_model : '',
            eta_time_model : '',
            form : {
                area_id: "",
                supplier_id : "",
                warehouse_id : "",
                term_payment_pur_id : "",
                warehouse_address : "",
                order_date : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                eta_date : new Date(Date.now() + ( 3600 * 1000 * 7)).toISOString().substr(0, 10),
                eta_time : '',
                delivery_fee: 0,
                note : '',
                tax_pct: 0,
                created_from : 1,
                purchase_order_items : [],
            },
            table: {
                fields: [
                    {
                        text:'No',
                        width: "1%",
                        align: 'center',
                        sortable: false,
                    },
                    {
                        text:'Product',
                        sortable: false
                    },
                    {
                        text:'Sum SO Qty',
                        align: 'center',
                        sortable: false
                    },
                    {
                        text:'Purchase Order Qty',
                        align: 'center',
                        sortable: false
                    },
                    {
                        text:'Available Stock',
                        align: 'center',
                        sortable: false
                    },
                    {
                        text:'Expected Remaining Stock',
                        align: 'center',
                        sortable: false,
                        value: 'expected_remaining_stock'
                    },
                    {
                        text:'Spare Qty',
                        align: 'center',
                        sortable: false
                    },
                    {
                        text:'1 Week Demand',
                        align: 'center',
                        sortable: false
                    },
                    {
                        text:'2 Week Demand',
                        align: 'center',
                        sortable: false
                    },
                    {
                        text:'Average 2 Week Demand',
                        align: 'center',
                        sortable: false
                    },
                ],
            },
            items : []
        }
    },
    props: {
        data:{
            modal : false,
            data : [],
            warehouse : {}
        },
    },
    mounted () {
        let self = this
        this.$root.$on('event_error', function(err){
            self.error = err
        });
    },
    methods : {
        // For create PO
        createPO() {
            this.form.purchase_order_items = []
            this.items.forEach(e => {
                this.form.purchase_order_items.push(
                    {
                        "product_id": e.product.id,
                        "qty": e.qty,
                        "unit_price": 0,
                        "subtotal": 0,
                        "note": ""
                    }
                )
            });
            this.ConfirmData = {
                model : true,
                title : "Create Purchase Order",
                text : "Are you sure want to create this Purchase order?",
                urlApi : "/purchase/order",
                nextPage : "/purchase/order",
                data : this.form,
                post :true
            }
        },
        // Error on item
        errQty(idx) {
            for (var key in this.error) {
                if (key.includes(idx) && key.includes('qty')) {
                    return false
                }
            }
            return true
        },
        // Error on product
        errPro(idx) {
            for (var key in this.error) {
                if (key.includes(idx) && key.includes('product_id')) {
                    return this.error[key]
                }
            }
        },
        // For select warehouse
        warehouseSelected(d) {
            this.form.warehouse_id = ""
            this.form.area_id = ""
            this.warehouse = null
            this.form.warehouse_address = ''
            if (d) {
                this.form.area_id = d.area.id
                this.warehouse = d
                this.form.warehouse_id = d.id
                this.$http.get("/config/warehouse/"+d.id).then(response => {
                    this.form.warehouse_address = response.data.data.street_address+', '+response.data.data.sub_district.concat_address+', '+response.data.data.sub_district.postal_code
                });
            }
        },
        // For select supplier
        supplierSelected(d){
            this.form.supplier_id = ""
            this.supplier = null
            this.form.term_payment_pur_id = ""
            this.term_payment_pur = null
            if(d) {
                this.supplier = d
                this.form.supplier_id = d.id
                this.term_payment_pur = d.purchase_term
                this.form.term_payment_pur_id = d.purchase_term.id
            }
        }
    },
    watch : {
        'data': { 
            handler: function (val) {
                if(val.modal == true){
                    this.error = {}
                    let self = this
                    setTimeout(function(){
                        self.warehouseSelected(val.warehouse)
                    }, 100);
                    this.items = []
                    val.data.forEach((e,i) => {
                        e.qty = e.sum_po_qty
                        this.items.push(JSON.parse(JSON.stringify(e)))
                    });
                }
            },
            deep: true
        },
    }
}
</script>