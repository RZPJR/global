<template>
    <v-dialog
        v-model="model"
        persistent
        max-width="556px"
    >
        <v-card class="OpenSans">
            <v-card-text class="pa-6">
                <v-row>
                    <v-col cols="12" md="6">
                        <img src="/img/notif-revamp.png" alt="revamp">
                    </v-col>
                    <v-col cols="12" md="6">
                        <div class="bold text-black">
                            Announcement
                        </div>
                        <div class="mt16 text-black60">
                            We are currently updating the interface on this module. 
                        </div>
                        <div class="mt16 text-black60">
                            Thank you!
                        </div>
                        <div class="mt16">
                            <v-btn
                                class="main-btn white--text"
                                depressed
                                color="#50ABA3"
                                @click="setLocal()"
                            >Got it</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name : 'NotifRevamp',
    data() {
        return {
            model : true
        }
    },
    props: ['page'],
    methods : {
        setLocal() {
            let arr = []
            let check = localStorage.getItem('NotifRevamp')
            if (check == null) {
                arr = [this.page]
            } else {
                arr = JSON.parse(check)
                arr.push(this.page)
            }
            localStorage.setItem("NotifRevamp", JSON.stringify(arr));
            this.model = false
        },
        getLocal() {
            let check = localStorage.getItem('NotifRevamp')
            let arr = JSON.parse(check)
            if (arr != null ) {
                arr.forEach(e => {
                    if (e == this.page) {
                        this.model = false
                    }
                });
            }
        }
    },
    created(){
        this.getLocal()
    }
}
</script>