<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>KAP Bildirim Tipleri</strong>
            <div class="card-header-actions">
              <small v-text="mode==='new'? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <CInput
                    v-model="formData.name"
                    label="KAP Bildirim Adı"
                    placeholder="KAP Bildirim Adı"
                />
              </CCol>

            </CRow>

            <hr>
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton v-if="mode!=='new'" @click="update(id)" size="sm" color="primary" class="mr-1">Kaydet</CButton>
                <CButton v-else @click="create()" size="sm" color="primary" class="mr-1">Yeni Ekle</CButton>
                <CButton @click="clean()" size="sm" variant="outline" color="primary" class="mr-1">Temizle</CButton>
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
            <slot name="header">
              <CIcon name="cil-grid"/>
              KAP Bildirim Tipleri
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
                :hover="true"
                :striped="true"
                :items="newsTypes"
                :fields="[
                  {
                    key:'id',
                    label:'ID'
                  },{
                    key:'name',
                    label:'KAP Bildirim Adı'
                  },{
                    key:'actions',
                    label:'Aksiyonlar'
                  },]"
                :items-per-page="10"
                pagination
            >
              <template #actions="{item}">
                <td>
                  <CButton @click="edit(item)" size="sm" variant="outline" color="primary" class="mr-1">Düzenle
                  </CButton>
                  <CButton @click="remove(item.id)" size="sm" variant="outline" color="danger">Sil</CButton>
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>

    </CRow>


  </div>
</template>

<script>

export default {
  name: 'NewsType',
  components: {},
  data() {
    return {
      mode: 'new',
      newsTypes: [],
      id: null,
      formData: {
        name: "",
      }
    }
  },
  methods: {
    edit(i) {
      this.mode = 'edit'
      this.formData = {...i}
      this.id = i.id
      delete this.formData.id
    },
    clean() {
      this.mode = 'new'
      this.formData = {
        name: "",
      }
      this.id = null;
    },
    update: function (id) {
      this.$axios.put(`/newsTypes/${id}`, this.formData).then(() => {
        this.getNewsTypes().then(({data}) => {
          this.newsTypes = data
        })
        this.clean()
      }).catch(err => {
        console.log(err)
      })
    },
    create: function () {
      this.$axios.post('/newsTypes', this.formData).then(() => {
        this.getNewsTypes().then(({data}) => {
          this.newsTypes = data
        })
        this.clean()
      }).catch(err => {
        console.log(err)
      })
    },
    remove: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios.delete(`/newsTypes/${id}`).then(() => {
          this.getNewsTypes().then(({data}) => {
            this.newsTypes = data
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getNewsTypes: function () {
      return this.$axios.get('/newsTypes').then(res => {
        return res
      })
    },
  },
  mounted() {
    this.getNewsTypes().then(({data}) => {
      this.newsTypes = data
    })
  }
}
</script>
