<template>
  <div>
    <CRow>
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>KAP Bildirimleri </strong>
            <div class="card-header-actions">
              <small v-text="mode==='new'? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="6">
                <CInput
                    :value.sync="formData.title"
                    label="Başlık"
                    placeholder="Başlık"
                />
              </CCol>

              <CCol sm="6">
                <CInput
                    :value.sync="formData.subtitle"
                    label="Al Başlık"
                    placeholder="Alt Başlık"
                />
              </CCol>

              <CCol sm="6">
                <CSelect
                    :value.sync="formData.newsTypeId"

                    label="KAP Bildirim Tipi"
                    :options="newsTypes.map(p => ({
                          value: p.id,
                          label: p.name
                        }))"
                />
              </CCol>

              <CCol sm="6">
                <CSelect
                    :value.sync="formData.provinceId"

                    label="İl"
                    :options="provinces.map(p => ({
                          value: p.id,
                          label: p.name
                        }))"
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
              KAP Bildirimleri
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
              :columnFilter="true"
                :hover="true"
                :striped="true"
                :items="news"
                :fields="[
                  {
                    key:'id',
                    label:'ID'
                  },{
                    key:'title',
                    label:'Başlık'
                  },{
                    key:'subtitle',
                    label:'Alt Başlık'
                  },
                  {
                    key:'province',
                    label:'İl'
                  },
                  {
                    key:'newsType',
                    label:'KAP Bildirim Tipi'
                  },
                  {
                    key:'content',
                    label:'İçerik'
                  },
                  {
                    key:'actions',
                    label:'Aksiyonlar'
                  }
]"
                :items-per-page="10"
                pagination
            >
              <template #id="{item}">
                <td>
                  {{ item.id }}
                </td>
              </template>
              <template #title="{item}">
                <td>
                  {{ item.title }}
                </td>
              </template>
              <template #subtitle="{item}">
                <td>
                  {{ item.subtitle }}
                </td>
              </template>
              <template #province="{item}">
                <td>
                  {{
                    provinces.find((p) => p.id === item.provinceId).name
                  }}
                </td>
              </template>
              <template #newsType="{item}">
                <td>
                  {{
                    newsTypes.find((p) => p.id === item.newsTypeId).name
                  }}
                </td>
              </template>
              <template #content="{item}">
                <div v-html="item.content" class="page-content-one-line">

                </div>
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
import {VueEditor} from "vue2-editor";

export default {
  name: 'News',
  components: {VueEditor},
  data() {
    return {
      mode: 'new',
      news: [],
      newsTypes: [{ id: 0, name: "" }],
      provinces: [{ id: 0, name: "" }],
      id: null,
      formData: {
        title: '',
        subtitle: '',
        content: '',
        newsTypeId: '',
        provinceId: ''
      }
    }
  },
  methods: {
    edit(i) {
      this.mode = 'edit'
      this.formData = {...i}
      this.formData.password = ""
      this.id = i.id
      delete this.formData.id
    },
    clean() {
      this.mode = 'new'
      this.formData = {
        title: '',
        subtitle: '',
        content: '',
        newsTypeId: ''
      }
      this.id = null;
    },
    update: function (id) {
      this.formData.password === "" && delete this.formData.password
      this.$axios.put(`/news/${id}`, this.formData).then(() => {
        this.getNews().then(({data}) => {
          this.news = data
        })
        this.clean()
      }).catch(err => {
        console.log(err)
      })
    },
    create: function () {
      this.$axios.post('/news', this.formData).then(() => {
        this.getNews().then(({data}) => {
          this.news = data
          console.log(data)
        })
        this.clean()
      }).catch(err => {
        console.log(err)
      })
    },
    remove: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios.delete(`/news/${id}`).then(() => {
          this.getNews().then(({data}) => {
            this.news = data
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    getNews: function () {
      return this.$axios.get('/news').then(res => {
        return res
      })
    },
    getNewsTypes: function () {
      return this.$axios.get('/newsTypes').then(res => {
        return res
      })
    },
    getProvinces: function () {
      return this.$axios.get('/provinces').then(res => {
        return res
      })
    }
  },
  mounted() {
    this.getNews().then(({data}) => {
      this.news = data
    });
    this.getNewsTypes().then(({data}) => {
      this.newsTypes = [{
        id: '',
        name: 'KAP Bildirim Tipi Seçilmedi'
      }, ...data];
    })
    this.getProvinces().then(({data}) => {
      this.provinces = [{
        id: '',
        name: 'İl Seçilmedi'
      }, ...data];
    })
  }
}
</script>
