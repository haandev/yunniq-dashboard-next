<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Ürün</strong>
            <div class="card-header-actions">
              <small v-text="modeProductLocale === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="10">
                <CRow>
                  <CCol sm="12">
                    <CSelect
                        :value.sync="formData.locale"
                        label="Dili"
                        placeholder="Dili"
                        :options="['en','ar']"
                    />
                  </CCol>
                  <CCol sm="8">
                    <CInput
                      :value.sync="formData.title"
                      label="Ürün Adı"
                      placeholder="Ürün Adı"
                    />
                  </CCol>
                  <CCol sm="12">
                    <CTextarea
                        :value.sync="formData.description"
                        label="Açıklaması"
                        placeholder="Açıklaması"
                        rows="10"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                  v-if="modeProductLocale !== 'new'"
                  @click="updateProductLocale(id)"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  v-else
                  @click="createProductLocale()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Yeni Ekle</CButton
                >
                <CButton
                  @click="cleanProductLocale()"
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
              :items="companyProductLocales"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'locale',
                  label: 'Dil',
                },
                {
                  key: 'title',
                  label: 'Ürün Adı',
                },
                {
                  key: 'description',
                  label: 'Açıklama',
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
                    @click="editProductLocale(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Düzenle</CButton
                  >
                  <CButton
                    @click="removeProductLocale(item.id)"
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
  name: "ProductLocales",
  components: {  },
  data() {
    return {
      categories:[],
      mode: "new",
      modeProductLocale: "new",
      id: null,
      uploaded: "https://via.placeholder.com/250",
      companyProductLocales: [],
      formData: {},
    };
  },
  
  methods: {
    editProductLocale(i) {
      this.modeProductLocale = "edit";
      this.formData = {...i};
      this.id = i.id;
      delete this.formData.id;
    },
    cleanProductLocale() {
      this.modeProductLocale = "new";
      this.formData = { };
    },
    updateProductLocale: function (id) {
      this.$axios
        .put(`/product-locale/${id}`,{...this.formData, productId : this.$route.params.id})
        .then(() => {
          this.getProductLocales({productId:this.$route.params.id}).then(({ data }) => {
            this.companyProductLocales = data;
          });
          this.cleanProductLocale();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createProductLocale: function () {
      this.$axios
        .post("/product-locale", {...this.formData, productId : this.$route.params.id})
        .then(() => {
          this.getProductLocales({productId:this.$route.params.id}).then(({ data }) => {
            this.companyProductLocales = data;
          });
          this.cleanProductLocale();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeProductLocale: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios
          .delete(`/product-locale/${id}`)
          .then(() => {
            this.getProductLocales({productId:this.$route.params.id}).then(({ data }) => {
              this.companyProductLocales = data;
            });
            this.cleanProductLocale();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getProductLocales: function (params) {
      return this.$axios.get(`/product-locale/product/${params.productId}`).then((res) => {
        return res;
      });
    },

  },
  mounted() {
    console.log("product id" , this.$route.params.id)
    console.log("product id")
    this.getProductLocales({productId:this.$route.params.id}).then(({ data }) => {
      this.companyProductLocales = data;
    });
  },
};
</script>
