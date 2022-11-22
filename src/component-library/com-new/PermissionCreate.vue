<template>
    <v-card-text>
        <v-treeview
            v-model="selection"
            name="permission_crt"
            :items="items"
            :selection-type="selectionType"
            selectable
            item-value="selection"
            return-object
            selected-color="#50ABA3"
            open-on-click
            open-all
            @input="checked"
          ></v-treeview>
    </v-card-text>
</template>
<script>
    export default {
        name: 'PermissionCreate',
        data() {
            return {
                items: [],
                selectionType: 'leaf',
                allParentNodes:true,
                selection: [],
            };
        },
        props: ['idPermission','disabled','clear'],
        methods: {
            checked() {
                this.$emit('checked', this._selection);
            }
        },
        mounted() {
            this.$http.get('/permission/tree',)
            .then(response => {
                let that = this
                response.data.data.forEach((value, index) => {
                    if (value.child || value.child == null) {
                        let parent = {id:value.id, name:value.name,children:[]} // Mengambil Parent
                        that.items.push(parent)
                        if (value.child) { // handle jika child = null child yang terisi akan tetap muncul
                            value.child.forEach((child, idx) => {
                                let children = {id:child.id, name:child.name,children:[]} // Mengambil children
                                that.items[index].children.push(children)
                                if (child.grand_child) { // handle jika grand_child = null, tetap akan muncul
                                    child.grand_child.forEach((gc, i) => {
                                        let grand_children = {id:gc.id, name:gc.name}  // Mengambil grand children
                                        that.items[index].children[idx].children.push(grand_children)
                                    })
                                }
                            })
                        }
                    }
                })
                if(this.idPermission.length > 0){
                    this.idPermission.forEach((gc, i) => {
                       this.selection.push({id:gc})
                    });
                }
            })
            .catch(e => {
                this.error = e.errors
            });
        },
        computed : {
            _items () {
                const replaceChildren = (obj,parent) => {
                    const clone = Object.assign({},obj)
                    delete clone.children
                    if (parent) clone.parent = parent
                    return clone
                }
                const addItems = (arr,parent) => {
                    const items = arr.reduce((acc,x)=>{
                        acc.push(replaceChildren(x,parent))
                        if (x.children) {
                            acc.push(addItems(x.children, x.id))
                        }
                        return acc
                    },[])
                    return items.flat()
                }
                return addItems(this.items).reduce((acc,x)=>{
                    acc[x.id]=x
                    return acc
                },{})
            },
            _selection () { 
                const proxy = {}
                    const addParents = (x, all) => {
                    const parentId = this._items[x.id].parent
                    const grandParentId = this._items[this._items[x.id].parent].parent
                    if (parentId) {
                        if (all) addParents(this._items[parentId])
                            proxy[parentId] = this._items[parentId]
                        }
                        if (grandParentId) {
                            if (all) addParents(this._items[grandParentId])
                                proxy[grandParentId] = this._items[grandParentId]
                        }
                }
                this.selection.forEach(x=>{
                    addParents(x,this.allParentNodes)
                    proxy[x.id] = x
                })
                return Object.values(proxy)
            }
        }, 
        watch: {
            search: {
                handler: function (val) {
                    if(val && val.length > 1){
                        this.isLoading = true
                        this.remoteSearch(val)
                    }
                },
                deep: true
            },
        },
    };
</script>