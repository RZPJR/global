<template>
    <v-snackbar
        v-model="snackbar"
        v-if="data.collapseKey == 'pushprod'"
        :vertical="true"
        timeout="60000"
        :right="true"
        class="OpenSans"
    >
        <v-row>
            <v-col cols="12" md="1">
                <v-icon
                    color="white"
                >
                    mdi-information
                </v-icon>
            </v-col>
            <v-col>
                <div class="bold wp100">
                    {{data.data.title}} ({{data.data.body}})
                </div>
                <div class="mt8">
                    Click <b>Refresh</b> to update the Dashboard 
                </div>
            </v-col>
        </v-row>
        <div class="mt24">
            <v-btn
                depressed
                outlined
                color="#FFFFFF"
                class="only-btn w176"
                @click="snackbar = false"
            >
                Close
            </v-btn>
            <v-btn
                depressed
                color="#50ABA3"
                class="only-btn w176 ml6 white--text"
                @click="refresh()"
            >
                Refresh
            </v-btn>
        </div>
    </v-snackbar>
</template>
<script>
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
export default {
    name : 'FirebaseNotif',
    data() {
        return {
            messaging : '',
            currentToken : '',
            snackbar : true,
            data : ''
        }
    },
    props: [''],
    methods : {
        refresh() {
            location.reload(true);
        },
        initApp() {
            const firebaseApp = initializeApp({
                apiKey: "AIzaSyD-VxF-r_h94QYU5-pJb3LmVSf4UhjVUsI",
                authDomain: "edenfarm-dashboard.firebaseapp.com",
                projectId: "edenfarm-dashboard",
                storageBucket: "edenfarm-dashboard.appspot.com",
                messagingSenderId: "512185015125",
                appId: "1:512185015125:web:d7c020977a8056c9dfaddc",
                measurementId: "G-JJW2CLW3PM"
            });
            this.messaging = getMessaging(firebaseApp);
            this.getTkn()
        },
        getTkn() {
            getToken(this.messaging, { vapidKey: 'BN3B0uNrki18eWQh4dqbnjoq2JBdum2A8oDPuWZVTROXkr4ixlF93T_Cykdl6Pedxy6DR5pNYTlXOSbnitC1geQ' }).then((currentToken) => {
                if (currentToken) {
                    // Send the token to your server and update the UI if necessary
                    // ...
                    this.currentToken = currentToken
                    localStorage.setItem('token_firebase',this.currentToken)
                    // console.log(this.currentToken)
                } else {
                    // Show permission request UI
                    console.log('No registration token available. Request permission to generate one.');
                    // ...
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                // ...
            });
        }
    },
    created() {
        this.initApp()
    },
    mounted(){
        let self = this
        onMessage(this.messaging, (payload) => {
            self.data = payload
            self.snackbar = true
        });
    }
}
</script>