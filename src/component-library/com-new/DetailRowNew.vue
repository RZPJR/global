<template>
<div class="second-color">
    <div v-if="crossURL && align === true">
        <div class="row">
            <div class="col text-black60">{{name}} :</div>
        </div>
        <div class="row" style="margin:-12px">
            <div class="col text-black"><a :href="crossURL" class="routerLink linkReload" target="_blank"><span class="text-secondary">{{value}}</span></a></div>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else-if="align === true">
        <div class="row">
            <div class="col text-black60">{{name}} :</div>
        </div>
        <div class="row" style="margin:-12px">
            <div class="col text-black">{{value}}</div>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else-if="routePath">
        <div class="row">
            <div class="col"><span class="text-black60">{{name}}</span> :</div>
            <a :href="$router.resolve({path: routePath}).href" class="routerLink linkReload">{{value}}</a>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else-if="crossURL">
        <div class="row">
            <div class="col"><span class="text-black60">{{name}}</span> :</div>
            <a :href="crossURL" class="routerLink linkReload" target="_blank"><span class="text-secondary">{{value}}</span></a>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else-if="left==true">
        <div class="row">
            <div class="col"><span class="text-black60">{{name}}</span> : <span class="ml-3 text-black">{{value}}</span></div>
        </div>
        <v-divider class="my-3"/>
    </div>
    <div v-else>
        <div class="row">
            <div class="col-5 text-black60">{{name}} :</div>
            <div class="col d-flex justify-end text-black">{{value}}</div>
        </div>
        <v-divider class="my-3"/>
    </div>
</div>
</template>
<script>
export default {
    name : "DetailRowNew",
    props : {
        name : "",
        value : "",
        align : true,
        routePath : "",
        crossURL : "",
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