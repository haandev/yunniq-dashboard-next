<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Ürün</strong>
            <div class="card-header-actions">
              <small v-text="modeProduct === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="10">
                <CRow>
                  <CCol sm="12">
                    <CSelect
                        :value.sync="formData.categoryId"
                        label="Kategorisi"
                        placeholder="Kategorisi"
                        :options="categories.map(p => ({
                          value: p.id,
                          label: p.title
                        }))"
                    />
                  </CCol>
                  <CCol sm="8">
                    <CInput
                      :value.sync="formData.title"
                      label="Ürün Adı"
                      placeholder="Ürün Adı"
                    />
                  </CCol>
                  <CCol sm="4">
                    <CInput
                        :value.sync="formData.price"
                        label="Fiyatı"
                        placeholder="Fiyatı"
                    />
                  </CCol>
                  <CCol sm="12">
                    <CInput
                        :value.sync="formData.description"
                        label="Açıklaması"
                        placeholder="Açıklaması"
                    />
                  </CCol>

                </CRow>
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                  v-if="modeProduct !== 'new'"
                  @click="updateProduct(id)"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  v-else
                  @click="createProduct()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Yeni Ekle</CButton
                >
                <CButton
                  @click="cleanProduct()"
                  size="sm"
                  variant="outline"
                  color="primary"
                  class="mr-1"
                  >Temizle</CButton
                >
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Ürünler</strong>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="companyProducts"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'categoryStr',
                  label: 'Kategorisi',
                },
                {
                  key: 'title',
                  label: 'Ürün Adı',
                },
                {
                  key: 'price',
                  label: 'Fiyat',
                },
                {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
              :items-per-page="10"
              pagination
            >
              <template #actions="{ item }">
                <td>
                  <CButton
                    @click="editProduct(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Düzenle</CButton
                  >
                  <CButton
                    @click="removeProduct(item.id)"
                    size="sm"
                    variant="outline"
                    color="danger"
                    >Sil</CButton
                  >
                </td>
              </template>
              <template #categoryStr="{ item }">
                {{ item.category.title }}
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>
<style>
</style>
<script>

export default {
  name: "Products",
  components: {  },
  data() {
    return {
      categories:[],
      mode: "new",
      modeProduct: "new",
      id: null,
      uploaded: "https://via.placeholder.com/250",
      companyProducts: [],
      formData: {},
    };
  },
  
  methods: {
    editProduct(i) {
      this.modeProduct = "edit";
      this.formData = {...i};
      this.id = i.id;
      delete this.formData.id;
    },
    cleanProduct() {
      this.modeProduct = "new";
      this.formData = {categoryId:this.formData.categoryId };
    },
    updateProduct: function (id) {
      this.$axios
        .put(`/product/${id}`, this.formData)
        .then(() => {
          this.getProducts().then(({ data }) => {
            this.companyProducts = data;
          });
          this.cleanProduct();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createProduct: function () {
      this.$axios
        .post("/product", this.formData)
        .then(() => {
          this.getProducts().then(({ data }) => {
            this.companyProducts = data;
          });
          this.cleanProduct();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeProduct: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios
          .delete(`/product/${id}`)
          .then(() => {
            this.getProducts().then(({ data }) => {
              this.companyProducts = data;
            });
            this.cleanProduct();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getProducts: function () {
      return this.$axios.get(`/product`).then((res) => {
        return res;
      });
    },
    getCategories: function () {
      return this.$axios.get(`/category`).then((res) => {
        return res;
      });
    },
  },
  mounted() {
    this.getProducts().then(({ data }) => {
      this.companyProducts = data;
    });
    this.getCategories().then(({ data }) => {
      this.categories = data;
    });
  },
};
</script>
