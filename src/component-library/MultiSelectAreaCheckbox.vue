<template>
  <div>
    <div>
      <v-autocomplete
        v-model="areas"
        :items="items"
        :loading="isLoading"
        :item-text="textList"
        name="area"
        :placeholder="placeholder"
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
            >Multiselect Region<span class="text-red">*</span></span
          >
          <span v-else>Multiselect Region</span>
        </template>
        <template slot="selection" slot-scope="data">
          <v-chip close @click:close="remove(data)">
            {{ data.item.description }} 
          </v-chip>
        </template>
        <template slot="item" slot-scope="data">
          {{ data.item.description }}
        </template>
      </v-autocomplete>
    </div>
    <div class="w160 -mt25">
      <v-checkbox
        :disabled="disabled"
        label="Select All Region"
        v-model="selectedAll"
        @click="selectAll(selectedAll)"
      ></v-checkbox>
    </div>
  </div>
</template>
<script>
export default {
  name: "MultiSelectAreaCheckbox",
  data() {
    return {
      items: [],
      isLoading: false,
      selectedAll: false,
      placeholder: "",
      areas: [],
      search: "",
    };
  },
  props: [
    "area",
    "disabled",
    "clear",
    "label",
    "error",
    "aux_data",
    "norequired",
  ],
  methods: {
    // For show dropdown suggestion search by code or name
    textList(item){
        return item.code + ' — ' + item.description
    },
    remoteSearch(search, aux_data) {
      // get data or render data
      if (aux_data !== '' && aux_data !== undefined){
          aux_data = '|aux_data.in:'+aux_data;
      }else{
          aux_data = '';
      }
      this.placeholder="Loading items..."
      this.isLoading = true
      this.$http.get("/configuration/v1/region",{params:{
          per_page:1000,
          status:1,
          search:search,
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
          let label = 'Region'
          if (this.label)
          label = this.label
          this.placeholder = "Select "+ label
      });
    },
    autoSelectByID(val) {
      // for update fill the field
      if (val) {
        this.areas = [];
        for (let i = 0; i < val.length; i++) {
          this.areas.push(val[i]);
        }
      }
    },
    selected(event) {
      // Select area
      this.$emit("selected", event);
    },
    remove(item) {
      // delete 1 selected item 
      this.areas.splice(item.index, 1);
      this.$emit("selected", this.areas);
    },
    selectAll(d) {
      // checkbox untuk select all area
      if (d == true) {
        this.areas = this.items;
        this.$emit("selected", this.items);
      } else {
        this.areas = [];
        this.$emit("selected", this.areas);
      }
    },
  },
  created() {
    this.remoteSearch("")
  },
  watch: {
    search: {
      // untuk search
      handler: function (val) {
        if (val) {
          if (this.computedCounterValue < this.maxSelected) {
            this.remoteSearch(val);
          }
        } else if (!this.area) {
          this.remoteSearch("", this.aux_data);
        }
      },
      deep: true,
    },
    clear: {
      // clear semua selected
      handler: function (val) {
        this.areas = null;
        this.remoteSearch("", "");
      },
      deep: true,
    },
    area: {
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
    areas: {
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
