<template>
  <div>
    <CRow>
      <CCol sm="12">
        <CCard>
          <CCardHeader>
            <strong>Tesis Listesi</strong>
            <div class="card-header-actions">
              <small v-text="mode === 'new' ? 'Yeni' : 'Düzenle'"></small>
            </div>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol sm="4">
                <img
                    class="crop-image pick-logo-team"
                    :src="uploaded"
                    alt="Image not found"
                />
              </CCol>
              <CCol sm="8">
                <CRow>
                  <CCol sm="6">
                    <CInput
                        v-model="formData.name"
                        label="Tesis Adı"
                        placeholder="Tesis Adı"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CTextarea
                        label="Adres"
                        v-model="formData.address"
                        placeholder="Adres"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Telefon 1"
                        v-model="formData.phone1"
                        placeholder="Telefon 1"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Telefon 2"
                        v-model="formData.phone2"
                        placeholder="Telefon 2"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Mail"
                        v-model="formData.mail"
                        placeholder="Mail"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Website"
                        v-model="formData.website"
                        placeholder="Website"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Saha Eni"
                        v-model="formData.width"
                        placeholder="Saha Eni"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Saha Boyu"
                        v-model="formData.height"
                        placeholder="Saha Boyu"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.status"
                        label="Durumu"
                        :options="[{
          value: 0,
          label: 'Pasif'
        },{
          value: 1,
          label: 'Aktif'
        }]"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.provinceId"
                        label="İl"
                        @change="provinceChanged()"
                        :options="
                        provinces.map((p) => ({
                          value: p.id,
                          label: p.name,
                        }))
                      "
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.districtId"
                        label="İlçe"
                        :options="
                        districts.map((p) => ({
                          value: p.id,
                          label: p.name,
                        }))
                      "
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Enlem"
                        v-model="formData.latitude"
                        placeholder="Enlem"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Boylam"
                        v-model="formData.longitude"
                        placeholder="Boylam"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Yetkili Adı"
                        v-model="formData.ownerName"
                        placeholder="Yetkili Adı"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CInput
                        label="Yetkili Soyadı"
                        v-model="formData.ownerSurname"
                        placeholder="Yetkili Soyadı"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.hasShop"
                        label="Kantin Olanağı"
                        :options="resources"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.hasShower"
                        label="Duş Olanağı"
                        :options="resources"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.hasHeat"
                        label="Isıtma Olanağı"
                        :options="resources"
                    />
                  </CCol>

                  <CCol sm="6">
                    <CSelect
                        :value.sync="formData.hasCold"
                        label="Soğutma Olanağı"
                        :options="resources"
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>

            <hr/>
            <CRow>
              <CCol sm="12" class="text-right">
                <CButton
                    v-if="mode !== 'new'"
                    @click="update(id)"
                    size="sm"
                    color="primary"
                    class="mr-1"
                >Kaydet
                </CButton>
                <CButton
                    v-else
                    @click="create()"
                    size="sm"
                    color="primary"
                    class="mr-1"
                >Yeni Ekle
                </CButton>
                <CButton
                    @click="clean()"
                    size="sm"
                    variant="outline"
                    color="primary"
                    class="mr-1"
                >Temizle
                </CButton>
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
              Tesisler
            </slot>
          </CCardHeader>
          <CCardBody>
            <CDataTable
                :columnFilter="true"
                :hover="true"
                :striped="true"
                :items="places"
                :fields="[
                {
                  key: 'id',
                  label: 'ID',
                },
                {
                  key: 'name',
                  label: 'Tesis Adı',
                },
                {
                  key: 'address',
                  label: 'Adresi',
                },
                {
                  key: 'phone1',
                  label: 'Telefon 1.',
                },
                {
                  key: 'width',
                  label: 'Saha Eni',
                },
                {
                  key: 'height',
                  label: 'Saha Boyu',
                },
                {
                  key: 'image',
                  label: 'Resmi',
                },
                {
                  key: 'status',
                  label: 'Durumu',
                },
                {
                  key: 'province',
                  label: 'İl',
                },
                {
                  key: 'district',
                  label: 'İlçe',
                },
                {
                  key: 'latitude',
                  label: 'Enlem',
                },
                {
                  key: 'longitude',
                  label: 'Boylam',
                },
                {
                  key: 'ownerName',
                  label: 'Yetkili Adı',
                },
                {
                  key: 'ownerSurname',
                  label: 'Yetkili Soyadı',
                },
                {
                  key: 'hasShop',
                  label: 'Kantin Olanağı',
                },
                {
                  key: 'hasShower',
                  label: 'Duş Olanağı',
                },
                {
                  key: 'hasHeat',
                  label: 'Isıtma Olanağı',
                },
                {
                  key: 'hasCold',
                  label: 'Soğutma Olanağı',
                },
                 {
                  key: 'actions',
                  label: 'Aksiyonlar',
                },
              ]"
                :items-per-page="10"
                pagination
            >
              >
              <template #image="{ item }">
                <td>
                  <img
                      class="list-image"
                      :src="
                      item.image
                        ? `${$axios.defaults.baseURL}/uploads/${item.image}`
                        : 'img/avatars/logo.png'
                    "
                      alt="Image not found"
                      onerror="this.onerror=null;this.src='img/avatars/logo.png';"
                  />
                </td>
              </template>
              <template #registrationDate="{ item }">
                <td>{{ item.registrationDate | moment("DD.MM.YYYY") }}</td>
              </template>
              <template #province="{ item }">
                <td>{{ item.province.name }}</td>
              </template>
              <template #district="{ item }">
                <td>{{ item.district.name }}</td>
              </template>
              <template #hasShop="{ item }">
                <td>{{ !!item.hasShop ? "Var" : "Yok" }}</td>
              </template>
              <template #hasShower="{ item }">
                <td>{{ !!item.hasShower ? "Var" : "Yok" }}</td>
              </template>
              <template #hasHeat="{ item }">
                <td>{{ !!item.hasHeat ? "Var" : "Yok" }}</td>
              </template>
              <template #hasCold="{ item }">
                <td>{{ !!item.hasCold ? "Var" : "Yok" }}</td>
              </template>
              <template #actions="{ item }">
                <td>
                  <CButton
                      @click="edit(item)"
                      size="sm"
                      variant="outline"
                      color="primary"
                      class="mr-1"
                  >Düzenle
                  </CButton>
                  <CButton
                      @click="remove(item.id)"
                      size="sm"
                      variant="outline"
                      color="danger"
                  >Sil
                  </CButton>
                </td>
              </template>
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <avatar-cropper
        @uploaded="handleUploaded"
        trigger=".pick-logo-team"
        :labels="{ cancel: 'Vazgeç', submit: 'Onayla' }"
        :uploadUrl="`${$axios.defaults.baseURL}/file`"
    />
  </div>
</template>

<script>
import AvatarCropper from "vue-avatar-cropper";
import { mapState } from "vuex";

export default {
  name: "Places",
  components: {AvatarCropper},
  data() {
    return {
      mode: "new",
      places: [],
      provinces: [],
      districts: [],
      roles: [
        {value: "", label: "Görev Seçilmedi"},
        {value: "Hakem", label: "Hakem"},
        {value: "Gözlemci", label: "Gözlemci"},
      ],
      resources: [
        {value: "", label: "Olanak Seçilmedi"},
        {value: "true", label: "Var"},
        {value: "false", label: "Yok"},
      ],
      id: null,
      formData: {
        name: "",
        address: "",
        phone1: "",
        phone2: "",
        mail: "",
        website: "",
        width: "",
        height: "",
        image: "",
        status: "",
        districtId: "",
        provinceId: "",
        placeStatus: "",
        latitude: "",
        longitude: "",
        ownerName: "",
        ownerSurname: "",
        hasShop: "",
        hasShower: "",
        hasHeat: "",
        hasCold: "",
      },
      uploaded: "img/avatars/logo.png",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    edit(i) {
      this.mode = "edit";
      this.formData = {...i};
      this.uploaded = i.image
          ? `${this.$axios.defaults.baseURL}/uploads/${i.image}`
          : "img/avatars/logo.png";
      this.id = i.id;
      delete this.formData.id;
    },
    clean() {
      this.mode = "new";
      this.formData = {
        name: "",
        address: "",
        phone1: "",
        phone2: "",
        mail: "",
        website: "",
        width: "",
        height: "",
        image: "",
        status: "",
        districtId: "",
        provinceId: "",
        placeStatus: "",
        latitude: "",
        longitude: "",
        ownerName: "",
        ownerSurname: "",
        hasShop: "",
        hasShower: "",
        hasHeat: "",
        hasCold: "",
      };
      this.uploaded = "img/avatars/logo.png";
      this.id = null;
    },
    provinceChanged: function(){      
      this.getDistricts().then(({data}) => {
        this.districts = [
          {
            id: "0",
            name: "İlçe Seçilmedi",
          },
          ...data,
        ];
      });
    },
    update: function (id) {
      this.$axios
          .put(`/places/${id}`, this.formData)
          .then(() => {
            this.getPlaces().then(({data}) => {
              this.places = data;
            });
            this.clean();
          })
          .catch((err) => {
            console.log(err);
          });
    },
    create: function () {
      this.$axios
          .post("/places", this.formData)
          .then(() => {
            this.getPlaces().then(({data}) => {
              this.places = data;
            });
            this.clean();
          })
          .catch((err) => {
            console.log(err);
          });
    },
    remove: function (id) {
      if (confirm("Silmek istediğinize emin misiniz")) {
        this.$axios
            .delete(`/places/${id}`)
            .then(() => {
              this.getPlaces().then(({data}) => {
                this.places = data;
              });
            })
            .catch((err) => {
              console.log(err);
            });
      }
    },
    getPlaces: function () {
      const provinceFilter =
        this.user.role === "SuperAdmin"
          ? ""
          : `&provinceId=${this.user.provinceId}`;
      return this.$axios.get(`/places?associations=province,district${provinceFilter}`).then((res) => {
        return res;
      });
    },
    getProvinces: function () {
      return this.$axios.get("/provinces").then((res) => {
        return res;
      });
    },
    getDistricts: function () {
      return this.$axios.get("/districts?provinceId=" + this.formData.provinceId).then((res) => {
        return res;
      });
    },
    handleUploaded(e) {
      this.formData.image = e.fileName;
      this.uploaded = `${this.$axios.defaults.baseURL}/uploads/${e.fileName}`;
    },
  },
  mounted() {
    this.getProvinces().then(({data}) => {
      this.provinces = [
        {
          id: "0",
          name: "İl Seçilmedi",
        },
        ...data,
      ];
    });
    this.getPlaces().then(({data}) => {
      this.places = data;
    });
  },
  // watch: {
  //   'formData.provinceId'(oldValue, newValue) {
  //     console.log('province changed');
  //   }
  // },
};
</script>
<style>
.list-image {
  width: 35px;
}

.crop-image {
  max-width: 100%;
}
</style>