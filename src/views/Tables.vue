<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Masa</strong>
            <div class="card-header-actions">
              <small v-text="modeTable === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="10">
                <CRow>
                  <CCol sm="12">
                    <CInput
                      :value.sync="formData.tableName"
                      label="Masa Adı"
                      placeholder="Masa Adı"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <hr />
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                  v-if="modeTable !== 'new'"
                  @click="updateTable(id)"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Kaydet</CButton
                >
                <CButton
                  v-else
                  @click="createTable()"
                  size="sm"
                  color="primary"
                  class="mr-1"
                  >Yeni Ekle</CButton
                >
                <CButton
                  @click="cleanTable()"
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
            <strong>Masalar</strong>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
              :hover="true"
              :striped="true"
              :items="companyTables"
              :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'tableName',
                  label: 'Masa Adı',
                },
                {
                  key: 'qrCode',
                  label: 'QR Kodu',
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
                    @click="editTable(item)"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                    >Düzenle</CButton
                  >
                  <CButton
                    @click="removeTable(item.id)"
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
  name: "Tables",
  components: {  },
  data() {
    return {
      mode: "new",
      modeTable: "new",
      id: null,
      uploaded: "https://via.placeholder.com/250",
      companyTables: [],
      formData: {},
    };
  },
  
  methods: {
    editTable(i) {
      this.modeTable = "edit";
      this.formData = {...i};
      this.id = i.id;
      delete this.formData.id;
    },
    cleanTable() {
      this.modeTable = "new";
      this.formData = { };
    },
    updateTable: function (id) {
      this.$axios
        .put(`/table/${id}`, this.formData)
        .then(() => {
          this.getTables().then(({ data }) => {
            this.companyTables = data;
          });
          this.cleanTable();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createTable: function () {
      this.$axios
        .post("/table", this.formData)
        .then(() => {
          this.getTables().then(({ data }) => {
            this.companyTables = data;
          });
          this.cleanTable();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeTable: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios
          .delete(`/table/${id}`)
          .then(() => {
            this.getTables().then(({ data }) => {
              this.companyTables = data;
            });
            this.cleanTable();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    getTables: function () {
      return this.$axios.get(`/table`).then((res) => {
        return res;
      });
    },
  },
  mounted() {
    this.getTables().then(({ data }) => {
      this.companyTables = data;
    });
  },
};
</script>
