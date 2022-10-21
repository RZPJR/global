<template>
<div class="second-color">
    <div v-if="align== true">
        <div class="row">
            <div class="col mt-1">{{name}} :</div>
        </div>
        <div class="row" style="margin:-12px">
            <div class="col">{{value}}</div>
        </div>
        <v-divider class="my-5"/>
    </div>
    <div v-else-if="routePath">
        <div class="row">
            <div class="col mt-1">{{name}} :</div>
            <!-- <router-link :to="{ path: routePath }" class="routerLink">
                <div class="col mt-1 d-flex justify-end">{{value}}</div>
            </router-link> -->
            <a :href="$router.resolve({path: routePath}).href" class="routerLink linkReload">{{value}}</a>
        </div>
        <v-divider class="my-5"/>
    </div>
    <div v-else-if="left==true">
        <div class="row">
            <div class="col mt-1">{{name}} : <span class="ml-3">{{value}}</span></div>
        </div>
        <v-divider class="my-5"/>
    </div>
    <div v-else>
        <div class="row">
            <div class="col mt-1">{{name}} :</div>
            <div class="col mt-1 d-flex justify-end">{{value}}</div>
        </div>
        <v-divider class="my-5"/>
    </div>
</div>
</template>
<script>
export default {
    name : "DetailRow",
    props : {
        name : "",
        value : "",
        align : true,
        routePath : "",
        left : true,
    }
}
</script>
<style scoped>
    .linkReload{
        margin-top:15px;
        margin-right:15px
    }
</style>