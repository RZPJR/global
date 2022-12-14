<template>
  <v-autocomplete
    v-model="archetypes"
    :items="items"
    :loading="isLoading"
    item-text="name"
    :search-input.sync="search"
    :placeholder="placeholder"
    @change="selected"
    :disabled="disabled"
    return-object
    :dense="dense"
    :class="dense ? '' : 'rounded-form'"
    clearable
    outlined
    :error-messages="error"
  >
    <template slot="selection" slot-scope="data">
      <div class="select-item">{{ data.item.code }} - {{ data.item.name }}</div>
    </template>
    <template slot="item" slot-scope="data">
      {{ data.item.code }} - {{ data.item.name }}
    </template>
    <template v-slot:label>
      <div v-if="label">
        <span v-if="!norequired"
          >{{ label }}<span :class="disabled ? '' : 'text-red'">*</span></span
        >
        <span v-else>{{ label }}</span>
      </div>
      <div v-else>
        <span v-if="!norequired"
          >Archetype<span :class="disabled ? '' : 'text-red'">*</span></span
        >
        <span v-else>Archetype</span>
      </div>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  name: "SelectArchetype",
  data() {
    return {
      items: [],
      isLoading: false,
      search: "",
      placeholder: "",
      archetypes: null,
    };
  },
  props: [
    "archetype",
    "disabled",
    "clear",
    "error",
    "label",
    "business_type_id",
    "aux_data",
    "norequired",
    "customer_group",
    "dense",
  ],
  methods: {
    remoteSearch(search) {
      // let business_type_id = ''
      // if(this.business_type_id){
      //     business_type_id = "|business_type_id.e:" + this.business_type_id
      // }
      // let aux_data = '';
      // if(this.aux_data) {
      //     aux_data = '|aux_data.in:'+this.aux_data;
      // }
      // let cg = ''
      // if (this.customer_group){
      //     cg = '|customer_group:'+this.customer_group;
      // }else{
      //     cg = '';
      // }
      // if (this.archetype){
      //     this.autoSelectByID(this.archetype)
      // }
      // this.placeholder="Loading items..."
      // this.isLoading = true
      // // ini ke endpoint get all
      // this.$http.get("/customer/archetype/filter?embeds=business_type_id",{params:{
      //     perpage:20,
      //     conditions:'status:1|name.icontains:'+search+business_type_id+aux_data+cg,
      // }}).then(response => {
      //     this.items = response.data.data
      //     if(this.items === null){
      //         this.items = []
      //     }
      //     this.isLoading = false
      //     let label = 'Archetype'
      //     if (this.label)
      //     label = this.label
      //     this.placeholder = "Select "+ label
      // });
    },
    autoSelectByID(val) {
      if (val) {
        this.$http
          .get("/customer/archetype/filter?embeds=business_type_id", {
            params: {
              conditions: "id.e:" + val.id,
            },
          })
          .then((response) => {
            this.items.push(response.data.data[0]);
            this.archetypes = response.data.data[0];
          });
      }
    },
    selected(event) {
      this.$emit("selected", event);
    },
  },
  created() {
    // this.remoteSearch('');
  },
  watch: {
    search: {
      handler: function (val) {
        if (val) {
          this.remoteSearch(val);
        } else if (!this.archetype) {
          this.remoteSearch("");
        }
      },
      deep: true,
    },
    clear: {
      handler: function (val) {
        this.archetypes = null;
        this.remoteSearch("");
      },
      deep: true,
    },
    archetype: {
      handler: function (val) {
        if (val) {
          // ini untuk auto select
          this.autoSelectByID(val);
        }
      },
      deep: true,
    },
    business_type_id: {
      // ini fungsi untuk request by area_id
      handler: function (val) {
        if (val) {
          // ini untuk auto select
          this.remoteSearch("");
        } else {
          this.archetypes = null;
        }
      },
      deep: true,
    },
    aux_data: {
      handler: function (val) {
        if (val !== null) {
          this.remoteSearch("");
        }
      },
      deep: true,
    },
  },
};
</script>
