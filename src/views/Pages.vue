<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Sayfalar</strong>
            <div class="card-header-actions">
              <small v-text="mode==='new'? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="12">
                <CInput
                    v-model="formData.name"
                    label="Sayfa Adı"
                    placeholder="Sayfa Adı"
                />
              </CCol>

              <CCol sm="12">
                <vue-editor v-model="formData.content"/>
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
              Sayfalar
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
                :hover="true"
                :striped="true"
                :items="pages"
                :fields="[
                  {
                    key:'id',
                    label:'ID'
                  },{
                    key:'name',
                    label:'Sayfa Adı'
                  },{
                    key:'content',
                    label:'İçerik'
                  }
                  ,{
                    key:'actions',
                    label:'Aksiyonlar'
                  },]"
                :items-per-page="10"
                pagination
            >
              <template #content="{item}">
                <td>
                  <div v-html="item.content" class="page-content-one-line"></div>
                </td>
              </template>
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
import { VueEditor } from "vue2-editor";

export default {
  name: 'Pages',
  components: {VueEditor},
  data() {
    return {
      mode: 'new',
      pages: [],
      id: null,
      formData: {
        name: "",
        content: "",
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
        content: "",
      }
      this.id = null;
    },
    update: function (id) {
      this.$axios.put(`/pages/${id}`, this.formData).then(() => {
        this.getPages().then(({data}) => {
          this.pages = data
        })
        this.clean()
      }).catch(err => {
        console.log(err)
      })
    },
    create: function () {
      this.$axios.post('/pages', this.formData).then(() => {
        this.getPages().then(({data}) => {
          this.pages = data
        })
        this.clean()
      }).catch(err => {
        console.log(err)
      })
    },
    remove: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios.delete(`/pages/${id}`).then(() => {
          this.getPages().then(({data}) => {
            this.pages = data
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getPages: function () {
      return this.$axios.get('/pages').then(res => {
        return res
      })
    },
  },
  mounted() {
    this.getPages().then(({data}) => {
      this.pages = data
    })
  }
}
</script>
<style>
.page-content-one-line {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>