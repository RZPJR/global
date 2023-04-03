<template>
  <div>
    <div>
      <v-autocomplete
        v-model="archeTypes"
        :items="items"
        :loading="isLoading"
        :placeholder="placeholder"
        :item-text="textList"
        :search-input.sync="search"
        @change="selected"
        :disabled="disabled"
        return-object
        clearable
        outlined
        chips
        multiple
        deletable-chips
        class="multi"
        dense
        :error-messages="error"
      >
        <template v-slot:label>
          <span v-if="!norequired"
            >Multiselect Archetype<span style="color: red">*</span></span
          >
          <span v-else>Multiselect Archetype</span>
        </template>
        <template slot="selection" slot-scope="data">
          <v-chip close @click:close="remove(data)">
            {{ data.item.code }} - {{ data.item.description }} - {{ data.item.customer_type.description }} 
          </v-chip>
        </template>
        <template slot="item" slot-scope="data">
          {{ data.item.code }} - {{ data.item.description }} - {{ data.item.customer_type.description }} 
        </template>
      </v-autocomplete>
    </div>
    <div class="w180 -mt25">
      <v-checkbox
        :disabled="disabled"
        label="Select All Archetype"
        v-model="selectedAll"
        @click="selectAll(selectedAll)"
      ></v-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  name: "MultiSelectArcheTypeCheckbox",
  data() {
    return {
      items: [],
      placeholder: "",
      selectedAll: false,
      isLoading: false,
      archeTypes: [],
      search: "",
    };
  },
  props: [
    "archeType",
    "disabled",
    "clear",
    "label",
    "error",
    "aux_data",
    "norequired",
    "attribute",
    "dense",
  ],
  methods: {
    remoteSearch(search, aux_data) {
      // render data
      if (aux_data !== '' && aux_data !== undefined){
          aux_data = '|aux_data.in:'+aux_data;
      }else{
          aux_data = '';
      }
      this.placeholder="Loading items..."
      this.isLoading = true
      // ini ke endpoint get all
      this.$http.get("/crm/v1/archetype",{params:{
          per_page: 10,
          status: 1,
          search: search
      }}).then(response => {
          if (response.data.data) {
              this.items = response.data.data
          } else {
              this.items = []
          }
          if(this.items === null){
              this.items = []
          }
          this.isLoading = false
          let label = 'Archetype'
          if (this.label)
          label = this.label
          this.placeholder = "Select "+ label
      });
    },
    autoSelectByID(val) {
      //autofill when update
      if (val) {
        this.archeTypes = [];
        for (let i = 0; i < val.length; i++) {
          this.archeTypes.push(val[i]);
        }
      }
    },
    textList(item){
      return item.code + ' - ' + item.description
    },
    selected(event) {
      // select 1 item
      this.$emit("selected", event);
    },
    remove(item) {
      // delete 1 selected item
      this.archeTypes.splice(item.index, 1);
      this.$emit("selected", this.archeTypes);
    },
    selectAll(d) {
      // checkbox untuk select all archetype
      if (d == true) {
        this.archeTypes = this.items;
        this.$emit("selected", this.items);
      } else {
        this.archeTypes = [];
        this.$emit("selected", this.archeTypes);
      }
    },
  },
  watch: {
    search: {
      // untuk search
      handler: function (val) {
        this.remoteSearch(val, this.aux_data);
      },
      deep: true,
    },
    clear: {
      // clear semua selected
      handler: function (val) {
        this.archeTypes = null;
        this.remoteSearch("", this.aux_data);
      },
      deep: true,
    },
    archeType: {
      // ini untuk auto select
      handler: function (val) {
        if (val !== null) {
          this.autoSelectByID(val);
        }
      },
      deep: true,
    },
    aux_data: {
      // props aux data
      handler: function (val) {
        if (val !== null) {
          this.remoteSearch(this.search, val);
        }
      },
      deep: true,
    },
    archeTypes: {
      // hapus search and auto select all
      handler: function (val) {
        if (val.length == this.items.length) {
          this.selectedAll = true;
        } else {
          this.selectedAll = false;
        }
        this.search = "";
      },
      deep: true,
    },
  },
};
</script>
