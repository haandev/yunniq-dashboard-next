<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Kategori</strong>
            <div class="card-header-actions">
              <small v-text="modeCategory === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="10">
                <CRow>
                  <CCol sm="12">
                    <CInput
                      :value.sync="formData.title"
                      label="Kategori Adı"
                      placeholder="Kategori Adı"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                  v-if="modeCategory !== 'new'"
                  @click="updateCategory(id)"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  v-else
                  @click="createCategory()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Yeni Ekle</CButton
                >
                <CButton
                  @click="cleanCategory()"
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
            <strong>Kategoriler</strong>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="companyCategories"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'title',
                  label: 'Kategori Adı',
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
                    @click="editCategory(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Düzenle</CButton
                  >
                  <CButton
                    @click="removeCategory(item.id)"
                    size="sm"
                    variant="outline"
                    color="danger"
                    >Sil</CButton
                  >
                </td>
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
  name: "Categories",
  components: {  },
  data() {
    return {
      mode: "new",
      modeCategory: "new",
      id: null,
      uploaded: "https://via.placeholder.com/250",
      companyCategories: [],
      formData: {},
    };
  },
  
  methods: {
    editCategory(i) {
      this.modeCategory = "edit";
      this.formData = {...i};
      this.id = i.id;
      delete this.formData.id;
    },
    cleanCategory() {
      this.modeCategory = "new";
      this.formData = { };
    },
    updateCategory: function (id) {
      this.$axios
        .put(`/category/${id}`, this.formData)
        .then(() => {
          this.getCategories().then(({ data }) => {
            this.companyCategories = data;
          });
          this.cleanCategory();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createCategory: function () {
      this.$axios
        .post("/category", this.formData)
        .then(() => {
          this.getCategories().then(({ data }) => {
            this.companyCategories = data;
          });
          this.cleanCategory();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeCategory: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios
          .delete(`/category/${id}`)
          .then(() => {
            this.getCategories().then(({ data }) => {
              this.companyCategories = data;
            });
            this.cleanCategory();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getCategories: function () {
      return this.$axios.get(`/category`).then((res) => {
        return res;
      });
    },
  },
  mounted() {
    this.getCategories().then(({ data }) => {
      this.companyCategories = data;
    });
  },
};
</script>
