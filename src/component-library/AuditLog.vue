<template>
    <v-dialog
        v-model="data.model"
        persistent
        max-width="900px"
    > 
        <v-overlay :value="overlay" :z-index="12" >
            <v-progress-circular
                indeterminate
                size="84"
                color="green"
                width=15
            ></v-progress-circular>
        </v-overlay>
        <div class="pa-8" style="background:white;border-radius: 15px;">
            <div class="title-page">
                See History
            </div>
            <div class="title-table mt-6">
                <label class="label-title">
                History
                </label>
            </div>
            <v-data-table
                :headers="fields"
                :items="datas"
                :items-per-page="10"
                :mobile-breakpoint="0"
            >
                <template v-slot:item="item">
                    <tr>
                        <td>{{ item.item.function }}</td>
                        <td>{{ item.item.timestamp | moment("DD/MM/YYYY HH:mm:ss") }}</td>
                        <td>
                            <div v-if="item.item.staff">
                                {{ item.item.staff.display_name}} ({{ item.item.staff.user.email}})
                            </div>
                            <div v-else>
                                -
                            </div>
                        </td>
                        <td>
                            <div v-if="item.item.staff">
                                {{ item.item.staff.role.name}} ({{ item.item.staff.role.division.name}})
                            </div>
                            <div v-else>
                                -
                            </div>
                        </td>
                        <td>{{ item.item.note }}</td>
                    </tr>
                </template>
            </v-data-table>

            <div class="row mx-3 mb-1">
                <v-btn 
                    rounded 
                    elevation="0" 
                    class="no-caps px-7" 
                    @click="data.model = false"
                    style="background: #E6E9ED; color:#768F9C;height:45px"
                >Back</v-btn>
            </div>
        </div>
    </v-dialog>
</template>

<script>
    export default {
        name: 'AuditLog',
        data() {
            return {
                overlay : false,
                fields: [
                    {
                        text:'Action',
                        sortable: false,
                    },

                    {
                        text:'Timestamp',
                        sortable: false,
                    },
                    {
                        text:'User',
                        sortable: false,
                    },
                    {
                        text:'Role (Division)',
                        sortable: false,
                    },
                    {
                        text:'Note',
                        sortable: false,
                    },
                ],
                datas:[{
                    staff : {
                        display_name : "",
                        user : {
                            email : "",
                        },
                        role: {
                            name: "",
                            division: {
                                name: "",
                            }
                        }
                    }
                    
                }]
            }
        },
        props: {
            data : {
                model : "",
                id: "",
                type: ""
            }
        },
        methods:{
            render(id,type){
                this.overlay = true
                this.$http.get("/audit_log",{params:{
                            perpage:10000,
                            embeds:'staff_id__role_id,staff_id__role_id__division_id,merchant_id,staff_id__user_id',
                            conditions:'ref_id.e:'+id +'|type:'+ type,
                            orderby:'-id',
                        }}).then(response => {
                    this.overlay = false;
                    this.datas = response.data.data
                        if(this.datas === null){
                            this.datas = []
                        }
                });
            },
        },
        watch: {
            data: {
                handler: function (val) {
                    this.render(val.id, val.type)
                },
                deep: true
            },
        }
    };
</script>